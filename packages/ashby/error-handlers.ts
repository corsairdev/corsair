import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { AshbyAPIError } from './client';

function getRetryAfterMs(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof AshbyAPIError) {
		return error.retryAfter;
	}
	return undefined;
}

function isReadOperation(operation: string | undefined): boolean {
	if (!operation) return false;
	return /\.(info|list|search|listNotes|scheduleList|stageList|scheduleInfo)$/.test(
		operation,
	);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			if (error instanceof AshbyAPIError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate limit') ||
				errorMessage.includes('too many requests') ||
				(error instanceof AshbyAPIError && error.code === 'rate_limit_exceeded')
			);
		},
		handler: async (error, context) => {
			const headersRetryAfterMs = getRetryAfterMs(error);
			if (!isReadOperation(context?.operation)) {
				return {
					maxRetries: 0,
					headersRetryAfterMs,
				};
			}
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError && error.status === 401) ||
				(error instanceof AshbyAPIError && error.status === 401)
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('missing api key')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError && error.status === 403) ||
				(error instanceof AshbyAPIError && error.status === 403)
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permission denied') ||
				errorMessage.includes('access denied') ||
				errorMessage.includes('missing_endpoint_permission') ||
				(error instanceof AshbyAPIError &&
					error.code === 'missing_endpoint_permission')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError && error.status === 404) ||
				(error instanceof AshbyAPIError && error.status === 404)
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not found') ||
				(error instanceof AshbyAPIError && error.code === 'resource_not_found')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError &&
					(error.status === 400 || error.status === 422)) ||
				(error instanceof AshbyAPIError &&
					(error.status === 400 || error.status === 422))
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('bad request') ||
				errorMessage.includes('validation error') ||
				errorMessage.includes('invalid parameter') ||
				errorMessage.includes('next_cursor_expired') ||
				errorMessage.includes('incremental_sync_too_large')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError && error.status && error.status >= 500) ||
				(error instanceof AshbyAPIError && error.status && error.status >= 500)
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('internal server error') ||
				errorMessage.includes('service unavailable') ||
				errorMessage.includes('gateway timeout')
			);
		},
		handler: async (_error, context) => {
			if (!isReadOperation(context?.operation)) {
				return {
					maxRetries: 0,
				};
			}
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	DEFAULT: {
		match: () => {
			return true;
		},
		handler: async (error, context) => {
			console.error(`[corsair:${context.pluginId}:${context.operation}]`, {
				error: error.message,
			});

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
