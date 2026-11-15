import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// CompanyEnrich answers failures with an RFC 7807 problem document
// (`application/problem+json`, fields `type`/`title`/`status`/`detail`) and
// documents 400, 401, 402, 404, 422 and 429 for the v2 routes, e.g.
// https://docs.companyenrich.com/reference/get_v2-companies-enrich.md
export const errorHandlers = {
	// 402 is documented on every paid route: the credit balance cannot cover
	// the call (docs: https://docs.companyenrich.com/docs/credits.md), so a
	// retry can only succeed after the balance changes.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('insufficient credits') ||
				msg.includes('insufficient_credits')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			// The rate-limit guide and v2 OpenAPI disagree on the applied limit.
			// Do not encode either; forward parsed retryAfter only when present.
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
				msg.includes('forbidden') ||
				msg.includes('invalid api key')
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
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 422) return true;
			return error.message.toLowerCase().includes('validation');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('bad request') || msg.includes('invalid request');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
