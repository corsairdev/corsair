import type { CorsairErrorHandler } from 'corsair/core';
import { DubAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof DubAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof DubAPIError ? error.code : undefined;
}

// Statuses and codes: https://dub.co/docs/api-reference/errors
export const errorHandlers = {
	// Standard endpoints allow 60-3000 requests/minute per key by plan;
	// analytics endpoints have separate per-second caps. Dub answers 429 with
	// code rate_limit_exceeded, and a gateway 429 carries no body, so both
	// forms match here. A missing Retry-After falls back to the 1s/2s/4s backoff.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof DubAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof DubAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 unauthorized: missing or invalid key.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || codeOf(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 forbidden: the key lacks the permission this call needs.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 || codeOf(error) === 'forbidden',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 conflict: e.g. a link whose domain+key already exists.
	CONFLICT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 409 || codeOf(error) === 'conflict',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 bad_request, 404 not_found, 410 invite_expired and 422
	// unprocessable_entity all answer a retry with the same body. Invite
	// expiry belongs here rather than AUTH_ERROR: the account is fine.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = codeOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 410 ||
				status === 422 ||
				code === 'bad_request' ||
				code === 'not_found' ||
				code === 'invite_expired' ||
				code === 'unprocessable_entity'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Dub documents no idempotency keys, so a 5xx write must not be replayed:
	// it may have gone through. Reads are safe, and links.upsert is the one
	// idempotent write (create-or-update by domain+key), so both replay here.
	// A transport failure never reached Dub, but the same flag gates it.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof DubAPIError &&
			error.idempotent &&
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
// last even when the caller adds or overrides handlers. Caller keys win over
// builtins on name collisions; builtins the caller did not name stay put.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...builtinRest };
	for (const [name, entry] of Object.entries(userRest)) {
		merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
