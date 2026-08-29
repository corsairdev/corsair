import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import type { ClientaryAPIError } from './client';

function isNonIdempotentWrite(operation: string): boolean {
	return /\.(create|send|delete)$/.test(operation);
}

/**
 * Helper to extract the HTTP status from an error.
 * Works with ClientaryAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	const status = (error as Partial<ClientaryAPIError>).status;
	return status && status > 0 ? status : undefined;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<ClientaryAPIError>).retryAfter;
}

/**
 * Prefer the HTTP status when present. Fall back to message matching only
 * for errors that carry no status, so a 500 body that mentions "not found"
 * is not classified as NOT_FOUND.
 */
function matchStatusOrMessage(
	error: Error,
	statusMatches: (status: number) => boolean,
	needles: string[],
): boolean {
	const status = getStatus(error);
	if (status !== undefined) return statusMatches(status);
	const message = error.message.toLowerCase();
	return needles.some((needle) => message.includes(needle));
}

/**
 * Error handlers for the Clientary plugin.
 *
 * Clientary returns reliable HTTP status codes:
 * - 401: invalid API credentials (Basic auth with `token:token`)
 * - 403: account lacks permission for the requested resource
 * - 404: resource not found
 * - 422: validation failure (missing/unique/conflicting fields)
 * - 426: request exceeds the account's current plan limits
 * - 429: rate limit exceeded (Retry-After header)
 * - 5xx: server error
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			matchStatusOrMessage(error, (status) => status === 429, [
				'429',
				'rate limit',
			]),
		handler: async (error: Error, context: ErrorContext) => {
			if (isNonIdempotentWrite(context.operation)) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: getRetryAfter(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			matchStatusOrMessage(error, (status) => status === 401, [
				'unauthorized',
				'invalid api key',
				'401',
			]),
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Authentication failed — check that the API token is ' +
					'valid and active for the account subdomain in use.',
			);
			return { maxRetries: 0 };
		},
	},
	FORBIDDEN_ERROR: {
		match: (error: Error) =>
			matchStatusOrMessage(error, (status) => status === 403, [
				'403',
				'forbidden',
			]),
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Request forbidden — the user behind the API token ' +
					'does not have permission for the requested resource.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			matchStatusOrMessage(error, (status) => status === 404, [
				'404',
				'not found',
			]),
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Resource not found — the requested record does not ' +
					"exist or is outside the token user's scope.",
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			matchStatusOrMessage(error, (status) => status === 422, [
				'422',
				'unprocessable',
			]),
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Request rejected — a field is missing, malformed, ' +
					'or violates a uniqueness constraint (see the error body for ' +
					'the offending field).',
			);
			return { maxRetries: 0 };
		},
	},
	PLAN_LIMIT_ERROR: {
		match: (error: Error) =>
			matchStatusOrMessage(error, (status) => status === 426, [
				'426',
				'plan limit',
			]),
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Request rejected — the operation exceeds the ' +
					'current plan limits (e.g. record count). Upgrade the plan ' +
					'or reduce the request scope.',
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			matchStatusOrMessage(error, (status) => status >= 500, [
				'500',
				'internal server error',
			]),
		handler: async (error: Error, context: ErrorContext) => {
			void error;
			if (isNonIdempotentWrite(context.operation)) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	DEFAULT: {
		match: (error: Error) => {
			void error;
			return true;
		},
		handler: async (error: Error) => {
			console.error(`[CLIENTARY] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
