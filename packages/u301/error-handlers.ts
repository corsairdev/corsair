import type { CorsairErrorHandler } from 'corsair/core';
import { U301APIError } from './client';

function apiError(error: Error): U301APIError | undefined {
	return error instanceof U301APIError ? error : undefined;
}

/**
 * Codes: the Error handling page at https://u301.com/docs/error-handling, plus the
 * live 401 whose body is `{"message":"Unauthorized"}`.
 */
export const errorHandlers = {
	// 401 UNAUTHORIZED and 403 FORBIDDEN: the key or the workspace is wrong. Every
	// call on that key fails the same way, so retrying is pointless.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 NOT_FOUND: no such short link or domain.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.isNotFound === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 BAD_REQUEST and 422 VALIDATION_FAILED, plus a ZodError thrown before the
	// request is built.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || apiError(error)?.isValidationError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 here is the monthly link allowance, not a request rate, and U301 documents
	// that an oversized bulk create answers it without creating anything. Waiting
	// does not add allowance, so it is never retried.
	QUOTA_ERROR: {
		match: (error: Error) => apiError(error)?.isQuotaError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx, and only for an operation that declared itself replayable. A create or a
	// delete is never resent.
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
