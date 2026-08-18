import type { BigmlRequestOptions } from '../client';
import { makeBigmlRequest } from '../client';
import type { BigmlContext } from '../index';

/** Resolves the `username` account-level field, the same way `calls.ts` resolves `accountSid` in Twilio. */
async function resolveUsername(ctx: BigmlContext): Promise<string> {
	return ctx.options.username ?? (await ctx.keys.get_username()) ?? '';
}

/** Issues a request against the BigML API using this call's resolved credentials. */
export async function bigmlCall<T>(
	ctx: BigmlContext,
	path: string,
	options?: BigmlRequestOptions,
): Promise<T> {
	const username = await resolveUsername(ctx);
	return makeBigmlRequest<T>(path, username, ctx.key, options);
}

/**
 * Drops `undefined` values from a request body or query object - BigML
 * (like most JSON APIs) treats an explicit `null` differently from an
 * absent key, so only `undefined` is stripped here.
 */
export function compact<T extends Record<string, unknown>>(obj: T): T {
	const result = Object.create(null) as T;
	for (const key of Object.keys(obj) as (keyof T)[]) {
		if (obj[key] !== undefined) result[key] = obj[key];
	}
	return result;
}

/**
 * Builds the query object every list endpoint in this plugin sends -
 * `limit`/`offset` plus `order_by` and an arbitrary `filter` passthrough
 * (see `endpoints/types.ts`'s `PageParams` doc comment for why `filter` is
 * unenumerated). `filter`'s keys are spread directly into the query string,
 * exactly like BigML's own SDK treats its `query_string` parameter - a
 * caller passes real BigML field names, not a nested wrapper.
 *
 * `filter` is spread *before* the reserved pagination keys, not after - a
 * `filter` object containing `limit`/`offset`/`order_by` (a plausible
 * mistake, since `filter`'s value type is the same `string | number |
 * boolean` shape those take) must never be able to silently override the
 * caller's actual pagination args. Object-literal spread order means later
 * keys win, so the explicit params come last on purpose.
 */
export function listQuery(input: {
	limit?: number;
	offset?: number;
	orderBy?: string;
	filter?: Record<string, string | number | boolean | undefined>;
}): Record<string, string | number | boolean | undefined> {
	return compact({
		...(input.filter ? compact(input.filter) : {}),
		limit: input.limit,
		offset: input.offset,
		order_by: input.orderBy,
	});
}
