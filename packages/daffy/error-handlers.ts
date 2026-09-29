import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Operations that persist server-side state without an idempotency key.
 *
 * Corsair replays the whole endpoint when a handler requests a retry, so a 429
 * raised after Daffy already created the gift would duplicate it on the next
 * attempt. `makeDaffyRequest` disables transport retries for POSTs; this set
 * ensures the plugin error policy also returns `maxRetries: 0` for gift
 * creation.
 */
export const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'gifts.create',
]);

export function isNonIdempotent(operation: string): boolean {
	return NON_IDEMPOTENT_OPERATIONS.has(operation);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error, context: ErrorContext) => {
			if (isNonIdempotent(context.operation)) {
				console.warn(
					`[DAFFY:${context.operation}] Rate limited on a non-idempotent write - not retried because the write may already have been applied: ${error.message}`,
				);
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
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
