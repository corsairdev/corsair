import type { CorsairErrorHandler } from 'corsair/core';
import { WaiverFileAPIError, WaiverFileConfigurationError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WaiverFileAPIError ? error.status : undefined;
}

/**
 * WaiverFile has no error codes: a failure is `{ Message }` and the status is
 * the only structure. The awkward part is that a bad key or site is a **400**,
 * not a 401, so `isAuthError` reads the message to tell a credential failure
 * from a genuine validation one.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WaiverFileAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WaiverFileAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A missing or wrong key, a wrong site for that key, or an inactive one —
	// reported as a 400 whose message starts `Invalid`.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof WaiverFileAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Raised before a request when the key slot is not `<apiKey>\n<siteID>`.
	CONFIGURATION_ERROR: {
		match: (error: Error) => error instanceof WaiverFileConfigurationError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is a route that does not exist rather than a missing object, since
	// this API addresses everything by query parameter.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 that is not a credential failure, and a ZodError from the schema.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. Note that DeleteEvent and DeleteEventCategory are
	// GETs with effects, so they are matched here too — which is why the method
	// alone is not enough on this API and the deletes are excluded by name.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WaiverFileAPIError &&
			error.method === 'GET' &&
			(statusOf(error) ?? 0) >= 500,
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
