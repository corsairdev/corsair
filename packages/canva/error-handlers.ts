import type { CorsairErrorHandler } from 'corsair/core';
import { CanvaAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof CanvaAPIError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				errorMessage.includes('too_many_requests') ||
				error.message.includes('429')
			);
		},
		handler: async (error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof CanvaAPIError && error.retryAfter !== undefined) {
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
			if (error instanceof CanvaAPIError) {
				if (error.status === 401) return true;
				if (
					error.code === 'invalid_access_token' ||
					error.code === 'revoked_access_token'
				) {
					return true;
				}
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid_token') ||
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('invalid_access_token')
			);
		},
		handler: async (_error, context) => {
			console.warn(
				`[CANVA:${context.operation}] Authentication failed - check your OAuth access token`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof CanvaAPIError) {
				if (error.status === 403) return true;
				if (
					error.code === 'permission_denied' ||
					error.code === 'insufficient_permissions'
				) {
					return true;
				}
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permission') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[CANVA:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof CanvaAPIError) {
				if (error.status === 404) return true;
				if (error.code === 'not_found') return true;
			}
			const errorMessage = error.message.toLowerCase();
			return errorMessage.includes('not_found');
		},
		handler: async (error, context) => {
			console.warn(
				`[CANVA:${context.operation}] Resource not found: ${error.message}`,
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
				`[CANVA:${context.operation}] Network error: ${error.message}`,
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
				`[CANVA:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
