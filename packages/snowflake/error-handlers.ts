import type {
	CorsairErrorHandler,
	ErrorContext,
	RetryStrategy,
} from 'corsair/core';
import { ZodError } from 'zod';
import { SnowflakeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (!(error instanceof SnowflakeAPIError)) return undefined;
	return error.status;
}

// The client's deadline fires a TimeoutError or AbortError on the cause.
function timedOut(error: Error): boolean {
	const cause = error.cause;
	const name = cause instanceof Error ? cause.name : error.name;
	return name === 'TimeoutError' || name === 'AbortError';
}

// The framework sleeps headersRetryAfterMs with no cap and no jitter, so both
// are applied here. maxRetries 3 means 4 executions: the loop retries while
// attemptNumber < maxRetries, starting at 0.
const RATE_LIMIT_MAX_RETRIES = 3;
const RETRY_AFTER_CAP_MS = 60_000;

function retryAfterDelayMs(retryAfterMs: number): number {
	const capped = Math.min(Math.max(retryAfterMs, 0), RETRY_AFTER_CAP_MS);
	const jitter = (Math.random() - 0.5) * 1000;
	return Math.max(0, Math.min(RETRY_AFTER_CAP_MS, Math.round(capped + jitter)));
}

// Status and provider code only. Message text is not a match, except the
// status-less client timeout, which has no HTTP status to match.
// https://docs.snowflake.com/en/developer-guide/sql-api/reference
export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error, _context: ErrorContext) =>
			error instanceof ZodError || error.name === 'ZodError',
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	// 408: the statement exceeded `timeout` and Snowflake cancelled it.
	STATEMENT_TIMEOUT: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 408,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	// 422: the SQL failed. Cancelling a missing handle is also 422 code 000709.
	QUERY_FAILURE: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 422,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 400,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 401,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	PERMISSION_ERROR: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 403,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	// 404 means the path is not an endpoint. A missing handle on GET is 400
	// code 000709, which this handler already refuses to retry.
	NOT_FOUND_ERROR: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 404,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	METHOD_NOT_ALLOWED: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 405,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	UNSUPPORTED_MEDIA: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 415,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	// 429, including code 390505. No separate daily quota is documented.
	// Retry-After is not documented; honor it when present, capped at 60s.
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context: ErrorContext) => statusOf(error) === 429,
		handler: async (
			error: Error,
			_context: ErrorContext,
		): Promise<RetryStrategy> => {
			const retryAfter =
				error instanceof SnowflakeAPIError ? error.retryAfter : undefined;
			if (retryAfter !== undefined) {
				return {
					maxRetries: RATE_LIMIT_MAX_RETRIES,
					headersRetryAfterMs: retryAfterDelayMs(retryAfter),
					retryStrategy: 'exponential_backoff_jitter',
				};
			}
			return {
				maxRetries: RATE_LIMIT_MAX_RETRIES,
				retryStrategy: 'exponential_backoff_jitter',
			};
		},
	},
	// 500 and 502 are replay-safe only when the same requestId is resent with
	// retry=true. A blind replay can run DML twice and warehouse time is
	// billable, so 5xx is not retried automatically.
	SERVER_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500 && status <= 599;
		},
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	TIMEOUT_ERROR: {
		match: (error: Error, _context: ErrorContext) =>
			statusOf(error) === undefined && timedOut(error),
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	DEFAULT: {
		match: (_error: Error, _context: ErrorContext) => true,
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
} satisfies CorsairErrorHandler;
