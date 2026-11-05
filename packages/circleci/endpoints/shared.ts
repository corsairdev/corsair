import type { CircleCIRequestOptions } from '../client';
import {
	CircleCIGraphQLError,
	makeCircleCIGraphQLRequest,
	makeCircleCIRequest,
	makeCircleCIV1Request,
	makeCircleCIV3ListRequest,
	makeCircleCIV3Request,
} from '../client';

/**
 * Minimal structural view of the plugin context these helpers need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else
 * the concrete context exposes.
 */
type CircleCICallContext = { key: string };

/** Issues a request against the documented REST v2 API. */
export async function circleCICall<T>(
	ctx: CircleCICallContext,
	endpoint: string,
	options: CircleCIRequestOptions = {},
): Promise<T> {
	return await makeCircleCIRequest<T>(endpoint, ctx.key, options);
}

/**
 * Issues a request against the undocumented REST v3 API, already unwrapped
 * from its `{"data": ...}` JSON:API envelope.
 */
export async function circleCIV3Call<T>(
	ctx: CircleCICallContext,
	endpoint: string,
	options: CircleCIRequestOptions = {},
): Promise<T> {
	return await makeCircleCIV3Request<T>(endpoint, ctx.key, options);
}

/**
 * Issues a request against a REST v3 **list** route, preserving the `page`
 * cursor `circleCIV3Call` above discards - see `makeCircleCIV3ListRequest`.
 */
export async function circleCIV3ListCall<T>(
	ctx: CircleCICallContext,
	endpoint: string,
	options: CircleCIRequestOptions = {},
): Promise<{
	items: T[];
	page?: { next?: string | null; prev?: string | null };
}> {
	return await makeCircleCIV3ListRequest<T>(endpoint, ctx.key, options);
}

/** Issues a request against the legacy v1.1 API. */
export async function circleCIV1Call<T>(
	ctx: CircleCICallContext,
	endpoint: string,
	options: CircleCIRequestOptions = {},
): Promise<T> {
	return await makeCircleCIV1Request<T>(endpoint, ctx.key, options);
}

/** Issues a query or mutation against `graphql-unstable`. */
export async function circleCIGraphQLCall<T>(
	ctx: CircleCICallContext,
	query: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	return await makeCircleCIGraphQLRequest<T>(query, variables, ctx.key);
}

/**
 * Runs a GraphQL call and reports whether the server said the thing being
 * looked up does not exist, as opposed to a genuine failure.
 *
 * CircleCI's `orb`/`orbVersion`/`namespace`-shaped queries answer a
 * not-found subject with `data: { <field>: null }` and no `errors` entry -
 * confirmed live by querying a deliberately invalid orb name. A thrown
 * `CircleCIGraphQLError` is a different situation (a real failure - bad
 * arguments, permission denied) and is left to propagate rather than folded
 * into "does not exist".
 */
export async function circleCIGraphQLExists(
	ctx: CircleCICallContext,
	query: string,
	variables: Record<string, unknown> | undefined,
	field: string,
): Promise<{ exists: boolean; value: unknown }> {
	const result = await circleCIGraphQLCall<Record<string, unknown>>(
		ctx,
		query,
		variables,
	);
	const value = result[field];
	return { exists: value !== null && value !== undefined, value };
}

/**
 * Builds the v1.1 job path segment: `project/{vcs}/{org}/{project}/{build}`.
 * The only input shape that resolves a job "by its number" - see the note on
 * `JobByNumberInputSchema` in `types.ts`.
 */
export function jobByNumberPath(input: {
	vcsType: string;
	username: string;
	project: string;
	buildNumber: number;
}): string {
	return `project/${input.vcsType}/${encodeURIComponent(input.username)}/${encodeURIComponent(input.project)}/${input.buildNumber}`;
}

/** Drops keys whose value is `undefined`, for both bodies and query strings. */
export function compact<T extends Record<string, unknown | undefined>>(
	obj: T,
): T {
	const out = {} as T;
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined) (out as Record<string, unknown>)[key] = value;
	}
	return out;
}

export { CircleCIGraphQLError };
