import type { CorsairErrorHandler } from 'corsair/core';
import { ESignaturesAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ESignaturesAPIError ? error.status : undefined;
}

// eSignatures documents no error body format, so classification runs on the
// status code alone.
export const errorHandlers = {
	// Limits are adaptive, and eSignatures warns that frequent polling can
	// lead to blocked requests, so a 429 is the one signal to back off from.
	// A request a limit stopped never ran, so the retry is safe for writes too.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ESignaturesAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ESignaturesAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the secret token is wrong or revoked.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 unknown contract, signer or template. A retry
	// sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: a failed write may have gone through, and
	// withdraw or a signer delete is not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ESignaturesAPIError &&
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
