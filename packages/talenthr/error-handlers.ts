import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { TalentHRAPIError } from './client';

/** HTTP failures arrive as core's `ApiError`; network failures as `TalentHRAPIError`. */
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof TalentHRAPIError) {
		return error.status;
	}
	return undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request?.method;
	if (error instanceof TalentHRAPIError) return error.method;
	return undefined;
}

// Status codes: https://apidocs.talenthr.io, Introduction, Errors.
export const errorHandlers = {
	// TalentHR caps a key at 2000 requests per minute and documents no
	// Retry-After header. Core's request() already retries a 429 three times
	// with backoff (honouring Retry-After when sent), so the handler does not
	// retry again (R8).
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError || error instanceof TalentHRAPIError
					? error.retryAfter
					: undefined,
		}),
	},
	// A 401 means the key was refused. TalentHR sends a missing tenant under
	// the same status, so `isTenantNotFound` records that reading; both are
	// permanent and neither is retried.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key's role may not perform this action.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input, 404 unknown employee or record, 422 rejected fields.
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
	// 409: a uniqueness clash on a name, or a delete blocked because a record
	// is still in use. The request has to change before a retry can work.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A failed write may already have been applied,
	// and a repeated hire or time off request creates a second record.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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
