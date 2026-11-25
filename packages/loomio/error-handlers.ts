import type { CorsairErrorHandler } from 'corsair/core';
import { LoomioAPIError } from './client';

// Status and body taxonomy from the API docs and source (Api::V1::SnorlaxBase):
// 403 `{"error":"message"}` for a bad key or a permission denial, 404
// `{"error":404}`, 400 `{"error":400}`, 422 `{"errors":{field:["message"]}}`,
// 429 with no headers (Rack::Attack, 900 requests per 5 minutes per IP).
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof LoomioAPIError && error.status === 429,
		// No Retry-After exists, so the header value stays undefined and the
		// default exponential backoff paces the retries.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof LoomioAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		// 403 with no record in the path reads as a bad or missing key; Loomio
		// never sends 401 for key problems.
		match: (error: Error) =>
			error instanceof LoomioAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		// A 403 on a resource-scoped call can be a valid key without permission
		// on that record (or a plan limit). Nothing a retry fixes.
		match: (error: Error) =>
			error instanceof LoomioAPIError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		// A missing record answers {"error":404}; an unrouted path answers
		// {"status":404,"error":"Not Found"}. Both are this status.
		match: (error: Error) =>
			error instanceof LoomioAPIError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(error instanceof LoomioAPIError &&
				(error.status === 400 || error.status === 422)),
		handler: async () => ({ maxRetries: 0 }),
	},
	TRANSPORT_ERROR: {
		// A dropped connection never reached Loomio, so a read replays safely;
		// the replaySafe flag already excludes writes.
		match: (error: Error) =>
			error instanceof LoomioAPIError &&
			error.status === undefined &&
			error.replaySafe,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	SERVER_ERROR: {
		// A 5xx may have executed, and Loomio POSTs are not idempotent, so only
		// reads replay. Failed writes fall through to DEFAULT.
		match: (error: Error) =>
			error instanceof LoomioAPIError &&
			(error.status ?? 0) >= 500 &&
			error.replaySafe,
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
