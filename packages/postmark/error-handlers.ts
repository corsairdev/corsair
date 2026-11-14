import type { CorsairErrorHandler } from 'corsair/core';
import { PostmarkAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PostmarkAPIError ? error.status : undefined;
}

function codeOf(error: Error): number | undefined {
	return error instanceof PostmarkAPIError ? error.errorCode : undefined;
}

// Postmark publishes a stable numeric ErrorCode per failure, and some codes
// share a status with unrelated ones, so handlers match the code where it
// narrows the case and the status elsewhere.
export const errorHandlers = {
	// `Authentication` (10): a wrong or missing token, or the wrong token type for
	// the route.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof PostmarkAPIError && error.credentialsRejected,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 401: Postmark refused the token, which no retry changes.
	UNAUTHORIZED_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// `Maintenance` (100) is a planned outage the API says will end; it is the one
	// 503 worth waiting through. It sits before SERVER_ERROR so it wins first.
	MAINTENANCE_ERROR: {
		match: (error: Error) => codeOf(error) === 100,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'linear_3s' as const,
		}),
	},
	// Postmark publishes X-RateLimit-* headers rather than a Retry-After, so the
	// strategy is the only delay available.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	// A request Postmark refused as written: a validation error (300), invalid
	// JSON (402), an invalid field (403), a bad template (601/1100-1131), an
	// entitlement problem, or a 413 body over the size limit. None is retried.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 413 ||
				status === 415 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached Postmark, so a read is safe to replay.
	// A send is not: Postmark may already have accepted and queued the messages.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof PostmarkAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof PostmarkAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Only reads are replayed: a failed send may still have been queued.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof PostmarkAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and `DEFAULT` matches everything, so `DEFAULT`
 * stays last. A plain spread would keep a caller's value but a builtin's
 * position, which lets the trailing `DEFAULT` claim errors the caller named.
 */
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
