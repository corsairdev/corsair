import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BrevoAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof BrevoAPIError) {
		return error.status;
	}
	return undefined;
}

function getRetryAfterMs(error: Error): number | undefined {
	if (
		(error instanceof ApiError || error instanceof BrevoAPIError) &&
		typeof error.retryAfter === 'number'
	) {
		return error.retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate limit') ||
				errorMessage.includes('too many requests') ||
				errorMessage.includes('resourcelimitreached')
			);
		},
		handler: async (error) => {
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: getRetryAfterMs(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (getStatus(error) === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid api-key') ||
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('missing api key') ||
				errorMessage.includes('key not found')
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
			if (getStatus(error) === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permission denied') ||
				errorMessage.includes('access denied') ||
				errorMessage.includes('not permitted')
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
			if (getStatus(error) === 404) {
				return true;
			}
			if (
				error instanceof BrevoAPIError &&
				(error.code === 'document_not_found' ||
					error.code === 'resourcenotfound')
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return errorMessage.includes('not found');
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status === 400 || status === 422) {
				return true;
			}
			if (
				error instanceof BrevoAPIError &&
				(error.code === 'invalid_parameter' ||
					error.code === 'missing_parameter' ||
					error.code === 'duplicate_parameter')
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('bad request') ||
				errorMessage.includes('validation error') ||
				errorMessage.includes('invalid parameter') ||
				errorMessage.includes('missing parameter') ||
				errorMessage.includes('duplicate parameter')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	QUOTA_ERROR: {
		match: (error) => {
			if (getStatus(error) === 402) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return errorMessage.includes('payment required');
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('internal server error') ||
				errorMessage.includes('service unavailable') ||
				errorMessage.includes('gateway timeout')
			);
		},
		handler: async () => {
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
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
