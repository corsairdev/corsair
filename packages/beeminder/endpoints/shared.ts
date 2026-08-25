import type { BeeminderRequestOptions } from '../client';
import { makeBeeminderRequest } from '../client';

/**
 * Minimal structural view of the plugin context these helpers need.
 */
type BeeminderCallContext = {
	key: string;
	options: { username?: string | undefined };
	keys?: { get_username?: () => Promise<string | null | undefined> };
};

/**
 * Resolves the account's username for a call.
 *
 * Beeminder uses "me" as a username alias when the access_token identifies
 * the user, but for personal auth tokens, the username is needed in the URL.
 * Configuration wins, then a stored key.
 */
export async function resolveUsername(
	ctx: BeeminderCallContext,
): Promise<string> {
	const configured = ctx.options.username;
	if (configured) return configured;

	const stored = await ctx.keys?.get_username?.();
	if (stored) return stored;

	return 'me';
}

/**
 * Issues an authenticated Beeminder request.
 *
 * Every authenticated operation goes through here so the credential assembly
 * cannot be done correctly in one place and forgotten in another.
 */
export async function beeminderCall<T>(
	ctx: BeeminderCallContext,
	endpoint: string,
	options: BeeminderRequestOptions = {},
): Promise<T> {
	const username = await resolveUsername(ctx);
	// Replace {username} placeholder in the endpoint path
	const resolvedEndpoint = endpoint.replace('{username}', username);

	return await makeBeeminderRequest<T>(resolvedEndpoint, ctx.key, options);
}

/**
 * Drops keys whose value is `undefined`.
 *
 * Beeminder distinguishes an absent field from an explicit `null` on some
 * routes. Unset fields are removed before the body is built.
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
