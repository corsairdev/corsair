import type { CorsairErrorHandler } from 'corsair/core';
import { RagicAPIError } from './client';

function apiError(error: Error): RagicAPIError | undefined {
	return error instanceof RagicAPIError ? error : undefined;
}

/**
 * Ragic reports almost every failure inside a 200, and the client turns those into
 * a RagicAPIError before the output schema sees them, so these handlers work from
 * the body's own code rather than from the HTTP status.
 *
 * Codes: https://www.ragic.com/intl/en/doc-http-api (Error Responses).
 */
export const errorHandlers = {
	// 105 auth required, 106 no access right. A missing key and a wrong key both
	// answer 106 as the guest account, and a non-manager key answers it on the
	// schema route, so this covers both an unusable key and a real permission gap.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 109 cannot create more records, 303 the account has expired. Retrying cannot
	// change either.
	QUOTA_ERROR: {
		match: (error: Error) => apiError(error)?.isQuotaError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 101 bad account, 102 bad path, 103 bad sheet index, 108 could not load the
	// form. The caller has to address a different sheet.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.isNotFound === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 104 a POST to a custom form, 201 bad parameters, 202 could not execute.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx Ragic code, and only for an operation that declared itself replayable.
	// Creating, commenting and deleting are never replayed.
	SERVER_ERROR: {
		match: (error: Error) => apiError(error)?.isServerError === true,
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
