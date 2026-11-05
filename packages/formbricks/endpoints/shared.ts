import type { FormbricksApiVersion, FormbricksRequestOptions } from '../client';
import { makeFormbricksRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without constructing a full
 * Corsair context, and keeps them working whatever else the concrete context exposes.
 */
type FormbricksCallContext = {
	key: string;
	options?: { host?: string };
};

/**
 * Every Formbricks response is wrapped in `{ data }`.
 *
 * Both versions do it, and v2 list endpoints add `{ data, meta }`. That is worth stating because
 * plenty of APIs return bare arrays instead, and carrying that assumption over from another
 * provider would make every schema here reject every response.
 *
 * The envelope is unwrapped here rather than in each endpoint, so the output schemas describe
 * the record a caller actually receives instead of a wrapper around it. `meta` is dropped on
 * purpose: see {@link unwrapList} for how paging is surfaced instead.
 */
type Enveloped<T> = { data: T; meta?: unknown };

function unwrap<T>(payload: Enveloped<T> | T): T {
	if (
		payload !== null &&
		typeof payload === 'object' &&
		'data' in payload &&
		// A record whose own primary key is literally `data` would be ambiguous. None exists -
		// every entity is keyed by `id` - but the check is cheap and the failure would be silent.
		!('id' in payload)
	) {
		return (payload as Enveloped<T>).data;
	}
	return payload as T;
}

/** Issues an authenticated request and unwraps the `{ data }` envelope. */
export async function formbricksCall<T>(
	ctx: FormbricksCallContext,
	version: FormbricksApiVersion,
	endpoint: string,
	options: FormbricksRequestOptions = {},
): Promise<T> {
	const payload = await makeFormbricksRequest<Enveloped<T> | T>(
		version,
		endpoint,
		ctx.key,
		{ ...options, host: ctx.options?.host },
	);
	return unwrap<T>(payload);
}

/**
 * Drops keys whose value is `undefined`.
 *
 * Formbricks distinguishes an absent field from an explicit `null` on an update: omitting a
 * field leaves the stored value alone, whereas sending `null` clears it. Serialising `undefined`
 * would produce neither, so unset fields are removed before the body is built.
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
 * Which wire parameter a list route advances its cursor with.
 *
 * Formbricks is **not consistent about this**, and the inconsistency is invisible: the wrong
 * parameter is accepted with a 200 and silently discarded, so a caller paging with it receives
 * page one forever. Nothing in a status code distinguishes that from success.
 *
 * Every endpoint below was discriminated by *effect* - seed at least three rows, then compare the
 * id returned by `?limit=1` against `?limit=1&offset=1` and `?limit=1&skip=1`:
 *
 * ```
 * route                                 limit  offset  skip
 * v1 management/surveys                   yes    YES     no
 * v1 management/responses                 yes     no    YES
 * v2 management/responses                 yes     no    YES
 * v2 management/webhooks                  yes     no    YES
 * v2 organizations/{id}/teams             yes     no    YES
 * v2 organizations/{id}/workspace-teams   yes     no    YES
 * v2 management/contact-attribute-keys    yes     no    YES
 * v1 management/contacts                   NO     no     no
 * v1 management/action-classes             NO     no     no
 * v1 management/contact-attributes         NO     no     no
 * v1 management/contact-attribute-keys     NO     no     no
 * v2 roles                                 NO     no     no
 * ```
 *
 * So `v1 management/surveys` is the **only** route in the whole API that takes `offset`, and an
 * earlier version of this plugin sent `offset` everywhere on the strength of having tested exactly
 * that one route. Six list operations were paging incorrectly and returning a 200 while doing it.
 *
 * Two traps worth naming, because both actively point the wrong way:
 *
 * 1. **`meta` lies.** v2 lists return `meta: {total, limit, offset}` - reporting an `offset` field
 *    on routes that ignore the `offset` parameter and honour `skip`. Reading the envelope is how
 *    the wrong conclusion survives.
 * 2. **Four v1 routes ignore `limit` too.** Not just the cursor - the page size. They return every
 *    row no matter what is asked, so those operations do not accept paging parameters at all
 *    rather than advertising ones the API discards.
 *
 * The caller-facing name stays `offset` on every operation that can page, because a plugin's job
 * is to present one contract rather than to leak which upstream route happens to spell it which
 * way. The translation to `skip` happens here, once.
 */
export type PageStyle = 'offset' | 'skip';

/**
 * Builds paging query parameters for a route, translating the caller's `offset` to whichever wire
 * parameter that route actually honours. See {@link PageStyle} for the per-route table.
 *
 * Callers pass `style` explicitly rather than defaulting it: a default is what let one route's
 * behaviour stand in for eleven others.
 */
export function listParams(
	style: PageStyle,
	input: {
		limit?: number | undefined;
		offset?: number | undefined;
	},
): Record<string, string | number | boolean | undefined> {
	return compactQuery(
		style === 'offset'
			? { limit: input.limit, offset: input.offset }
			: { limit: input.limit, skip: input.offset },
	);
}

/**
 * Appends a query string, encoding each value.
 *
 * Formbricks takes ordinary scalar query parameters - there is no Rails-style array or nested
 * filter syntax here, unlike the previous integration - so the transport's own serialiser would
 * have been adequate. This exists anyway so that the emitted string is assertable in a test and
 * so that a non-scalar cannot be stringified into something plausible but wrong.
 */
export function withQuery(
	path: string,
	params: Record<string, string | number | boolean | undefined> = {},
): string {
	const parts: string[] = [];
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined) continue;
		if (typeof value === 'object') {
			throw new TypeError(
				`Formbricks query parameter '${key}' must be a scalar; received ${
					value === null
						? 'null'
						: Array.isArray(value)
							? 'an array'
							: 'an object'
				}. A query string cannot express that shape, and String() would have sent its ` +
					`text form instead.`,
			);
		}
		if (typeof value === 'number' && !Number.isFinite(value)) {
			// NaN and Infinity are numbers, and String() renders them as the text "NaN" and
			// "Infinity" - values the API would match literally.
			throw new TypeError(
				`Formbricks query parameter '${key}' must be a finite number; received ${
					Number.isNaN(value) ? 'NaN' : 'a non-finite number'
				}.`,
			);
		}
		parts.push(
			`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
		);
	}
	return parts.length > 0 ? `${path}?${parts.join('&')}` : path;
}

/**
 * The `workspaceId` a write has to carry.
 *
 * Formbricks requires it **in the body** of most writes, not merely in the API key's scope, and
 * the requirement is **per endpoint rather than universal**. That distinction was learned the
 * hard way: four creates rejected a body without it, which looked like a blanket rule, and then
 * `PUT v1/management/responses/{id}` accepted one without it.
 *
 * Required, observed: `POST` surveys, responses, action-classes, webhooks, contacts,
 * contact-attribute-keys; and `PUT` action-classes.
 * Not required, observed: `PUT` responses.
 *
 * So each operation states its own answer rather than inheriting one, and this helper only
 * exists to keep the shape consistent where it *is* needed.
 */
export function withWorkspace(
	workspaceId: string,
	body: Record<string, unknown>,
): Record<string, unknown> {
	return compactBody({ workspaceId, ...body });
}
