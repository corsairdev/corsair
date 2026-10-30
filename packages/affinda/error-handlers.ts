import type { CorsairErrorHandler } from 'corsair/core';
import { AffindaAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof AffindaAPIError) {
		return error.status;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => getStatus(error) === 429,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('forbidden');
		},
		handler: async () => {
			console.error(
				'[AFFINDA] Authentication failed — check your Affinda API key.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => getStatus(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		// No retries: Affinda 5xx can arrive after a mutation committed (e.g. resthooks).
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[AFFINDA] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
