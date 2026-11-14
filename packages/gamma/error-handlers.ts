import type { CorsairErrorHandler } from 'corsair/core';
import { gammaErrorInfo } from './client';

// Gamma documents 400, 401, 402, 403, 404, 409, 413, 429, 500, 502, 503 and 504,
// and adds a `code` on the cases a caller can act on.
// Reference: https://developers.gamma.app/reference/error-codes
export const errorHandlers = {
	// The workspace has no credits. It sits before RATE_LIMIT_ERROR and
	// PERMISSION_ERROR because a 402 is permanent, and both of those look like a
	// transient limit.
	QUOTA_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).isQuotaError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 covers the HTTP limit and the workspace's in-flight job cap, and
	// Gamma sends Retry-After for it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: gammaErrorInfo(error).retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 401 is a missing or invalid key.
	AUTH_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a plan short of Pro, a missing permission, or a web app slug sent
	// where a file ID belongs.
	PERMISSION_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 is an edit already running on that Gamma. Waiting and asking again is
	// the caller's decision, not a retry that would race the other edit.
	CONFLICT_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).isConflict,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a bad parameter, 404 an unknown ID, and 413 an upload over the limit.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const { status } = gammaErrorInfo(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 413
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 503 is Gamma saying the service is busy: the agent routes and document
	// search both answer it. A read is retried as Gamma asks. A write is not: a
	// 503 does not prove the generation never started, and a replay would spend
	// credits again (R8: 5xx retries only for reads).
	SERVICE_BUSY_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).isServiceBusy,
		handler: async (error: Error) => ({
			maxRetries: gammaErrorInfo(error).method === 'GET' ? 3 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A read is safe to replay. A write is not: a generation create spends
	// credits, and a retry would spend them again.
	SERVER_ERROR: {
		match: (error: Error) => {
			const { method, status } = gammaErrorInfo(error);
			return method === 'GET' && (status ?? 0) >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached Gamma. TIMEOUT sits first
	// because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).timedOut,
		handler: async (error: Error) => ({
			maxRetries: gammaErrorInfo(error).method === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => gammaErrorInfo(error).transport,
		handler: async (error: Error) => ({
			maxRetries: gammaErrorInfo(error).method === 'GET' ? 2 : 0,
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
