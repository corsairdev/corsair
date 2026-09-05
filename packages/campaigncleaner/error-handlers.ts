import type { CorsairErrorHandler } from 'corsair/core';
import { CampaignCleanerAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof CampaignCleanerAPIError && error.status === 429)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			return { maxRetries: 5 };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof CampaignCleanerAPIError && error.status === 401)
				return true;
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
