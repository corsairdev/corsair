import type { CorsairErrorHandler } from '../../core/errors';

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

			return {
				maxRetries: 5,
				// slack sends a retryAfter in the headers if you get rate limited
				// we need to get the milliseconds and then put them into this:
				headersRetryAfterMs: 1000,
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
} satisfies CorsairErrorHandler;
