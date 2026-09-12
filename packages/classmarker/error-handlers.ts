import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ClassmarkerAPIError } from './client';

function statusCode(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.status;
	}
	if (error instanceof ClassmarkerAPIError) {
		return error.status;
	}
	return undefined;
}

function retryAfterMs(error: Error): number | undefined {
	if (error instanceof ApiError && error.retryAfter !== undefined) {
		return error.retryAfter;
	}
	if (error instanceof ClassmarkerAPIError && error.retryAfter !== undefined) {
		return error.retryAfter;
	}
	return undefined;
}

function isRateLimitError(error: Error): boolean {
	if (statusCode(error) === 429) {
		return true;
	}

	if (
		error instanceof ClassmarkerAPIError &&
		error.code === 'rateLimitExceeded'
	) {
		return true;
	}

	const message = error.message.toLowerCase();
	return message.includes('rate limit') || message.includes('429');
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isRateLimitError(error),
		handler: async (error: Error) => {
			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusCode(error) === 401) {
				return true;
			}

			if (error instanceof ClassmarkerAPIError) {
				return error.code === 'apiKeyAuthFail';
			}

			const message = error.message.toLowerCase();
			return message.includes('authorization failed');
		},
		handler: async () => {
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (statusCode(error) === 400) {
				return true;
			}

			if (error instanceof ClassmarkerAPIError) {
				return (
					error.code === 'finishedAfterTimestampTooEarly' ||
					error.code === 'invalidInput'
				);
			}

			return false;
		},
		handler: async () => {
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => {
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
