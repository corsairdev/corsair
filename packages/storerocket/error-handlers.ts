import type { CorsairErrorHandler } from 'corsair/core';
import { StorerocketAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof StorerocketAPIError ? error.status : undefined;
}

// Status taxonomy from https://docs.storerocket.io/api/errors: 400 (query
// nesting), 401, 403, 404, 422 (validation), 429 (1,000/min with
// Retry-After), 500.
export const errorHandlers = {
	// The documented contract: wait for the Retry-After interval, then
	// retry; space subsequent requests out.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof StorerocketAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: missing, expired, revoked or invalid token.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: missing permission or no API access; 400: query nesting too deep;
	// 422: validation failed and nothing was saved; 404: unknown or
	// inaccessible project/location. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 403 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500: "Check the result before retrying a write." Only reads are
	// replayed: location creates have no idempotency contract, and the docs
	// warn a retry can create a second location.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof StorerocketAPIError &&
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

// Handlers match in key order and DEFAULT matches everything. Caller keys
// come first so a caller handler for a status no builtin covers can run at
// all, builtins the caller did not name follow, and DEFAULT stays last even
// when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
