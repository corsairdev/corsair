import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	return undefined;
}

function messageOf(error: Error): string {
	return error.message.toLowerCase();
}

/**
 * An empty key was measured as HTTP 403 HTML containing "Invalid API key".
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const msg = messageOf(error);
			if (statusOf(error) === 401) return true;
			if (statusOf(error) === 403 && msg.includes('api key')) return true;
			return msg.includes('invalid api key');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
