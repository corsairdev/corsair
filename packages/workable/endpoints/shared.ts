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
 * Only authenticated endpoints call this (the public job-board endpoints
 * resolve their subdomain directly), so it also enforces key presence: a
 * tenant with no stored key gets AuthMissingError here - before any request
 * is issued - instead of a downstream configuration error. The keyBuilder
 * deliberately resolves empty so keyless public calls keep working, which is
 * why this check lives here rather than there.
 *
 * Raises rather than returning an empty string so a missing subdomain
 * surfaces as the configuration gap it is, instead of a confusing transport
 * error against `https://.workable.com`.
 */
export async function resolveAccount(ctx: {
	key?: string;
	options?: { account?: string };
	keys?: { get_account?: () => Promise<string | null | undefined> };
}): Promise<string> {
	if (!ctx.key) {
		throw new AuthMissingError(
			'workable',
			'api_key',
			'[auth-missing:workable:api_key]: a Workable access token is required - generate one under Settings > Integrations > Apps',
		);
	}

	const account =
		ctx.options?.account ?? (await resolveStoredAccount(ctx)) ?? '';

	if (!account) {
		throw new AuthMissingError(
			'workable',
			'account',
			'[auth-missing:workable:account]: a Workable account subdomain is required - it is the subdomain of your account URL, https://<subdomain>.workable.com',
		);
	}

	return account;
}

/**
 * Reads the stored account subdomain best-effort. A tenant with no account
 * row has no DEK, so the key manager throws instead of returning null -
 * that case resolves to null so callers surface their clean
 * missing-configuration error. Anything else (e.g. transient transport
 * failures, which stay retryable) rethrows.
 */
async function resolveStoredAccount(ctx: {
	keys?: { get_account?: () => Promise<string | null | undefined> };
}): Promise<string | null | undefined> {
	try {
		return await ctx.keys?.get_account?.();
	} catch (error) {
		// why safe: narrows to the uninitialized-tenant case, which carries
		// no stored subdomain — anything else rethrows untouched.
		if (error instanceof Error && /no dek found/i.test(error.message)) {
			return null;
		}
		throw error;
	}
}

/**
 * Resolves the subdomain for the unauthenticated job-board endpoints. An
 * explicit subdomain always wins and never touches the key manager, so
 * tenants with no account row can still look up any public careers page.
 * The stored account is only a best-effort fallback; without any source the
 * caller gets a clean missing-subdomain error rather than a manager failure.
 */
export async function resolvePublicSubdomain(
	ctx: {
		options?: { account?: string };
		keys?: { get_account?: () => Promise<string | null | undefined> };
	},
	input: { subdomain?: string },
	endpoint: string,
): Promise<string> {
	if (input.subdomain) return input.subdomain;
	if (ctx.options?.account) return ctx.options.account;
	const stored = await resolveStoredAccount(ctx);
	if (stored) return stored;
	throw new Error(
		`workable.${endpoint} requires a subdomain, either explicitly or via a connected Workable account`,
	);
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
