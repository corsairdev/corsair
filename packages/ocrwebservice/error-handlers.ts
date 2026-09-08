import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { OcrWebServiceAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.status;
	}

	return (error as Partial<OcrWebServiceAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.retryAfter;
	}

	return (error as Partial<OcrWebServiceAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) {
				return true;
			}

			const msg = error.message.toLowerCase();

			return msg.includes('rate_limited') || msg.includes('429');
		},

		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) {
				return true;
			}

			const msg = error.message.toLowerCase();

			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},

		handler: async () => ({
			maxRetries: 0,
		}),
	},

	DEFAULT: {
		match: () => true,

		handler: async () => ({
			maxRetries: 0,
		}),
	},
} satisfies CorsairErrorHandler;
