import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** Canva's error code from the body it returns, e.g. permission_denied. */
function canvaCodeOf(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	// unknown: error.body is whatever Canva sent; only a string `code` is used.
	const body = error.body as { code?: unknown } | undefined;
	return typeof body?.code === 'string' ? body.code : undefined;
}

/** Canva's own explanation, which core's ApiError message ("Forbidden") leaves out. */
function canvaReasonOf(error: Error): string {
	if (!(error instanceof ApiError)) return error.message;
	// unknown: as above, only a string `message` is used.
	const body = error.body as { message?: unknown } | undefined;
	const code = canvaCodeOf(error);
	const message = typeof body?.message === 'string' ? body.message : '';
	return [error.message, code, message].filter(Boolean).join(': ');
}

// Reads are safe to send again. A write that failed on the network or with a
// 5xx may still have landed in Canva (a second design, a second upload).
const READ_OPERATION = /^(?:\w+\.(?:get\w*|list\w*)|exports\.download)$/;

function isReplayable(error: Error, operation: string | undefined): boolean {
	if (error instanceof ApiError && error.request?.method === 'GET') return true;
	return operation !== undefined && READ_OPERATION.test(operation);
}

const NETWORK_ERROR =
	/network|connection|econnrefused|enotfound|etimedout|econnreset|fetch failed/i;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => statusOf(error) === 429,
		// Core's request() has already retried a 429 three times, honouring
		// Retry-After; retrying again here would only stack more waits.
		handler: async (error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error) =>
			statusOf(error) === 401 ||
			canvaCodeOf(error) === 'invalid_access_token' ||
			canvaCodeOf(error) === 'revoked_access_token',
		handler: async (_error, context) => {
			console.warn(
				`[CANVA:${context.operation}] Authentication failed: reconnect Canva if a token refresh doesn't fix it`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) =>
			statusOf(error) === 403 || canvaCodeOf(error) === 'permission_denied',
		handler: async (error, context) => {
			console.warn(
				`[CANVA:${context.operation}] Refused: ${canvaReasonOf(error)}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) =>
			statusOf(error) === 404 || canvaCodeOf(error) === 'not_found',
		handler: async (error, context) => {
			console.warn(
				`[CANVA:${context.operation}] Not found: ${canvaReasonOf(error)}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error, context) =>
			isReplayable(error, context.operation)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	NETWORK_ERROR: {
		match: (error) =>
			!(error instanceof ApiError) && NETWORK_ERROR.test(error.message),
		handler: async (error, context) => {
			console.warn(
				`[CANVA:${context.operation}] Network error: ${error.message}`,
			);
			return isReplayable(error, context.operation)
				? { maxRetries: 3 }
				: { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[CANVA:${context.operation}] Unhandled error: ${canvaReasonOf(error)}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
