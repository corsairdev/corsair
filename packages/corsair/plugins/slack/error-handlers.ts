import type { CorsairErrorHandler } from '../../core/errors';
import { ApiError } from '../../async-core/ApiError';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			console.log(`[SLACK:${context.operation}] Rate limit exceeded`);

			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('token_revoked') ||
				errorMessage.includes('token_expired') ||
				errorMessage.includes('not_authed')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[SLACK:${context.operation}] Authentication failed - check your bot token`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('missing_scope') ||
				errorMessage.includes('account_inactive') ||
				errorMessage.includes('token_required') ||
				errorMessage.includes('permission_denied') ||
				errorMessage.includes('insufficient_permissions') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[SLACK:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NETWORK_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('network') ||
				errorMessage.includes('connection') ||
				errorMessage.includes('econnrefused') ||
				errorMessage.includes('enotfound') ||
				errorMessage.includes('etimedout') ||
				errorMessage.includes('fetch failed') ||
				errorMessage.includes('network error')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[SLACK:${context.operation}] Network error: ${error.message}`,
			);

			return {
				maxRetries: 3,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('channel_not_found') ||
				errorMessage.includes('user_not_found') ||
				errorMessage.includes('file_not_found') ||
				errorMessage.includes('message_not_found')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[SLACK:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[SLACK:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
