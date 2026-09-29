import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import type { NorthflankAPIError } from './client';

function getStatus(error: Error): number | undefined {
	// NorthflankAPIError exposes status as an optional field. View the error
	// through an intersection instead of casting or narrowing.
	const holder: Error & Partial<NorthflankAPIError> = error;
	return holder.status;
}

const WRITE_OPERATIONS: ReadonlySet<string> = new Set([
	'projects.create',
	'projects.createOrUpdate',
	'projects.update',
	'projects.delete',
	'secrets.create',
	'secrets.createOrUpdate',
	'secrets.patch',
	'secrets.update',
]);

function isWriteOperation(operation?: string): boolean {
	if (operation === undefined) return false;
	return WRITE_OPERATIONS.has(operation);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context?: ErrorContext) => getStatus(error) === 429,
		handler: async (error: Error, context?: ErrorContext) => {
			if (
				context?.operation !== undefined &&
				isWriteOperation(context.operation)
			) {
				console.warn(
					`[NORTHFLANK:${context.operation}] Rate limit encountered on write operation — not retried to prevent duplicate resources: ${error.message}`,
				);
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff',
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _context?: ErrorContext) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 401 || status === 403;
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
		handler: async (error: Error, context?: ErrorContext) => {
			if (
				context?.operation !== undefined &&
				isWriteOperation(context.operation)
			) {
				console.warn(
					`[NORTHFLANK:${context.operation}] Server error on write operation — not retried to prevent duplicate resources: ${error.message}`,
				);
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff',
			};
		},
	},
	DEFAULT: {
		match: (_error: Error, _context?: ErrorContext) => true,
		handler: async (error: Error, _context?: ErrorContext) => {
			console.error(`[NORTHFLANK] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
