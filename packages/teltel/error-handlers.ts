import type { CorsairErrorHandler } from 'corsair/core';
import { TeltelAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TeltelAPIError ? error.status : undefined;
}

/**
 * TelTEL separates two failures that usually share a status: 401 means no
 * credential was sent, and 403 means one was sent and refused. Both are
 * permanent, but the distinction is what tells a caller whether to configure a
 * key or check its role.
 */
export const errorHandlers = {
	// No key reached the API: configure one.
	MISSING_AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TeltelAPIError && error.isMissingKey,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A key was sent and refused, or its role is too small for this route.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TeltelAPIError && error.isRefusedKey,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TeltelAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
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
	// 409: the campaign or contact is already in the requested state.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A repeated send charges a second message, and a
	// repeated campaign action restarts a campaign that was already running.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TeltelAPIError &&
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
