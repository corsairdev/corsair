import { AuthMissingError } from 'corsair/core';

/** Strips keys whose value is `undefined` so they don't get serialised as literal "undefined". */
export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/**
 * Resolves the account subdomain - the second half of the Workable
 * credential, https://<subdomain>.workable.com.
 *
 * Raises rather than returning an empty string so a missing subdomain
 * surfaces as the configuration gap it is, instead of a confusing transport
 * error against `https://.workable.com`.
 */
export async function resolveAccount(ctx: {
	options?: { account?: string };
	keys?: { get_account?: () => Promise<string | null | undefined> };
}): Promise<string> {
	const account =
		ctx.options?.account ?? (await ctx.keys?.get_account?.()) ?? '';

	if (!account) {
		throw new AuthMissingError(
			'workable',
			'account',
			'[auth-missing:workable:account]: a Workable account subdomain is required - it is the subdomain of your account URL, https://<subdomain>.workable.com',
		);
	}

	return account;
}

/** Shared `limit`/`since_id`/`max_id` cursor pagination used by jobs, candidates, members, events. */
export function buildCursorPaginationQuery(input: {
	limit?: number;
	since_id?: string;
	max_id?: string;
}): Record<string, string | number | boolean | undefined> {
	return compactQuery({
		limit: input.limit,
		since_id: input.since_id,
		max_id: input.max_id,
	});
}
