import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ConversiontoolsDownloadError } from './client';

const SAFE_READ_OPERATIONS = new Set([
	'account.verify',
	'account.getInfo',
	'account.getConfig',
	'conversions.list',
	'conversions.get',
	'files.getInfo',
	'files.downloadById',
	'files.downloadFromLink',
	'tasks.list',
	'tasks.get',
]);

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof ConversiontoolsDownloadError && error.status === 429)
				return true;
			const message = error.message.toLowerCase();
			return message.includes('rate limit') || message.includes('rate_limited');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return retryAfterMs === undefined
				? { maxRetries: 0 }
				: { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof ConversiontoolsDownloadError && error.status === 401)
				return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('not authorized') || message.includes('unauthorized')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 403;
			if (error instanceof ConversiontoolsDownloadError)
				return error.status === 403;
			return error.message.toLowerCase().includes('paid plan');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && [400, 413].includes(error.status)) {
				return true;
			}
			if (
				error instanceof ConversiontoolsDownloadError &&
				[400, 413].includes(error.status ?? 0)
			) {
				return true;
			}
			return error.message.toLowerCase().includes('bad request');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 404;
			if (error instanceof ConversiontoolsDownloadError)
				return error.status === 404;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 500) ||
			(error instanceof ConversiontoolsDownloadError && error.status === 500),
		handler: async (_error: Error, context: ErrorContext) =>
			SAFE_READ_OPERATIONS.has(context.operation)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' }
				: { maxRetries: 0 },
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
