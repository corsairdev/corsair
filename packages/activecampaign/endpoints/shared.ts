import { AuthMissingError } from 'corsair/core';

/**
 * Strips keys whose value is `undefined`.
 *
 * ActiveCampaign distinguishes an absent field from an explicit `null`:
 * omitting a field leaves the stored value alone, while sending `null` clears
 * it. `JSON.stringify` drops `undefined` from objects but not from the shape
 * callers build up conditionally, so compacting here keeps "leave this alone"
 * from being serialised as "clear this".
 */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) {
			out[key] = value;
		}
	}
	return out;
}

/**
 * Same rule as {@link compactBody}, for query strings. A `undefined` query
 * value would otherwise be serialised as the literal string "undefined".
 */
export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			out[key] = value;
		}
	}
	return out;
}

/**
 * ActiveCampaign's REST collections share one pagination contract: `limit` and
 * `offset` query parameters, the rows under a resource-named key, and the
 * total under `meta.total`. Declared once here and reused by every list
 * operation so the envelope cannot drift between resources.
 *
 * The default page size is 20 and the documented maximum is 100; a caller
 * asking for more than 100 would be silently capped by the API, so the limit
 * is clamped here where it is visible instead.
 *
 * @see https://developers.activecampaign.com/reference/pagination
 */
export const AC_PAGE_SIZE_DEFAULT = 20;
export const AC_PAGE_SIZE_MAX = 100;

export function buildPaginationQuery(input: {
	limit?: number;
	offset?: number;
}): Record<string, string | number | boolean | undefined> {
	const limit =
		input.limit === undefined
			? undefined
			: Math.min(Math.max(input.limit, 1), AC_PAGE_SIZE_MAX);
	return compactQuery({ limit, offset: input.offset });
}

/**
 * Resolves the account slug - the second half of the ActiveCampaign
 * credential.
 *
 * Declared once here rather than per endpoint file. It raises rather than
 * returning an empty string, because an empty slug would otherwise be
 * interpolated into the base URL and the failure would surface as a confusing
 * transport error against `https://.api-us1.com` instead of as the missing
 * credential it actually is.
 *
 * `AuthMissingError` is the core's own signal for this, so the runtime can
 * tell a configuration gap apart from an API failure.
 */
export async function resolveAccount(ctx: {
	options?: { account?: string };
	keys?: { get_account?: () => Promise<string | null | undefined> };
}): Promise<string> {
	const account =
		ctx.options?.account ?? (await ctx.keys?.get_account?.()) ?? '';

	if (!account) {
		throw new AuthMissingError(
			'activecampaign',
			'account',
			'[auth-missing:activecampaign:account]: an ActiveCampaign account slug is required - it is the subdomain of your API URL, https://<account>.api-us1.com',
		);
	}

	return account;
}
