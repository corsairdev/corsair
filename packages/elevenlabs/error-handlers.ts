import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ElevenLabsAPIError } from './client';

// ElevenLabs has no idempotency keys, so a retried generation bills again. A
// POST is retried only on the 429 codes that mean the request was refused
// before anything ran. Reads can retry freely.
const REFUSED_BEFORE_RUNNING = new Set([
	'rate_limit_exceeded',
	'concurrent_limit_exceeded',
	'system_busy',
	// The older `detail.status` value for concurrent_limit_exceeded.
	'too_many_concurrent_requests',
]);

// A wait this long doesn't fit in one call, least of all a script's 25 s wall.
const MAX_RETRY_WAIT_MS = 30_000;

const isRead = (error: ApiError) => error.request?.method === 'GET';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (!(error instanceof ApiError) || error.status !== 429) return false;
			if (isRead(error)) return true;
			return (
				error instanceof ElevenLabsAPIError &&
				error.code !== undefined &&
				REFUSED_BEFORE_RUNNING.has(error.code)
			);
		},
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof ApiError ? error.retryAfter : undefined;
			if (retryAfter !== undefined && retryAfter > MAX_RETRY_WAIT_MS) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff_jitter' as const,
				headersRetryAfterMs: retryAfter,
			};
		},
	},
	// 401: missing or wrong key. 403: the plan or the key's scope doesn't allow
	// it (feature_not_available, subscription_required, a restricted key).
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: out of credits. The error's message says so.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A paid POST that answered 5xx may have run, so only reads retry.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError && error.status >= 500 && isRead(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Core takes the first handler in key order whose match is true, and falls back
	// to DEFAULT when none is. It also puts root handlers' keys ahead of a plugin's.
	// So DEFAULT never claims a match: wherever its key lands, every other handler
	// gets its turn first.
	DEFAULT: {
		match: () => false,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * This plugin's handlers with the ones passed to elevenlabs({ errorHandlers }).
 * Custom ones go first, so they win over a built-in that matches the same error,
 * and one with a built-in's name replaces it. A custom DEFAULT replaces the
 * fallback and still runs only when nothing else matched.
 */
export function withCustomHandlers(
	custom: CorsairErrorHandler = {},
): CorsairErrorHandler {
	const { DEFAULT: customDefault, ...customSpecific } = custom;
	const { DEFAULT: builtInDefault, ...builtIn } = errorHandlers;
	return {
		...customSpecific,
		...Object.fromEntries(
			Object.entries(builtIn).filter(([name]) => !(name in customSpecific)),
		),
		DEFAULT: {
			match: () => false,
			handler: customDefault?.handler ?? builtInDefault.handler,
		},
	};
}
