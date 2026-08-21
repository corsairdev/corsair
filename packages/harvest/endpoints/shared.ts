import type { HarvestRequestOptions } from '../client';
import { discoverHarvestAccountId, makeHarvestRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else the
 * concrete context exposes.
 */
type HarvestCallContext = {
	key: string;
	options: { accountId?: string | undefined };
	keys?: { get_account_id?: () => Promise<string | null | undefined> };
};

/**
 * Resolves the account id for a call.
 *
 * Harvest needs an account id alongside the token because one token can reach
 * several accounts. Configuration wins; a stored key is next; discovery through
 * Harvest ID is the last resort and only succeeds when the token can reach
 * exactly one Harvest account.
 */
export async function resolveAccountId(
	ctx: HarvestCallContext,
): Promise<string> {
	const configured = ctx.options.accountId;
	if (configured) return configured;

	const stored = await ctx.keys?.get_account_id?.();
	if (stored) return stored;

	return await discoverHarvestAccountId(ctx.key);
}

/**
 * Issues a Harvest request, resolving the account id first.
 *
 * Every operation goes through here so that account resolution cannot be
 * forgotten in one place and applied in another.
 */
export async function harvestCall<T>(
	ctx: HarvestCallContext,
	endpoint: string,
	options: HarvestRequestOptions = {},
): Promise<T> {
	const accountId = await resolveAccountId(ctx);
	return await makeHarvestRequest<T>(endpoint, ctx.key, accountId, options);
}

/**
 * Drops keys whose value is `undefined`.
 *
 * Harvest distinguishes an absent field from an explicit `null`: sending
 * `{"name": null}` on a PATCH clears the field, whereas omitting it leaves the
 * value alone. Serialising `undefined` would produce neither, so unset fields
 * are removed before the body is built.
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
