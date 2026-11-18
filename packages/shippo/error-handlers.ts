import type { CorsairErrorHandler } from 'corsair/core';
import { ShippoAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ShippoAPIError ? error.status : undefined;
}

function retryAfterOf(error: Error): number | undefined {
	return error instanceof ShippoAPIError ? error.retryAfter : undefined;
}

// Shippo's status codes: https://docs.goshippo.com/api-concepts/apihttp-status-codes
// Its limits are per minute and per endpoint-verb, documented at
// https://docs.goshippo.com/api-concepts/rate-limits — list routes are the
// tightest at 10/min in test mode.
export const errorHandlers = {
	// 429 for exceeding the per-minute limit. Shippo sends no Retry-After, so a
	// 60-second wait is the documented-safe default: every window is a minute,
	// so waiting one full window clears the counter.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ShippoAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error) ?? 60_000,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 `{ detail }`: a missing or unknown token. Shippo checks auth before
	// routing, so an unknown path answers 401 too; a retry cannot help either.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 field errors, 404 unknown object, 409 duplicate address or too many
	// concurrent calls, 422 unprocessable. Each replays the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (error.name === 'ZodError') return true;
			return (
				status === 400 || status === 404 || status === 409 || status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Reads are replayable; a write is not, because a 5xx on a label
	// purchase or a refund may already have been applied at the carrier.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ShippoAPIError &&
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

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	// Caller keys first: core takes the first handler whose match passes, so a
	// builtin key placed before a caller's would shadow it.
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
