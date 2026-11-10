import type { CorsairErrorHandler } from 'corsair/core';
import { RenderformAPIError } from './client';

function apiError(error: Error): RenderformAPIError | undefined {
	return error instanceof RenderformAPIError ? error : undefined;
}

/**
 * Status codes: the `ApiError` model in the OpenAPI document and the live
 * responses, which also showed that a bad key is a `400`.
 */
export const errorHandlers = {
	// Checked before VALIDATION_ERROR because a bad key is a 400, and a validation
	// handler would otherwise swallow it into a "fix your body" message.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the credit balance is gone. Retrying cannot refill it.
	QUOTA_ERROR: {
		match: (error: Error) => apiError(error)?.isQuotaError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such template or render result.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.isNotFound === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 (that is not a key failure) and 422: a body Renderform refused.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, if it ever arrives; no numeric rate limit is documented.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => apiError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: apiError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 5xx and 503, only for an operation that declared itself replayable. A render,
	// a screenshot or a PDF capture is never replayed, since each spends a credit
	// and produces a new file.
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
