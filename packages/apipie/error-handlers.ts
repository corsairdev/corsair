import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	/**
	 * Rate limits are retried by the transport, not here. `corsair/http`
	 * already retries a 429 internally (`DEFAULT_RATE_LIMIT_CONFIG.maxRetries`
	 * is 3, honouring `Retry-After`) and returns the attempt that succeeds.
	 * Asking the binder for more retries on top would multiply the two budgets
	 * and replay billable, non-idempotent completions, so this handler
	 * classifies the error and reports `Retry-After` without re-driving it.
	 */
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('rate limit')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	/**
	 * APIpie bills per request and returns `402` with
	 * `{"code":"ACCOUNT_ERROR"}` once an account runs out of credit. Retrying
	 * cannot succeed until the account is topped up, so it is never retried.
	 */
	ACCOUNT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('account_error') ||
				msg.includes('out of credit') ||
				msg.includes('payment required')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	FORBIDDEN_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('permission denied') ||
				msg.includes('insufficient')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	CONFLICT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 409) return true;
			return error.message.toLowerCase().includes('conflict');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid request') ||
				msg.includes('validation') ||
				msg.includes('bad request')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	/**
	 * Server errors are classified but not re-driven. Every billable APIpie
	 * operation (`chat.createCompletion`, `embeddings.create`,
	 * `images.generate`) is a non-idempotent `POST`, and a 5xx gives no
	 * guarantee the upstream call did not already run and bill. Replaying it
	 * risks duplicate charges, so retrying is left to the caller, who knows
	 * whether the operation is safe to repeat.
	 */
	SERVER_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				error.status >= 500 &&
				error.status < 600
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('internal server') ||
				msg.includes('503') ||
				msg.includes('502') ||
				msg.includes('500')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
