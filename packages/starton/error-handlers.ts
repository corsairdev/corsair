import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Starton documents per-plan rate limits (Free 50 req/min, Developer 100
 * req/min, Business up to 10000 req/min) in the OpenAPI `info.description`,
 * but declares no 429 response on any individual path. We therefore route on
 * the HTTP status and honour `Retry-After` when the gateway sends one.
 * https://github.com/starton-io/starton-openapi
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('not_authenticated') ||
				msg.includes('unauthorized') ||
				msg.includes('forbidden')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Blockchain/validation errors (bad ABI args, insufficient funds, gas price
	// issues, could-not-find-resource, ...) are deterministic per the Starton
	// spec's documented error codes — never retryable.
	NOT_RETRYABLE_CLIENT_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.status >= 400 &&
			error.status < 500 &&
			error.status !== 401 &&
			error.status !== 403 &&
			error.status !== 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError && error.status >= 500 && error.status < 600,
		handler: async () => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
