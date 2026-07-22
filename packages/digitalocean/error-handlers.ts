import type { CorsairErrorHandler } from 'corsair/core';
import type { DigitalOceanAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<DigitalOceanAPIError>).status;
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
				'[DIGITALOCEAN] Authentication failed — check your DigitalOcean API token.',
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
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[DIGITALOCEAN] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
