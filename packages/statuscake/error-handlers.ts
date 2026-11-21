import type { CorsairErrorHandler } from 'corsair/core';
import { StatusCakeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof StatusCakeAPIError ? error.status : undefined;
}

// Status codes and retry guidance:
// https://developers.statuscake.com/guides/api/errors
export const errorHandlers = {
	// The docs say to wait x-ratelimit-reset seconds and retry a 429; the
	// client reads that header into retryAfter. Free plans are limited to 60
	// requests per minute and every plan has a 5 rps burst limit.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof StatusCakeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a missing, wrong or deleted token. A bare 403 with no body is the
	// gateway denying the token before the API app runs (probed live with a
	// bogus bearer, which answered 403, empty body, x-ext-authz: denied).
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			(error instanceof StatusCakeAPIError && error.isAuthDenied),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: the resource does not exist or was deleted.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Other 4xx: "The request itself needs to change", so a retry sends the
	// same failure. Zod rejections never reach the API at all.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(status !== undefined && status >= 400 && status < 500)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// The docs say a 5xx "went wrong at StatusCake" and to retry after a
	// short wait, but warn that retrying a create can make a second
	// resource. Only reads are replayed; creates, updates and deletes are
	// not.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof StatusCakeAPIError &&
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
