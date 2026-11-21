import type { CorsairErrorHandler } from 'corsair/core';
import { PiloterrAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PiloterrAPIError ? error.status : undefined;
}

function isRateLimit(error: Error): boolean {
	if (!(error instanceof PiloterrAPIError)) return false;
	// Piloterr answers rate limits as 401 with a "Rate limit exceeded…"
	// message, not 429 — the error-handling page prescribes waiting and
	// retrying them. Auth failures carry any other message.
	const message = error.message.toLowerCase();
	return (
		(error.status ?? 0) === 401 &&
		(message.includes('rate limit') || message.includes('quota'))
	);
}

// The client retries a 429 up to three times through core, honouring
// Retry-After; the 401 rate-limit form is retried here (2s, then 4s).
// Every documented operation is a GET, so both replays are safe.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			isRateLimit(error) ||
			(error instanceof PiloterrAPIError && error.status === 429),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402 (no credits) needs a top-up, never a retry.
	PAYMENT_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// The docs prescribe exponential backoff (max 3 attempts) for 500s;
	// every operation is a GET, so a replay never double-runs a scrape.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything. Caller keys
// come first so a caller handler for a status no builtin covers can run at
// all, builtins the caller did not name follow, and DEFAULT stays last even
// when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
