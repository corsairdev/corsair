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
 * A missing or rejected key comes back as HTTP 401 with
 * `{"response":"Invalid API key or insufficient credit."}`.
 * Insufficient credit uses that same 401, so it is an auth failure, not a 402.
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
			return (
				msg.includes('invalid api key') || msg.includes('insufficient credit')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
