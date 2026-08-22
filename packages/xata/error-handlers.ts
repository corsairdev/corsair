import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { XataAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError || error instanceof XataAPIError) &&
				error.status === 429
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				error.message.includes('429')
			);
		},
		handler: async (error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError || error instanceof XataAPIError) &&
				error.status === 401
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication_required') ||
				errorMessage.includes('invalid_api_key')
			);
		},
		handler: async (error, context) => {
			console.error(
				`[XATA:${context.operation}] Authentication failed - check your API key`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError || error instanceof XataAPIError) &&
				error.status === 403
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('permission_denied') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[XATA:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError || error instanceof XataAPIError) &&
				error.status === 404
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not_found') ||
				errorMessage.includes('workspace_not_found') ||
				errorMessage.includes('table_not_found') ||
				errorMessage.includes('record_not_found')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[XATA:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	VALIDATION_ERROR: {
		match: (error) => {
			if (
				(error instanceof ApiError || error instanceof XataAPIError) &&
				(error.status === 400 || error.status === 422 || error.status === 409)
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('validation') ||
				errorMessage.includes('bad_request') ||
				errorMessage.includes('invalid_parameter')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[XATA:${context.operation}] Validation error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('network') ||
				errorMessage.includes('connection') ||
				errorMessage.includes('econnrefused') ||
				errorMessage.includes('enotfound') ||
				errorMessage.includes('etimedout') ||
				errorMessage.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[XATA:${context.operation}] Network error: ${error.message}`,
			);

			return {
				maxRetries: 3,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[XATA:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
