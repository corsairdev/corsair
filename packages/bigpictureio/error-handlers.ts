import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function messageHas(error: Error, ...needles: string[]): boolean {
	const message = error.message.toLowerCase();
	return needles.some((needle) => message.includes(needle));
}

const noRetry = async () => ({ maxRetries: 0 });

export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			messageHas(error, 'unauthorized', 'invalid_auth'),
		handler: noRetry,
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 || messageHas(error, 'forbidden'),
		handler: noRetry,
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 404 || messageHas(error, 'not found'),
		handler: noRetry,
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				status === 400 ||
				status === 422 ||
				messageHas(error, 'unprocessable', 'validation')
			);
		},
		handler: noRetry,
	},
	LOOKUP_PENDING: {
		match: (error: Error) =>
			statusOf(error) === 202 ||
			messageHas(error, 'still processing', 'accepted'),
		handler: noRetry,
	},
	QUOTA_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 402 || messageHas(error, 'over quota'),
		handler: noRetry,
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || messageHas(error, 'rate_limited', '429'),
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			(statusOf(error) ?? 0) >= 500 ||
			messageHas(error, 'internal server', 'unavailable'),
		handler: async (error: Error) => {
			if (error instanceof ApiError && error.request.method === 'GET') {
				return {
					maxRetries: 3,
					retryStrategy: 'exponential_backoff' as const,
				};
			}
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: noRetry,
	},
} satisfies CorsairErrorHandler;
