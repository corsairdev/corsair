import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// The framework tries handlers in object order (first match wins), so
	// balance exhaustion is checked before the generic rate-limit handler:
	// status_code 1008 "insufficient balance" and 2056 "usage limit exceeded"
	// (docs error-code page) cannot succeed on retry, while 1002 "rate limit"
	// is transient.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('insufficient balance') ||
				msg.includes('usage limit exceeded')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 covers the transport-level rate limit (accepted with a Retry-After
	// header); base_resp.status_code 1002 "rate limit", 1039 "token limit",
	// 1041 "conn limit" and 1045 "rate growth limit" carry the same meaning in
	// the HTTP 200 envelope.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
				msg.includes('rate growth') ||
				msg.includes('too many requests') ||
				msg.includes('token limit') ||
				msg.includes('conn limit')
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
	// 401/403 for the HTTP-status surface; base_resp.status_code 1004 "not
	// authorized", 2042 "you don't have access to this voice_id" and 2049
	// "invalid API Key" are the same class in the HTTP 200 envelope.
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('not authorized') ||
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid api_key') ||
				msg.includes("don't have access")
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400/422 for the HTTP-status surface; status_code 2013 "invalid params"
	// is the same class in the HTTP 200 envelope.
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid params') ||
				msg.includes('invalid request') ||
				msg.includes('bad request')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
