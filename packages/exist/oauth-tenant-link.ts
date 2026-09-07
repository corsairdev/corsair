import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';
import { EXIST_API_BASE } from './client';

/** Upper bound on the profile lookup performed during the OAuth2 callback. */
const PROFILE_FETCH_TIMEOUT_MS = 10_000;

/**
 * After an OAuth2 exchange, records the Exist username as the account's
 * `tenant_external_id`. Exist's token response carries no user identifier, so
 * the username is read from the profile endpoint — it is the only stable,
 * user-facing id the API exposes.
 *
 * @see https://developer.exist.io/reference/users/
 */
export async function resolveExistOAuthTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const directId = toExternalId(tokens.tenant_external_id ?? tokens.username);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const response = await fetch(`${EXIST_API_BASE}/accounts/profile/`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${accessToken}` },
			// This runs inside the OAuth callback, so a hung Exist request must
			// not stall the exchange. Matches the 10s budget used by the other
			// Corsair tenant-link resolvers.
			signal: AbortSignal.timeout(PROFILE_FETCH_TIMEOUT_MS),
		});
		if (!response.ok) return null;

		const payload = (await response.json()) as { username?: string };
		const username = toExternalId(payload.username);
		return username
			? { linkType: 'tenant_external_id', externalId: username }
			: null;
	} catch {
		return null;
	}
}
