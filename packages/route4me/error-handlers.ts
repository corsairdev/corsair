import type { CorsairErrorHandler } from 'corsair/core';
import { Route4MeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof Route4MeAPIError ? error.status : undefined;
}

/**
 * Route4Me's error taxonomy. Both API generations answer with a real HTTP
 * status, and v5 repeats it in the body's `code`:
 *
 * - `401` is a rejected key on both. v4 sends `Invalid API key`; v5 sends
 *   `Unauthenticated`.
 * - `406` is the v5 validation status: a filter, field name or body value the
 *   route rejects. A retry sends the same request.
 * - `403` is a key that is valid but not allowed this call.
 * - `429` is the plan's throughput limit; Route4Me documents no window or
 *   `Retry-After`, so the handler falls back to exponential backoff.
 * - `5xx` is only replayed for reads. Creating an optimization queues a job and
 *   creating an order or address writes a record.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof Route4MeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			// 406 is v5's validation status, not a content-negotiation failure:
			// the plugin always asks for JSON, so a 406 here is a bad field.
			return error.name === 'ZodError' || status === 400 || status === 406;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only a call the endpoint declared replayable is retried. The HTTP method
	// is not enough on this API: v5's `routes.list` and `orders.list` are POSTs
	// that only read, while `orders.create` POSTs a record.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof Route4MeAPIError &&
			error.replayable &&
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

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
 */
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
