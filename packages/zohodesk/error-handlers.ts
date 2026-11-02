import type { CorsairErrorHandler } from 'corsair/core';
import { ZodError } from 'zod';
import { ZohoDeskAPIError } from './client';

// A Retry-After means the daily credits ran out, and they come back when the
// data center's day ends, so it can be hours. Holding a call open that long is
// worse than failing it.
const MAX_RETRY_AFTER_MS = 60_000;

const WRITE_OPERATIONS = new Set([
	'departments.uploadLogo',
	'tasks.updateMany',
]);

function apiError(error: Error): ZohoDeskAPIError | undefined {
	return error instanceof ZohoDeskAPIError ? error : undefined;
}

function hasCode(error: Error, codes: readonly string[]): boolean {
	const code = apiError(error)?.code;
	return code !== undefined && codes.includes(code);
}

// No status means no response came back: a dropped connection or a timeout.
function isTransientFailure(error: Error): boolean {
	const failure = apiError(error);
	if (!failure) return false;
	return failure.status === undefined || failure.status >= 500;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// TOO_MANY_REQUESTS is the org-wide concurrency limit, THRESHOLD_EXCEEDED
		// the credit limit. Zoho refused both before doing any work, so retrying a
		// write is safe too.
		match: (error: Error) =>
			apiError(error)?.status === 429 ||
			hasCode(error, ['THRESHOLD_EXCEEDED', 'TOO_MANY_REQUESTS']),
		handler: async (error, context) => {
			const retryAfter = apiError(error)?.retryAfter;
			if (retryAfter === undefined) {
				return { maxRetries: 5, retryStrategy: 'exponential_backoff_jitter' };
			}
			if (retryAfter > MAX_RETRY_AFTER_MS) {
				console.warn(
					`[ZOHODESK:${context.operation}] Daily API credits used up, retry in ${Math.ceil(retryAfter / 1000)}s`,
				);
				return { maxRetries: 0 };
			}
			// The wait covers the whole reset, so a second retry would add nothing.
			return { maxRetries: 1, headersRetryAfterMs: retryAfter };
		},
	},
	// Before AUTH_ERROR: Zoho can answer these with a 401 status, and a new token
	// does not fix either a missing scope or the wrong org.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			apiError(error)?.status === 403 ||
			hasCode(error, [
				'FORBIDDEN',
				'SCOPE_MISMATCH',
				'OAUTH_ORG_MISMATCH',
				'LICENSE_ACCESS_LIMITED',
			]),
		handler: async (error, context) => {
			console.warn(
				`[ZOHODESK:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			apiError(error)?.status === 401 ||
			hasCode(error, ['UNAUTHORIZED', 'INVALID_OAUTH']),
		handler: async (_error, context) => {
			console.warn(
				`[ZOHODESK:${context.operation}] Authentication failed, check the access and refresh tokens`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			apiError(error)?.status === 404 || hasCode(error, ['URL_NOT_FOUND']),
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ZodError) return true;
			const status = apiError(error)?.status;
			return (
				status === 400 || status === 413 || status === 415 || status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: isTransientFailure,
		// Neither a 5xx nor a lost connection says whether a write landed, so only
		// reads repeat.
		handler: async (_error, context) =>
			WRITE_OPERATIONS.has(context.operation)
				? { maxRetries: 0 }
				: { maxRetries: 2, retryStrategy: 'exponential_backoff' },
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[ZOHODESK:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;

/**
 * Adds a caller's handlers. DEFAULT stays last because core takes the first
 * match in key order and DEFAULT matches everything, so a handler placed after
 * it would never run.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
