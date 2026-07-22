import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { HashnodeAPIError } from './client';

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
				errorMessage.includes('unauthenticated') ||
				errorMessage.includes('authentication') ||
				errorMessage.includes('invalid token') ||
				errorMessage.includes('token expired') ||
				errorMessage.includes('token revoked') ||
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('invalid pat')
			);
		},
		handler: async (error, context) => {
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
				errorMessage.includes('could not find')
			);
		},
		handler: async (error, context) => {
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
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permission denied') ||
				errorMessage.includes('pro plan') ||
				errorMessage.includes('insufficient permissions')
			);
		},
		handler: async (error, context) => {
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
			return {
				maxRetries: 0,
			};
		},
	},
	GRAPHQL_ERROR: {
		match: (error, context) => {
			if (error instanceof HashnodeAPIError) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('graphql') ||
				errorMessage.includes('query') ||
				errorMessage.includes('mutation') ||
				errorMessage.includes('field') ||
				errorMessage.includes('argument') ||
				errorMessage.includes('variable')
			);
		},
		handler: async (error, context) => {
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
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
