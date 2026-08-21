import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ContentfulGraphqlAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError ||
					error instanceof ContentfulGraphqlAPIError) &&
				error.status === 429
			)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (
				(error instanceof ApiError ||
					error instanceof ContentfulGraphqlAPIError) &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = Number(error.retryAfter);
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError ||
					error instanceof ContentfulGraphqlAPIError) &&
				error.status === 401
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('access_token_invalid')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError ||
					error instanceof ContentfulGraphqlAPIError) &&
				error.status === 404
			)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not_found') || msg.includes('space not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	GRAPHQL_ERROR: {
		match: (error: Error) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('persistedquerynotfound') ||
				msg.includes('query not present')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
