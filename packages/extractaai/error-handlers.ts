import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ExtractaaiAPIError } from './client';

// Status and retry metadata are read through `instanceof` checks only — the
// CorsairErrorHandler contract passes a plain Error, and this is the same
// pattern used by every other plugin (see packages/brevo/error-handlers.ts).
// No type assertions or manual narrowing of response data are used here.
function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof ExtractaaiAPIError) {
		return error.status;
	}
	return undefined;
}

function getRetryAfterMs(error: Error): number | undefined {
	if (
		(error instanceof ApiError || error instanceof ExtractaaiAPIError) &&
		typeof error.retryAfter === 'number'
	) {
		return error.retryAfter;
	}
	return undefined;
}

// Annotated (not asserted) so the retry strategy keeps its literal type
// without any `as` cast.
const exponentialBackoff: 'exponential_backoff' = 'exponential_backoff';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate limit') ||
				errorMessage.includes('too many requests') ||
				errorMessage.includes('rate-limiting')
			);
		},
		handler: async (error) => {
			return {
				maxRetries: 3,
				retryStrategy: exponentialBackoff,
				headersRetryAfterMs: getRetryAfterMs(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (getStatus(error) === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('invalid token') ||
				errorMessage.includes('missing api key') ||
				errorMessage.includes('key not found')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (getStatus(error) === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permission denied') ||
				errorMessage.includes('access denied') ||
				errorMessage.includes('not permitted')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (getStatus(error) === 404) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('does not exist') ||
				errorMessage.includes('not found')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status === 400 || status === 422) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('bad request') ||
				errorMessage.includes('validation error') ||
				errorMessage.includes('invalid request') ||
				errorMessage.includes('is required')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('internal server error') ||
				errorMessage.includes('service unavailable') ||
				errorMessage.includes('gateway timeout')
			);
		},
		handler: async () => {
			return {
				maxRetries: 2,
				retryStrategy: exponentialBackoff,
			};
		},
	},
	DEFAULT: {
		match: () => {
			return true;
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
