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
 * A missing key comes back as HTTP 401 with
 * `{"error":{"error_code":10001,"error_message":"API key not found."}}`.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const msg = messageOf(error);
			return msg.includes('api key') || msg.includes('error_code":10001');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
