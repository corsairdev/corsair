import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import type { NorthflankAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<NorthflankAPIError>).status;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context?: ErrorContext) => getStatus(error) === 429,
		handler: async (_error: Error, _context?: ErrorContext) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error, _context?: ErrorContext) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('token') ||
				msg.includes('authentication')
			);
		},
		handler: async (_error: Error, _context?: ErrorContext) => {
			console.error(
				'[NORTHFLANK] Authentication failed — check your Northflank API token and permissions.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error, _context?: ErrorContext) => getStatus(error) === 404,
		handler: async (_error: Error, _context?: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	SERVER_ERROR: {
		match: (error: Error, _context?: ErrorContext) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async (_error: Error, _context?: ErrorContext) => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: (_error: Error, _context?: ErrorContext) => true,
		handler: async (error: Error, _context?: ErrorContext) => {
			console.error(`[NORTHFLANK] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
