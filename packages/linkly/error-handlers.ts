import type { CorsairErrorHandler } from 'corsair/core';
import { LinklyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof LinklyAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof LinklyAPIError ? error.code : undefined;
}

// Error envelope codes: bad_request (400), unauthorized (401), forbidden
// (403), not_found (404), rate_limit_exceeded (429), internal_error (500).
// The gateway can also answer a bare 429 with no Linkly body, and 400
// validation failures arrive as a field-keyed object with no code, so every
// handler matches the status and the body code.
export const errorHandlers = {
	// Documented limits: 20 req/s on the link API, 50 req/hour per workspace
	// on analytics, 5 req/s on QR codes. Linkly sends no rate-limit headers
	// (verified by probe), so there is no Retry-After to honour; a sub-second
	// burst 429 recovers with backoff, an exhausted hourly analytics quota
	// does not, and the call then fails after the three attempts.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof LinklyAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof LinklyAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
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
	// 404 not_found: a missing link, workspace or webhook URL. A key that
	// cannot see a workspace also answers 404, indistinguishable from missing.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 404 || codeOf(error) === 'not_found',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 bad_request, including the field-keyed validation bodies that carry
	// no code. Retrying sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				codeOf(error) === 'bad_request'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx, and dropped connections or timeouts that never reached Linkly.
	// Only replay-safe requests retry: reads, the /link upsert, link delete
	// (a repeat is a 200 no-op) and restore. A webhook subscribe is not known
	// to be idempotent, so it stops here.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof LinklyAPIError &&
			error.replaySafe &&
			(error.status === undefined ||
				(error.status >= 500 && error.status < 600)),
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
