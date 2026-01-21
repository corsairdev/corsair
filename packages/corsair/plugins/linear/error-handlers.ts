import type { CorsairErrorHandler } from '../../core/errors';
import { ApiError } from '../../async-core/ApiError';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				errorMessage.includes('rate limit') ||
				errorMessage.includes('too many requests') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			console.log(`[LINEAR:${context.operation}] Rate limit exceeded`);

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
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication') ||
				errorMessage.includes('invalid token') ||
				errorMessage.includes('token expired') ||
				errorMessage.includes('token revoked') ||
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('access denied')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[LINEAR:${context.operation}] Authentication failed - check your API key`,
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
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not found') ||
				errorMessage.includes('does not exist') ||
				errorMessage.includes('could not find') ||
				errorMessage.includes('issue not found') ||
				errorMessage.includes('team not found') ||
				errorMessage.includes('project not found') ||
				errorMessage.includes('comment not found') ||
				errorMessage.includes('user not found')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[LINEAR:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	VALIDATION_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 400) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('validation') ||
				errorMessage.includes('invalid input') ||
				errorMessage.includes('bad request') ||
				errorMessage.includes('malformed') ||
				errorMessage.includes('required field') ||
				errorMessage.includes('graphql validation')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[LINEAR:${context.operation}] Validation error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
