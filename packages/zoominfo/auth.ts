import { AuthMissingError } from 'corsair/core';
import type { ZoominfoCredentials } from './client';
import { authenticateZoominfo, isTokenUsable } from './client';

/**
 * The slice of the account key manager the token resolver needs. Declared
 * structurally so both `keyBuilder` and `subscribe` can pass their own ctx.
 */
export type ZoominfoAuthContext = {
	tenantId: string;
	keys: {
		get_access_token: () => Promise<string | null | undefined>;
		get_expires_at: () => Promise<string | null | undefined>;
		get_integration_credentials: () => Promise<{
			[key: string]: string | null | undefined;
		}>;
		set_access_token: (value: string) => Promise<unknown>;
		set_expires_at: (value: string) => Promise<unknown>;
	};
};

/**
 * In-flight /authenticate calls, keyed by tenant. Only deduplicates within one
 * process; the persisted token is what stops repeat work across processes.
 */
const inFlightAuth = new Map<string, Promise<string>>();

/** Picks whichever of the two documented auth flows the account is set up for. */
export function selectZoominfoCredentials(credentials: {
	[key: string]: string | null | undefined;
}): ZoominfoCredentials | null {
	const username = credentials.zoominfo_username;
	if (!username) return null;

	if (credentials.zoominfo_client_id && credentials.zoominfo_private_key) {
		return {
			kind: 'pki',
			username,
			clientId: credentials.zoominfo_client_id,
			privateKey: credentials.zoominfo_private_key,
		};
	}

	if (credentials.zoominfo_password) {
		return {
			kind: 'basic',
			username,
			password: credentials.zoominfo_password,
		};
	}

	return null;
}

/**
 * Returns a JWT for the account, minting one only when the stored token is
 * missing or nearly expired. Shared by `keyBuilder` (every API call) and
 * `subscribe` (arming the webhook at connect time) so both go through the same
 * cache and the same single-flight guard.
 */
export async function resolveZoominfoToken(
	ctx: ZoominfoAuthContext,
	{ baseUrl }: { baseUrl?: string } = {},
): Promise<string> {
	const [accessToken, expiresAt, credentials] = await Promise.all([
		ctx.keys.get_access_token(),
		ctx.keys.get_expires_at(),
		ctx.keys.get_integration_credentials(),
	]);

	// The JWT lasts an hour and ZoomInfo asks callers not to mint a new one per
	// request, so a cached token is reused until it is nearly expired.
	if (accessToken && isTokenUsable(accessToken, expiresAt)) {
		return accessToken;
	}

	const selected = selectZoominfoCredentials(credentials);
	if (!selected) {
		throw new AuthMissingError('zoominfo', 'oauth_2');
	}

	// Concurrent requests that all find the token expired would each mint their
	// own JWT, which is what ZoomInfo asks callers not to do. The first one
	// through does the work and the rest await its result.
	const pending = inFlightAuth.get(ctx.tenantId);
	if (pending) return pending;

	const attempt = (async () => {
		const token = await authenticateZoominfo(selected, { baseUrl });

		try {
			// Written in this order, and not concurrently: if the expiry landed
			// while the token write failed, the old token would look fresh for an
			// hour. This way a failure leaves the old expiry, which at worst costs
			// one extra /authenticate call.
			await ctx.keys.set_access_token(token.accessToken);
			await ctx.keys.set_expires_at(String(token.expiresAt));
		} catch (error) {
			console.warn(
				`[corsair:zoominfo] Obtained a JWT but failed to persist it: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		}

		return token.accessToken;
	})();

	inFlightAuth.set(ctx.tenantId, attempt);
	try {
		return await attempt;
	} finally {
		inFlightAuth.delete(ctx.tenantId);
	}
}
