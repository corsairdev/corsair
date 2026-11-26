import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Status and body taxonomy from the API docs and source (Api::V1::SnorlaxBase):
// 403 `{"error":"message"}` for a bad key or a permission denial, 404
// `{"error":404}`, 400 `{"error":400}`, 422 `{"errors":{field:["message"]}}`,
// 429 with no headers (Rack::Attack, 900 requests per 5 minutes per IP).
// Errors are core's ApiError (rebuilt in client.ts without request data).

function hasStatus(error: Error, test: (status: number) => boolean): boolean {
	return error instanceof ApiError && test(error.status);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// Core's request() already retried the 429 three times.
		match: (error: Error) => hasStatus(error, (s) => s === 429),
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		// Loomio answers a bad or missing key with 403 (never 401), and a
		// permission denial with the same body. Nothing a retry fixes.
		match: (error: Error) => hasStatus(error, (s) => s === 401 || s === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		// A missing record answers {"error":404}; an unrouted path answers
		// {"status":404,"error":"Not Found"}.
		match: (error: Error) => hasStatus(error, (s) => s === 404),
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			hasStatus(error, (s) => s === 400 || s === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		// A 5xx may have executed, and Loomio writes are not idempotent, so only
		// GETs replay. Failed writes fall through to DEFAULT.
		match: (error: Error) =>
			error instanceof ApiError &&
			error.status >= 500 &&
			error.request.method === 'GET',
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

// Handlers match in key order and DEFAULT matches everything, so caller keys
// resolve first, unnamed builtins keep their slots, and DEFAULT stays last.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
