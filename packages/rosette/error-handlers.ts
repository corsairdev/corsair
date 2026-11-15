import type { CorsairErrorHandler } from 'corsair/core';
import { RosetteAPIError } from './client';

function apiError(error: Error): RosetteAPIError | undefined {
	return error instanceof RosetteAPIError ? error : undefined;
}

/**
 * Rosette reports a bad key, an unauthorized endpoint and an exhausted quota with
 * the **same** `403 forbidden` body, so the handler has to be conservative: it never
 * retries a 403, because two of the three causes cannot be fixed by one and the
 * third only after a reset.
 */
export const errorHandlers = {
	// 403, or a 401: the key is wrong, the endpoint is not included, or the quota is
	// spent. Retrying cannot fix any of the three.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 or 422 with a badRequest or invalidParameter code.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, if it arrives; no numeric limit is documented.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => apiError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: apiError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 5xx. Every analysis is a pure function of its input, so a retry returns the
	// same answer and costs one more call.
	SERVER_ERROR: {
		match: (error: Error) => (apiError(error)?.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const replayable = apiError(error)?.replayable === true;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/** Handlers match in key order and DEFAULT matches everything, so it stays last. */
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
