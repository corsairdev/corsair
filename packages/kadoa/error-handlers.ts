import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KadoaAPIError } from './client';

// Kadoa's HTTP errors arrive as core's ApiError; KadoaAPIError is only a
// request that got no answer, so it carries no status.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export const errorHandlers = {
	// Kadoa answers a 429 with `reason: PIPELINE_CROWDED` when too many runs are
	// queued, or `USER_RATE_LIMIT` when the caller is going too fast. Both clear
	// on their own and no write here is repeated by asking again: `run` was not
	// accepted at all, so a retry starts the run rather than starting it twice.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a missing or wrong x-api-key. No retry can fix it.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but the team cannot reach this workflow, usually
	// because it belongs to another team or the caller's role is too low.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409, the state is wrong for the request: a run of a workflow that is not
	// finalised or whose preview awaits confirmation, a duplicate variable key,
	// a secret still bound to a connection, or data that was never published.
	// Sending the same request again cannot change that.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is an unknown workflow, schema, variable or change in this team, and
	// 422 is a source list spanning several sites. 400 covers invalid input and
	// the "cannot resume in this state" answer. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 413 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read is safe to replay: Kadoa answers the same request with the same
	// data. A write is not, because a 502 or 504 can come back after Kadoa
	// applied it, and `workflows.create` or `schemas.create` would then leave
	// two copies behind.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached Kadoa, so the read can be
	// replayed. The client marks these explicitly: `transport` covers a reset,
	// DNS failure or abort, `timedOut` covers the request timeout, and TIMEOUT
	// sits first because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KadoaAPIError && error.timedOut,
		handler: async (error: Error) => ({
			// A timed-out read of workflow data can still finish at Kadoa, so it
			// is only replayed when the request was a GET.
			maxRetries:
				error instanceof KadoaAPIError && error.method === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof KadoaAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KadoaAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim a status no builtin covers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
