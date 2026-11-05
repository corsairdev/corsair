import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { SaperlyAPIError } from './client';

const RETRY_AFTER_CAP_MS = 60_000;
const RETRY_AFTER_JITTER_MS = 250;

function asSaperlyError(error: Error): SaperlyAPIError | undefined {
	return error instanceof SaperlyAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asSaperlyError(error)?.status;
}

function methodOf(error: Error): string | undefined {
	return asSaperlyError(error)?.method;
}

function isIdempotentMethod(method: string | undefined): boolean {
	return method === 'GET' || method === 'DELETE';
}

function hasIdempotencyKey(context: ErrorContext): boolean {
	const key = context.input.idempotencyKey;
	return typeof key === 'string' && key.length > 0;
}

function writesMayReplay(error: Error, context: ErrorContext): boolean {
	const method = methodOf(error);
	if (isIdempotentMethod(method)) return true;
	if (method === 'POST' || method === 'PATCH') {
		return hasIdempotencyKey(context);
	}
	return false;
}

function cappedRetryAfter(error: Error): number | undefined {
	const retryAfter = asSaperlyError(error)?.retryAfter;
	if (retryAfter === undefined) return undefined;
	const jitter = Math.floor(Math.random() * RETRY_AFTER_JITTER_MS);
	return Math.min(retryAfter, RETRY_AFTER_CAP_MS) + jitter;
}

const emptyContext: ErrorContext = {
	pluginId: 'saperly',
	operation: '',
	input: {},
	originalError: new Error('saperly'),
};

export const errorHandlers = {
	// Status matchers are disjoint. DEFAULT stays last because it matches
	// everything. RATE_LIMIT stays behind the fail-fast statuses so a 402
	// or 409 can never be retried as a throttle.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			statusOf(error) === 400 ||
			statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
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
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error, context: ErrorContext = emptyContext) => {
			if (!writesMayReplay(error, context)) {
				return { maxRetries: 0 };
			}
			// maxRetries 2 + the initial call = 3 attempts.
			return {
				maxRetries: 2,
				headersRetryAfterMs: cappedRetryAfter(error),
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	UPSTREAM_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		// The official SDK retries GET/DELETE once on 5xx and never retries
		// POST or PATCH. 5xx Retry-After is not extracted by the shared client.
		handler: async (error: Error) => {
			if (!isIdempotentMethod(methodOf(error))) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 1,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
