import type { CorsairErrorHandler } from 'corsair/core';
import { BoltIotAPIError, BoltIotRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BoltIotRateLimitError) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('rate limit')
			);
		},
		handler: async () => ({ maxRetries: 5 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof BoltIotAPIError) {
				return error.message.toLowerCase().includes('invalid api key');
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid_auth') ||
				msg.includes('401')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
