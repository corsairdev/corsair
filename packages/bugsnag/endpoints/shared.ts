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

/* -------------------------------------------------------------------------- */
/*                              Query construction                            */
/* -------------------------------------------------------------------------- */

/**
 * Why this plugin builds its own query strings instead of using the transport's.
 *
 * `request()` serialises `options.query` with `getQueryString`
 * (`packages/corsair/async-core/request.ts:62-76`), which makes two choices that are
 * wrong for this API. Both were established by live probing, not by reading:
 *
 * **1. Arrays become repeated bare keys.** It emits `collaborator_ids=a&collaborator_ids=b`.
 * BugSnag is a Rails API and requires the bracketed form; the bare form is rejected
 * outright:
 *
 * ```
 * ?collaborator_ids=<id>     -> 400 {"errors":["Collaborator_ids must be an array"]}
 * ?collaborator_ids[]=<id>   -> 200 [{"collaborator_id":"...","project_count":1}]
 * ```
 *
 * **2. An array of objects loses the `[]` marker, and fails silently.** For
 * `{filters: {'error.status': [a, b]}}` it emits
 * `filters[error.status][type]=..&filters[error.status][value]=..` twice. Rails resolves
 * repeated identical keys last-wins, so a two-comparison filter would quietly mean
 * only the second comparison. Not an error - a different query than the caller asked
 * for, answered 200.
 *
 * The correct form, confirmed by effect, is `filters[field][][type]` with the `type`
 * and `value` of each comparison **adjacent**:
 *
 * ```
 * ...[][type]=eq&...[][value]=open&...[][type]=eq&...[][value]=fixed   -> 200, 3 rows
 * ...[][type]=eq&...[][type]=eq&...[][value]=open&...[][value]=fixed   -> 400
 * ```
 *
 * Grouping the keys is rejected, so pair-adjacency is a requirement rather than a
 * preference, and a generic serialiser cannot be relied on to preserve it. Hence one
 * mechanism for every operation here: the query string is assembled explicitly, and
 * the tests assert the exact string.
 */

/** A single filter comparison, e.g. `{ type: 'eq', value: 'open' }`. */
export type BugsnagFilterComparison = Record<string, unknown>;

/**
 * A filter object keyed by event field display id. Each field carries one comparison
 * or several.
 *
 * **A field name the project does not define is silently ignored.** Verified live: on
 * a project with three `error`/`warning` errors, filtering
 * `error.severity` (not a real field - the real one is `event.severity`) returned all
 * three rows with 200, and so did a wholly invented `totally.made.up`. Only
 * `event.severity` returned 0.
 *
 * So a mistyped field name does not fail, it returns unfiltered data - which is worse
 * than an error, because the caller believes the filter applied. Valid names for a
 * project come from `event_fields.list`, and are not hard-coded here because they
 * differ per project and include whatever custom fields the account defined.
 */
export type BugsnagFilters = Record<
	string,
	BugsnagFilterComparison | BugsnagFilterComparison[]
>;

/** Scalar and array values a query parameter may take. */
export type BugsnagQueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| undefined;

const encode = (value: string) => encodeURIComponent(value);

/**
 * Orders the keys of one comparison deterministically: `type`, then `value`, then
 * anything else alphabetically.
 *
 * Determinism is what makes the emitted string assertable in a test. `type` and
 * `value` lead because they are the pair the API requires, and keeping them first
 * keeps a comparison's own keys contiguous.
 */
function comparisonEntries(
	comparison: BugsnagFilterComparison,
): [string, string][] {
	const rest = Object.keys(comparison)
		.filter((key) => key !== 'type' && key !== 'value')
		.sort();
	return (['type', 'value', ...rest] as const)
		.filter((key) => comparison[key] !== undefined)
		.map((key) => [key, serialiseComparisonValue(key, comparison[key])]);
}

/**
 * Renders one comparison value, refusing the shapes `String()` would mangle.
 *
 * This matters because `String()` produces something plausible for values that cannot be
 * expressed in a query string, and the API would then filter on the wrong thing while
 * answering 200:
 *
 * ```
 * String(null)        -> "null"     filters for the literal text "null"
 * String([1, 2])      -> "1,2"      filters for the literal text "1,2"
 * String({a: 1})      -> "[object Object]"
 * ```
 *
 * A filter that silently means something else is the worst outcome on this API - an
 * unrecognised *field* is already ignored without complaint, so a caller has little chance
 * of noticing a value that was quietly rewritten. Failing loudly is the only honest
 * option.
 *
 * `null` is rejected rather than dropped: BugSnag expresses emptiness through the
 * comparison `type` rather than a null value, so a caller passing `null` has misunderstood
 * the shape and should be told, not have it silently omitted.
 */
function serialiseComparisonValue(key: string, value: unknown): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'boolean') return String(value);
	// `Number.isFinite` rather than `typeof value === 'number'`, because `NaN`,
	// `Infinity` and `-Infinity` are all numbers and `String()` renders them as the
	// text `"NaN"` and `"Infinity"`. Those would be sent as filter values and matched
	// literally - the same silent-corruption failure this function exists to prevent,
	// which an earlier version of it let through.
	if (Number.isFinite(value)) return String(value);
	throw new TypeError(
		`BugSnag filter comparison '${key}' must be a string, a boolean or a finite ` +
			`number; received ${describeRejectedValue(value)}. A query string cannot ` +
			`express that shape, and String() would have silently filtered on its text ` +
			`form instead. Use several comparisons for several values, and express ` +
			`emptiness with the comparison type rather than a null value.`,
	);
}

/** Names a rejected value precisely enough to be actionable, without printing it. */
function describeRejectedValue(value: unknown): string {
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'an array';
	if (typeof value === 'number') {
		// Distinguished because "received number" would be baffling when the caller did
		// pass a number - the problem is which number.
		return Number.isNaN(value) ? 'NaN' : 'a non-finite number';
	}
	return typeof value;
}

/**
 * Builds a query string for the Data Access API.
 *
 * Returns `''` when there is nothing to send, so a caller can append it
 * unconditionally. Filters are emitted last so the paging parameters stay readable at
 * the front of a URL in a log or a test failure.
 */
export function buildQuery(
	params: Record<string, BugsnagQueryValue> = {},
	filters?: BugsnagFilters,
): string {
	const parts: string[] = [];

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			// The bracketed form, because the bare repeated form is rejected.
			for (const item of value) {
				parts.push(`${encode(`${key}[]`)}=${encode(String(item))}`);
			}
			continue;
		}
		parts.push(`${encode(key)}=${encode(String(value))}`);
	}

	for (const [field, comparison] of Object.entries(filters ?? {})) {
		const comparisons = Array.isArray(comparison) ? comparison : [comparison];
		for (const one of comparisons) {
			// Emitted per comparison rather than per key, which is what keeps each
			// `type`/`value` pair adjacent.
			for (const [key, value] of comparisonEntries(one)) {
				parts.push(
					`${encode(`filters[${field}][][${key}]`)}=${encode(String(value))}`,
				);
			}
		}
	}

	return parts.length > 0 ? `?${parts.join('&')}` : '';
}

/** Appends a query string to a path. */
export function withQuery(
	path: string,
	params: Record<string, BugsnagQueryValue> = {},
	filters?: BugsnagFilters,
): string {
	return `${path}${buildQuery(params, filters)}`;
}

/**
 * Pagination on this API is **header-driven and offset-based**, which is worth
 * spelling out because it differs from most providers.
 *
 * A list response is a **bare JSON array** - there is no envelope wrapping the rows -
 * and the paging state arrives in headers instead:
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
 * `per_page=1&offset=0..2` returned three distinct single-row pages. A caller pages by
 * incrementing `offset` until a short or empty page arrives.
 *
 * **Two limits a caller has to know about, both mapped live on the error list:**
 *
 * ```
 * offset 0..2     -> 1 row each      (3 records exist)
 * offset 3..100   -> empty array     - past the end, the signal to stop
 * offset 1000+    -> 422, code 60000 - too deep to answer, a refusal
 * ```
 *
 * An empty page and a 422 mean different things, and only the first means "stop". The
 * cap is on `offset` alone rather than `offset x per_page` - `per_page=100&offset=100`
 * answers 200 while `per_page=100&offset=9999` answers 422. The 422 message suggests
 * `sort=unsorted`, which is a dead end here: combined with an offset it answers
 * `{"errors":["Pagination Offset is invalid"]}`. Offset paging and unsorted results are
 * mutually exclusive, so paging beyond roughly a thousand rows needs the `base`/`Link`
 * cursor that the transport cannot surface. That is a real limit of this plugin.
 *
 * **And offset is not honoured uniformly.** The project list ignores it outright:
 * `offset=9999` returns the account's single project rather than an empty page, and does
 * not 422 either. So the strong paging guarantees hold for the error list, and elsewhere
 * only the weak claim - that the parameters are accepted - is safe to make.
 *
 * `per_page` is not enforced as a maximum - `per_page=1000` was answered 200 - so
 * the input schema bounds it conservatively rather than relying on the API.
 */
export function listParams(input: {
	per_page?: number | undefined;
	offset?: number | undefined;
}): Record<string, BugsnagQueryValue> {
	return { per_page: input.per_page, offset: input.offset };
}
