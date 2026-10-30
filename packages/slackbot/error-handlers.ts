import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Slack signals most failures as HTTP 200 with `{ ok: false, error: "<code>" }`,
 * which `makeSlackbotRequest` rethrows as a SlackbotAPIError whose message is
 * the raw Slack error code. Matching therefore has to cover both the transport
 * status and those codes.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('ratelimited');
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
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			// Slack's non-retryable auth codes; token_expired/refresh is handled by
			// the OAuth layer before a request is ever issued.
			return (
				msg.includes('invalid_auth') ||
				msg.includes('not_authed') ||
				msg.includes('account_inactive') ||
				msg.includes('token_revoked') ||
				msg.includes('token_expired')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	MISSING_SCOPE_ERROR: {
		match: (error: Error) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('missing_scope') || msg.includes('not_allowed_token_type')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
