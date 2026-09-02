import type { BotbabaRequestOptions } from '../client';
import { makeBotbabaRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context.
 */
type BotbabaCallContext = {
	key: string;
	options: Record<string, unknown>;
};

/** Issues a Botbaba request under the plugin's API key. */
export async function botbabaCall<T>(
	ctx: BotbabaCallContext,
	path: string,
	options: BotbabaRequestOptions = {},
): Promise<T> {
	return await makeBotbabaRequest<T>(path, ctx.key, options);
}

/**
 * Drops keys whose value is `undefined`.
 *
 * Botbaba (like most REST APIs) distinguishes an absent field from an
 * explicit `null` on update bodies: omitting a field leaves it alone,
 * `null` clears it. Serialising `undefined` would produce neither, so
 * unset fields are removed before the body is built.
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
export function compactQuery<
	T extends Record<
		string,
		string | number | boolean | string[] | Record<string, string> | undefined
	>,
>(query: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined)
			(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}
