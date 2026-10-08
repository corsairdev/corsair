import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { DatarobotAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.status;
	}
	return (error as Partial<DatarobotAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.retryAfter;
	}
	return (error as Partial<DatarobotAPIError>).retryAfter;
}

function messageIncludes(error: Error, needles: string[]): boolean {
	const haystack = error.message.toLowerCase();
	return needles.some((needle) => haystack.includes(needle));
}

export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			return messageIncludes(error, ['rate limit', 'too many requests', '429']);
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			return messageIncludes(error, [
				'unauthorized',
				'invalid api token',
				'invalid token',
				'authentication failed',
			]);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			return messageIncludes(error, [
				'forbidden',
				'permission denied',
				'access denied',
			]);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			return messageIncludes(error, ['not found']);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => getStatus(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			messageIncludes(error, ['timeout', 'timed out', 'aborted']),
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
