import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('wrong api key');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	CREDIT_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('credit limit');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
