import { ApiError } from '../../async-core/ApiError';
import type { CorsairErrorHandler } from '../../core/errors';
import { TelegramAPIError } from './client';

export const errorHandlers = {
	FLOOD_WAIT_ERROR: {
		match: (error, context) => {
			if (error instanceof TelegramAPIError && error.code === '429') {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('flood wait') ||
				errorMessage.includes('too many requests')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof TelegramAPIError && error.parameters?.retry_after) {
				retryAfterMs = error.parameters.retry_after * 1000;
			}

			return {
				maxRetries: 1,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			if (error instanceof TelegramAPIError) {
				const code = error.code;
				return (
					code === '401' ||
					code === '403' ||
					error.message.toLowerCase().includes('unauthorized')
				);
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid token') ||
				errorMessage.includes('bot token')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[TELEGRAM:${context.operation}] Authentication failed - check your bot token`,
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
			if (error instanceof TelegramAPIError) {
				const code = error.code;
				return (
					code === '403' ||
					error.message.toLowerCase().includes('forbidden') ||
					error.message.toLowerCase().includes('not enough rights')
				);
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('permission_denied') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('not enough rights') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[TELEGRAM:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			if (error instanceof TelegramAPIError) {
				const code = error.code;
				return (
					code === '400' ||
					error.message.toLowerCase().includes('not found') ||
					error.message.toLowerCase().includes('chat not found') ||
					error.message.toLowerCase().includes('message not found')
				);
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not found') ||
				errorMessage.includes('chat not found') ||
				errorMessage.includes('message not found') ||
				errorMessage.includes('user not found')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[TELEGRAM:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	MIGRATE_CHAT_ERROR: {
		match: (error, context) => {
			if (error instanceof TelegramAPIError && error.parameters?.migrate_to_chat_id) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return errorMessage.includes('migrate_to_chat_id');
		},
		handler: async (error, context) => {
			console.warn(
				`[TELEGRAM:${context.operation}] Chat migrated: ${error.message}`,
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
				`[TELEGRAM:${context.operation}] Network error: ${error.message}`,
			);

			return {
				maxRetries: 3,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[TELEGRAM:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
