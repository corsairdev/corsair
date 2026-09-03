import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PrismaAPIError } from './client';

function rateLimitMeta(error: Error): {
	status?: number;
	retryAfter?: number;
} {
	if (error instanceof ApiError || error instanceof PrismaAPIError) {
		return { status: error.status, retryAfter: error.retryAfter };
	}
	return {};
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const { status } = rateLimitMeta(error);
			if (status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			const { retryAfter } = rateLimitMeta(error);
			return { maxRetries: 5, headersRetryAfterMs: retryAfter };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const { status } = rateLimitMeta(error);
			if (status === 401) return true;
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
