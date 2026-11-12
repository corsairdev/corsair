import type { CorsairErrorHandler } from 'corsair/core';
import { WebscraperioAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WebscraperioAPIError ? error.status : undefined;
}

/**
 * The Cloud API has no error codes. A handled failure is
 * `{ success: false, error }` and a bad token is a **401** carrying
 * `"Unauthorized, invalid Bearer token."`; an unrouted path is Laravel's own
 * 404 `{ message: "The route ... could not be found." }`.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WebscraperioAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WebscraperioAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401, or the invalid-token message: the key is wrong or missing. A 403 is
	// deliberately not matched here, because a working token without the plan
	// is a permission problem rather than a credential one.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof WebscraperioAPIError && error.isInvalidToken,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but the plan does not include the call.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 404 whose body says the route could not be found is a mistyped path,
	// not a missing sitemap, and gets its own handler so it is not mistaken
	// for one.
	ROUTE_NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof WebscraperioAPIError && error.isRouteNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof WebscraperioAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, 405 and 422, plus a ZodError from the input schema.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 405 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: creating a sitemap is not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WebscraperioAPIError &&
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
