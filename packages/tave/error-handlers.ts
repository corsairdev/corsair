import type { CorsairErrorHandler } from 'corsair/core';
import { TaveAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TaveAPIError ? error.status : undefined;
}

// Error bodies are `{ error: true, status, message }`, and an unknown route
// answers 200 with the docs HTML, which the client turns into an HTML error.
export const errorHandlers = {
	// A path that answered HTML is not an API route, so a retry sends the same
	// wrong path. This sits before every retrying handler for that reason.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof TaveAPIError && error.isHtmlResponse,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TaveAPIError ? error.retryAfter : undefined,
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
	// 400 invalid input, 404 unknown record, 422 rejected fields.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409: the record changed under the caller, or a delete is blocked.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A repeated payment records a second one, and a
	// repeated create makes a second job or note.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TaveAPIError &&
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

// Core runs the first handler whose `match` passes and DEFAULT matches
// everything, so caller keys go first, then any builtin the caller did not
// name, and DEFAULT last.
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
