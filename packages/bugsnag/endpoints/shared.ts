import type { BugsnagRequestOptions } from '../client';
import { makeBugsnagRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else the
 * concrete context exposes.
 *
 * BugSnag needs nothing beyond the personal auth token - there is no account id,
 * organization header or subdomain to resolve, so there is no resolution chain and
 * no discovery fallback.
 */
type BugsnagCallContext = {
	key: string;
};

/** Issues an authenticated request against the Data Access API. */
export async function bugsnagCall<T>(
	ctx: BugsnagCallContext,
	endpoint: string,
	options: BugsnagRequestOptions = {},
): Promise<T> {
	return await makeBugsnagRequest<T>(endpoint, ctx.key, options);
}

/**
 * Drops keys whose value is `undefined`.
 *
 * BugSnag distinguishes an absent field from an explicit `null` on a PATCH:
 * omitting a field leaves the stored value alone, whereas sending `null` clears it.
 * Serialising `undefined` would produce neither, so unset fields are removed before
 * the body is built.
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
 * Pagination on this API is **header-driven and offset-based**, which is worth
 * spelling out because it differs from most providers.
 *
 * A list response is a **bare JSON array** - there is no envelope wrapping the rows
 * - and the paging state arrives in headers instead:
 *
 * ```
 * link: <https://api.bugsnag.com/projects/{id}/errors?base=...&offset=1&per_page=1>; rel="next"
 * x-total-count: 3
 * ```
 *
 * The shared transport cannot surface those. `request()` returns
 * `responseHeader ?? responseBody` (`packages/corsair/async-core/request.ts:379`),
 * so a call yields **either** the parsed body **or** one named header, never both.
 * A plugin therefore cannot return the rows and their `Link` header together, and
 * a caller cannot follow `rel="next"`.
 *
 * So these operations page by the same `offset` and `per_page` parameters the
 * `Link` URL itself uses, both exposed on every list input and verified live:
 * `per_page=1&offset=0..2` returned three distinct single-row pages, and an offset
 * past the end returned an empty array rather than an error. A caller pages by
 * incrementing `offset` until a short or empty page arrives.
 *
 * `per_page` is not enforced as a maximum - `per_page=1000` was answered 200 - so
 * the input schema bounds it conservatively rather than relying on the API.
 */
export function listQuery(
	input: {
		per_page?: number | undefined;
		offset?: number | undefined;
	},
	extra: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	return compactQuery({
		per_page: input.per_page,
		offset: input.offset,
		...extra,
	});
}
