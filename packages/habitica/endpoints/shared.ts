import type { HabiticaCredentials, HabiticaRequestOptions } from '../client';
import {
	HabiticaUserIdMissingError,
	makeHabiticaAnonymousRequest,
	makeHabiticaExportRequest,
	makeHabiticaRequest,
	makeHabiticaTextRequest,
} from '../client';

/**
 * Minimal structural view of the plugin context these helpers need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else the
 * concrete context exposes.
 */
type HabiticaCallContext = {
	key: string;
	options: { userId?: string | undefined };
	keys?: { get_user_id?: () => Promise<string | null | undefined> };
};

/**
 * Resolves the account's user id for a call.
 *
 * Habitica's credential has two halves - `x-api-user` and `x-api-key` - and
 * both are checked. A valid token paired with a different account's user id is
 * answered 401 `There is no account that uses those credentials.`, so the id is
 * a credential rather than a routing hint the token could imply.
 *
 * Configuration wins, then a stored key. There is deliberately **no discovery
 * fallback**, which is where this differs from Harvest: Harvest can ask
 * `/accounts` which accounts a token reaches, but every authenticated Habitica
 * route requires the user id already, so no route exists that could discover
 * it. Failing here with an explanation is the only honest option.
 */
export async function resolveUserId(ctx: HabiticaCallContext): Promise<string> {
	const configured = ctx.options.userId;
	if (configured) return configured;

	const stored = await ctx.keys?.get_user_id?.();
	if (stored) return stored;

	throw new HabiticaUserIdMissingError();
}

async function credentialsFor(
	ctx: HabiticaCallContext,
): Promise<HabiticaCredentials> {
	return { userId: await resolveUserId(ctx), apiToken: ctx.key };
}

/**
 * Issues an authenticated Habitica request.
 *
 * Every authenticated operation goes through here so the two-part credential
 * cannot be assembled correctly in one place and forgotten in another.
 */
export async function habiticaCall<T>(
	ctx: HabiticaCallContext,
	endpoint: string,
	options: HabiticaRequestOptions = {},
): Promise<T> {
	const response = await makeHabiticaRequest<unknown>(
		endpoint,
		await credentialsFor(ctx),
		options,
	);
	return unwrap<T>(response);
}

/**
 * Issues a request to a route that takes no credentials.
 *
 * `/status`, `/content` and `/models/:model/paths` are answered without
 * authentication. They are routed separately rather than through
 * {@link habiticaCall} so that a missing user id cannot make an anonymous
 * operation fail for a credential it never needed.
 */
export async function habiticaAnonymousCall<T>(
	endpoint: string,
	options: HabiticaRequestOptions = {},
): Promise<T> {
	const response = await makeHabiticaAnonymousRequest<unknown>(
		endpoint,
		options,
	);
	return unwrap<T>(response);
}

/** Reads one of the three `/export/*` documents, which sit outside `/api/v3`. */
export async function habiticaExportCall(
	ctx: HabiticaCallContext,
	document: 'userdata.json' | 'history.csv' | 'inbox.html',
): Promise<{ body: string; contentType: string }> {
	return await makeHabiticaExportRequest(document, await credentialsFor(ctx));
}

/**
 * Reads a versioned-API route that answers with text rather than JSON.
 *
 * Only the challenge CSV export needs this. It is kept separate from
 * {@link habiticaExportCall} because the two use different base URLs, and
 * collapsing them into one helper with a flag would hide that difference.
 */
export async function habiticaExportRaw(
	ctx: HabiticaCallContext,
	endpoint: string,
): Promise<{ body: string; contentType: string }> {
	return await makeHabiticaTextRequest(endpoint, await credentialsFor(ctx));
}

/**
 * Unwraps Habitica's response envelope.
 *
 * Every `/api/v3` response is `{"success":true,"data":...}`, with the payload
 * one level down. Endpoints return the payload rather than the envelope,
 * because `success` is redundant with the status code the transport already
 * checked, and callers should not have to reach through a wrapper that carries
 * no information.
 *
 * A response that is not shaped like the envelope is returned as-is rather than
 * being treated as an error: the three `/export/*` documents and the challenge
 * CSV are not enveloped at all, and neither is anything a future route decides
 * to return bare.
 */
export function unwrap<T>(response: unknown): T {
	if (
		response !== null &&
		typeof response === 'object' &&
		'data' in response &&
		'success' in response
	) {
		return (response as { data: T }).data;
	}
	return response as T;
}

/**
 * Drops keys whose value is `undefined`.
 *
 * Habitica distinguishes an absent field from an explicit `null` on its update
 * routes: `PUT /tasks/:taskId` leaves a field alone when it is omitted, and a
 * request that serialised `undefined` would produce neither behaviour. Unset
 * fields are removed before the body is built.
 */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const compacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

/** Same as {@link compactBody}, for query strings. */
export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const compacted: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

/**
 * Percent-encodes a value used as a path segment.
 *
 * Several Habitica paths interpolate values that are not opaque ids and can
 * legitimately contain characters that change what the path means - a coupon
 * code, a quest key, a pinned item's dotted `path`, an equipment `key`. Left
 * raw, a value containing `/` or `?` would silently address a different route.
 */
export function pathSegment(value: string | number): string {
	return encodeURIComponent(String(value));
}
