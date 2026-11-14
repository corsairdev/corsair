import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KitAPIError } from './client';

// An HTTP error from Kit is core's ApiError; KitAPIError is a request that got
// no answer.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request.method;
	return error instanceof KitAPIError ? error.method : undefined;
}

// Kit documents 401, 403, 404, 413, 422 and 429 on the v4 routes, plus the
// gateway statuses. Reference: https://developers.kit.com/api-reference/response-codes
export const errorHandlers = {
	// A 429 is one of Kit's two request limits. It sends Retry-After, so the
	// handler waits that when it arrives and backs off otherwise.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// `{"errors":["The API key is invalid"]}`. A key is revoked rather than
	// expired, so a retry cannot fix it.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a key whose account or plan cannot make this call.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A payload Kit refuses for its size. A retry sends the same payload, so
	// this is not retried.
	PAYLOAD_TOO_LARGE_ERROR: {
		match: (error: Error) => statusOf(error) === 413,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is an unknown subscriber, tag or form, and 422 a field Kit refused.
	// A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 404 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read is safe to replay. A write is not: a 5xx after a subscriber create
	// can arrive once the subscriber exists, and Kit answers 200 with the
	// existing one on a repeat, but a tag or form subscribe could double-apply.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached Kit. TIMEOUT sits first
	// because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KitAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries: methodOf(error) === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof KitAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries: methodOf(error) === 'GET' ? 2 : 0,
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
