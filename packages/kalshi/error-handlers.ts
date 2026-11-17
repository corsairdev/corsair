import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KalshiAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof KalshiAPIError) return error.status;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// Status only: message text can contain "429" without any HTTP call
		// (e.g. a Zod error for batch order index 429), which must not retry.
		match: (error: Error) => getStatus(error) === 429,
		// Kalshi's 429 carries no Retry-After header (body: {"error":"too many
		// requests"}), so back off exponentially with jitter. Each retry re-enters
		// the client, which signs it again with a fresh timestamp.
		handler: async () => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid kalshi credentials')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
