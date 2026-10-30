import type { CorsairErrorHandler } from 'corsair/core';
import { ArynAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ArynAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ArynAPIError) {
				if (error.status === 401 || error.status === 403) return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid aryn api key') ||
				msg.includes('expired aryn api key') ||
				msg.includes('no aryn api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
