import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Handler order matters: the framework evaluates handlers in object order and
// uses the first match. 402 (credits/subscription/plan) is checked before the
// generic 429 retry because none of the 402 conditions can succeed on retry,
// while a transient 429 can.
export const errorHandlers = {
	// The API returns 402 for `insufficient_credits`, `subscription_required`,
	// and `plan_upgrade_required`
	// (docs.magichour.ai/api-reference: 402 Payment Required). All three mean
	// the account cannot run the request as-is, so retrying never helps.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('insufficient credits') ||
				msg.includes('insufficient_credits') ||
				msg.includes('subscription_required') ||
				msg.includes('plan_upgrade_required')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit')
			);
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
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 `invalid_request` and 422 `unprocessable_entity` both indicate a
	// malformed or semantically invalid request, so neither is retryable.
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('invalid request') ||
				msg.includes('invalid_request') ||
				msg.includes('unprocessable')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
