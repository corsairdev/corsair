import type { CorsairErrorHandler } from 'corsair/core';
import { gatherupErrorInfo } from './client';

// GatherUp documents 400, 401, 403, 404, 500 and 503, and puts its own
// `errorCode` in the body even on a 200.
// Reference: https://apidocs.gatherup.com/
export const errorHandlers = {
	// GatherUp answers 5 requests a second and returns **503** above it, not 429,
	// so both statuses are a rate limit. It does not document Retry-After, so the
	// handler's own backoff is the delay. A 503 from an outage looks the same as
	// one from the limit, and a write may have landed before it (a created
	// customer, a feedback request already sent), so a 503 is retried only on a
	// read. A 429 is a refusal before anything ran, so it is retried on any method.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => gatherupErrorInfo(error).isRateLimit,
		handler: async (error: Error) => {
			const { method, status, retryAfter } = gatherupErrorInfo(error);
			return {
				maxRetries: status === 429 || method === 'GET' ? 3 : 0,
				headersRetryAfterMs: retryAfter,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	// A refused token, or `errorCode: 2` for an invalid clientId on a 200. It sits
	// before VALIDATION_ERROR because both can carry a 4xx.
	AUTH_ERROR: {
		match: (error: Error) => gatherupErrorInfo(error).isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The token is valid but this client is not reachable from it.
	PERMISSION_ERROR: {
		match: (error: Error) => gatherupErrorInfo(error).status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is an unknown business, customer or feedback, and 400 a field GatherUp
	// refused. A retry sends the same body.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const { status } = gatherupErrorInfo(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other body-level error. The status said 2xx, so there is nothing to
	// retry against.
	BODY_ERROR: {
		match: (error: Error) => gatherupErrorInfo(error).bodyError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read is safe to replay. A write is not: a 5xx after a customer create can
	// arrive once the customer exists, and a retry would send a second request.
	SERVER_ERROR: {
		match: (error: Error) => {
			const { method, status } = gatherupErrorInfo(error);
			return method === 'GET' && (status ?? 0) >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached GatherUp. TIMEOUT sits first
	// because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => gatherupErrorInfo(error).timedOut,
		handler: async (error: Error) => ({
			maxRetries: gatherupErrorInfo(error).method === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => gatherupErrorInfo(error).transport,
		handler: async (error: Error) => ({
			maxRetries: gatherupErrorInfo(error).method === 'GET' ? 2 : 0,
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
