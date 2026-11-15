import type { CorsairErrorHandler } from 'corsair/core';
import { RemoteRetrievalAPIError } from './client';

function apiError(error: Error): RemoteRetrievalAPIError | undefined {
	return error instanceof RemoteRetrievalAPIError ? error : undefined;
}

/**
 * The API documents no error catalogue, only the envelope
 * `{message, status: "Fail", code, custom_code}` captured live. The handlers work
 * from the status code, which the body repeats.
 */
export const errorHandlers = {
	// 401: "Invalid Key!". Live, a missing key and a wrong key both answer it, so
	// there is nothing more specific to say.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an unknown order or company.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.isNotFound === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A body the API refused, such as an order missing a required address field.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, if it ever arrives; the docs document no limit. Like a 5xx, it is retried
	// only for an operation that declared itself replayable: a create is never
	// resent, because a second send would book and bill a second shipment.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			apiError(error)?.status === 429 || apiError(error)?.code === 429,
		handler: async (error: Error) => {
			const api = apiError(error);
			return api?.replayable === true
				? {
						maxRetries: 2,
						headersRetryAfterMs: api.retryAfter,
						retryStrategy: 'exponential_backoff' as const,
					}
				: { maxRetries: 0 };
		},
	},
	// 5xx, and only for an operation that declared itself replayable. Creating an
	// order books a real shipment, so it is never resent.
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
