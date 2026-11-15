import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function isQuotaExhaustion(value: unknown): boolean {
	if (typeof value === 'string') {
		return /daily.{0,40}api.{0,40}limit|monthly.{0,40}api.{0,40}limit|quota.{0,40}(exceed|exhaust|reach)|quota_exhausted/i.test(
			value,
		);
	}
	if (Array.isArray(value)) return value.some(isQuotaExhaustion);
	if (typeof value !== 'object' || value === null) return false;

	return Object.entries(value).some(([key, entry]) => {
		const normalizedKey = key.toLowerCase().replace(/[_-]/g, '');
		if (normalizedKey === 'limitleft' && String(entry) === '0') return true;
		return isQuotaExhaustion(entry);
	});
}

export const errorHandlers = {
	// First match wins: daily quota exhaustion cannot succeed on retry,
	// so it is handled before generic rate-limit handling.
	QUOTA_EXHAUSTED_ERROR: {
		match: (error: Error) => {
			return (
				isQuotaExhaustion(error.message) ||
				(error instanceof ApiError && isQuotaExhaustion(error.body))
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key') ||
				msg.includes('not authorized')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('bad request') || msg.includes('invalid request');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				error.status >= 500 &&
				error.status < 600
			)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('internal server error') || msg.includes('500');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
