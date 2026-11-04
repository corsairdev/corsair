import type { CorsairErrorHandler } from 'corsair/core';
import { ElasticsearchAPIError } from './client';

// Elasticsearch does not document a Retry-After header, and the framework
// sleeps `headersRetryAfterMs` verbatim with no cap or jitter. Cap the value
// locally and add jitter so concurrent callers don't retry in lockstep.
// 429 guidance: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/api-conventions
const RETRY_AFTER_CAP_MS = 60_000;
const RETRY_AFTER_JITTER_MS = 250;

function cappedRetryAfterMs(
	retryAfter: number | undefined,
): number | undefined {
	if (retryAfter === undefined) return undefined;
	const capped = Math.min(retryAfter, RETRY_AFTER_CAP_MS);
	return capped + Math.floor(Math.random() * RETRY_AFTER_JITTER_MS);
}

function statusOf(error: Error): number | undefined {
	return error instanceof ElasticsearchAPIError ? error.status : undefined;
}

function errorTypeOf(error: Error): string | undefined {
	return error instanceof ElasticsearchAPIError ? error.errorType : undefined;
}

// The client's deadline fires as a TimeoutError, wrapped as the error's cause.
function timedOut(error: Error): boolean {
	const name = (error.cause as Error | undefined)?.name ?? error.name;
	return name === 'TimeoutError' || name === 'AbortError';
}

// All plugin endpoints are idempotent reads, so 5xx and 429 replays are safe.
// Retry counts below are handler retries: maxRetries 3 means 4 executions,
// maxRetries 2 means 3.
export const errorHandlers = {
	// 400 (or a Zod rejection before the wire): resending the same malformed
	// request cannot succeed.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Elasticsearch always answers eventually, so a 408 (wait_for timeout) or
	// a client deadline means the cluster is busy; a retry re-queues the
	// request at the back and adds load (api-conventions: HTTP client
	// configuration). Not replayed.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 ||
			(statusOf(error) === undefined && timedOut(error)),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 is the cluster's push-back signal (rejected executions surface as
	// es_rejected_execution_exception). Docs: retry after a short delay and
	// back off exponentially.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 ||
			errorTypeOf(error) === 'es_rejected_execution_exception',
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: cappedRetryAfterMs(
				error instanceof ElasticsearchAPIError ? error.retryAfter : undefined,
			),
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
