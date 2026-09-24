import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isRetryableOperation } from './idempotency';

/**
 * Starton documents per-plan rate limits (Free 50 req/min, Developer 100
 * req/min, Business up to 10000 req/min) in the OpenAPI `info.description`,
 * but declares no 429 response on any individual path. We therefore route on
 * the HTTP status and honour `Retry-After` when the gateway sends one.
 *
 * Retries are granted only to operations on the verified retry-safe allowlist
 * in `./idempotency.ts`; everything else — including an unrecognised operation
 * or a missing error context — is surfaced to the caller instead of replayed.
 * https://github.com/starton-io/starton-openapi
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async (error: Error, context?: ErrorContext) => {
			// `corsair/http` already retried this request up to 3 times before the
			// error surfaced here. Replaying a transaction-producing write on top of
			// that could broadcast it twice, so only operations on the verified
			// retry-safe allowlist get further attempts — an absent or unrecognised
			// operation fails closed.
			if (!isRetryableOperation(context?.operation)) {
				return { maxRetries: 0 };
			}
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
		// A 5xx is ambiguous: Starton may have accepted and broadcast the
		// transaction before the response failed. Reads are replayed; writes that
		// touch the chain are surfaced to the caller instead of being duplicated.
		handler: async (_error: Error, context?: ErrorContext) => {
			if (!isRetryableOperation(context?.operation)) {
				return { maxRetries: 0 };
			}
			return { maxRetries: 3 };
		},
	},
	// Transport failures (DNS, socket reset, timeout) never reach a typed
	// ApiError. They are ambiguous for every write, and Corsair's default is
	// already no-retry, so the safe behaviour is simply to surface them.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
