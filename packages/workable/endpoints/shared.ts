import { AuthMissingError } from 'corsair/core';
import type { z } from 'zod';

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

/** Strips `undefined`-valued keys from a JSON body before it is serialised. */
export function compactBody(
	// unknown: generic JSON body values — stripped of `undefined`, never inspected.
	body: Record<string, unknown>,
	// unknown: same generic JSON body values as the input — never inspected.
): Record<string, unknown> {
	// unknown: generic JSON body values — stripped of `undefined`, never inspected.
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

/**
 * Validates an endpoint's input against its zod schema at runtime. The Corsair
 * binder passes caller args straight through, so each endpoint enforces its
 * own contract rather than relying on registration metadata.
 */
export function parseEndpointInput<SchemaT extends z.ZodType>(
	schema: SchemaT,
	input: unknown,
): SchemaT['_output'] {
	return schema.parse(input);
}

/**
 * Validates a provider response against the endpoint's zod output schema at
 * runtime, so callers never receive data that violates the declared types
 * (e.g. date strings where the schema promises `Date` objects).
 */
export function parseEndpointOutput<SchemaT extends z.ZodType>(
	schema: SchemaT,
	output: unknown,
): SchemaT['_output'] {
	return schema.parse(output);
}
