import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.status;
	}

	const status = (error as { status?: number; cause?: { status?: number } })
		.status;
	if (typeof status === 'number') {
		return status;
	}

	const causeStatus = (error as { cause?: { status?: number } }).cause?.status;
	return typeof causeStatus === 'number' ? causeStatus : undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.retryAfter;
	}

	const retryAfter = (
		error as {
			retryAfter?: number;
			cause?: { retryAfter?: number };
		}
	).retryAfter;
	if (typeof retryAfter === 'number') {
		return retryAfter;
	}

	const causeRetryAfter = (error as { cause?: { retryAfter?: number } }).cause
		?.retryAfter;
	return typeof causeRetryAfter === 'number' ? causeRetryAfter : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
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
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
