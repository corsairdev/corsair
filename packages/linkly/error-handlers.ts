import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { linklyErrorCode, linklyRequestFacts } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof ApiError ? linklyErrorCode(error.body) : undefined;
}

// Error envelope codes: bad_request (400), unauthorized (401), forbidden
// (403), not_found (404), rate_limit_exceeded (429), internal_error (500).
// 400 validation failures arrive as a field-keyed object with no code, so
// each handler matches the status first and the body code second.
export const errorHandlers = {
	// Core's request() already retried the 429 three times (R8), so the
	// handler does not add more.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401 unauthorized: a wrong or revoked key.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || codeOf(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 forbidden: the plan or the key lacks the feature or workspace.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 || codeOf(error) === 'forbidden',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 not_found: a missing link, domain, workspace or webhook URL. A key
	// that cannot see a workspace also answers 404, indistinguishable from
	// missing.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 404 || codeOf(error) === 'not_found',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 bad_request and 422, including the field-keyed validation bodies that
	// carry no code. Retrying sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 422 ||
				codeOf(error) === 'bad_request'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx, and dropped connections or timeouts that never got an answer. Only
	// replay-safe requests retry: reads, the /link update, link deletes (a
	// repeat is a 200 no-op), restore, and conversions with an event_id. A
	// create may already have landed, so it stops here.
	SERVER_ERROR: {
		match: (error: Error) => {
			if (!linklyRequestFacts(error)?.replaySafe) return false;
			const status = statusOf(error);
			return status === undefined || (status >= 500 && status < 600);
		},
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
// last even when the caller adds or overrides handlers. Caller keys come
// first so a caller handler for a status no builtin covers can never be
// claimed by an earlier builtin key.
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
