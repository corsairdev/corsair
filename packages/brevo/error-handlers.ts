import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BrevoAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			if (error instanceof BrevoAPIError && error.status === 429) {
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
			let retryAfter = 1;
			if (
				(error instanceof ApiError || error instanceof BrevoAPIError) &&
				error.retryAfter
			) {
				retryAfter = error.retryAfter;
			}

			return {
				maxRetries: 3,
				backoffMs: retryAfter * 1000,
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError && error.status === 401) ||
				(error instanceof BrevoAPIError && error.status === 401)
			) {
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
			if (
				(error instanceof ApiError && error.status === 403) ||
				(error instanceof BrevoAPIError && error.status === 403)
			) {
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
			if (
				(error instanceof ApiError && error.status === 404) ||
				(error instanceof BrevoAPIError && error.status === 404)
			) {
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
			if (
				(error instanceof ApiError &&
					(error.status === 400 || error.status === 422)) ||
				(error instanceof BrevoAPIError &&
					(error.status === 400 || error.status === 422))
			) {
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
	SERVER_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError && error.status && error.status >= 500) ||
				(error instanceof BrevoAPIError && error.status && error.status >= 500)
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
		handler: async () => {
			return {
				maxRetries: 2,
				backoffMs: 1000,
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
				input: context.input,
			});

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
