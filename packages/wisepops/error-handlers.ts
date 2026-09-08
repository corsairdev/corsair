import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { WisepopsAPIError } from './client';

const NON_RETRYABLE_OPERATIONS = new Set([
	'webhook.create',
	'dataPrivacy.delete',
]);

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof WisepopsAPIError && error.status === 429)
				return true;
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('too_many_requests') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error, context?: ErrorContext) => {
			let retryAfterMs: number | undefined;
			if (error instanceof WisepopsAPIError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			if (
				context?.operation &&
				NON_RETRYABLE_OPERATIONS.has(context.operation)
			) {
				return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
			}

			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof WisepopsAPIError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('forbidden') ||
				msg.includes('invalid_token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
