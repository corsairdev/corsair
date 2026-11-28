import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DubTransportError, dubErrorCode, isReplaySafe } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return dubErrorCode(error);
}

function replaySafe(error: Error): boolean {
	if (error instanceof ApiError) {
		return isReplaySafe(error.request?.method, error.request?.url);
	}
	return (
		error instanceof DubTransportError && isReplaySafe(error.method, error.path)
	);
}

// Statuses and codes: https://dub.co/docs/api-reference/errors
export const errorHandlers = {
	// Standard endpoints allow 60-3000 requests/minute per key by plan;
	// analytics endpoints have separate per-second caps. Core's request() has
	// already retried a 429 three times (honouring Retry-After) before a
	// handler sees it, so retrying again would multiply the attempts.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || codeOf(error) === 'rate_limit_exceeded',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401 unauthorized: missing or invalid key.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || codeOf(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 forbidden: the key lacks the permission, or the plan lacks the
	// feature (the Partners routes on a plan without Dub Partners).
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
	// unprocessable_entity all answer a retry with the same body.
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
	// A dropped connection never reached Dub, so a read or an upsert can be
	// replayed; any other write could land twice.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof DubTransportError && replaySafe(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Dub documents no idempotency keys, so a 5xx write may have gone
	// through: only reads and upserts are replayed.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) =>
			replaySafe(error)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers. Caller keys keep
// their positions first: core takes the first matching key, so a caller
// handler for a status no builtin covers would never run if builtin keys
// came first.
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
