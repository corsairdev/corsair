import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { SuzanneAPIError } from './client';

const RETRY_AFTER_CAP_MS = 60_000;
const RETRY_AFTER_JITTER_MS = 250;

function asSuzanne(error: Error): SuzanneAPIError | undefined {
	return error instanceof SuzanneAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asSuzanne(error)?.status;
}

function codeOf(error: Error): string | undefined {
	return asSuzanne(error)?.code;
}

function cappedRetryAfter(error: Error): number | undefined {
	const retryAfter = asSuzanne(error)?.retryAfter;
	if (retryAfter === undefined) return undefined;
	const jitter = Math.floor(Math.random() * RETRY_AFTER_JITTER_MS);
	return Math.min(retryAfter, RETRY_AFTER_CAP_MS) + jitter;
}

export const errorHandlers = {
	// Status matchers are mostly disjoint. IDEMPOTENCY_CONFLICT and
	// JOB_NOT_DONE must stay ahead of CONCURRENT_LIMIT: all three are 409,
	// and only the concurrent ceiling is safe to retry.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	IDEMPOTENCY_CONFLICT: {
		match: (error: Error) =>
			statusOf(error) === 409 && codeOf(error) === 'idempotency_key_conflict',
		handler: async () => ({ maxRetries: 0 }),
	},
	JOB_NOT_DONE: {
		match: (error: Error) =>
			statusOf(error) === 409 && codeOf(error) === 'job_not_done',
		handler: async () => ({ maxRetries: 0 }),
	},
	CONCURRENT_LIMIT: {
		match: (error: Error) =>
			statusOf(error) === 409 && codeOf(error) === 'concurrent_limit_reached',
		// Docs: back off and retry. maxRetries 2 + the initial call = 3 attempts.
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: cappedRetryAfter(error),
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	UPLOAD_RETRY: {
		match: (error: Error, context: ErrorContext) =>
			statusOf(error) === 500 && context.operation === 'uploads.create',
		// POST /v1/uploads documents a 500 as "retry". One retry, two attempts.
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
