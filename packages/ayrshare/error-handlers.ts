import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Ayrshare's JSON error envelope carries a numeric `code`.
 *
 * Empty history (live 2026-08-13) nests that envelope under `history` instead
 * of at the top level: `{ history: { code: 221, status: "error", … } }`.
 * Docs: https://www.ayrshare.com/docs/errors/errors-ayrshare
 */
export function ayrshareErrorCode(error: Error): number | undefined {
	if (!(error instanceof ApiError) || !isRecord(error.body)) return undefined;
	if (typeof error.body.code === 'number') return error.body.code;
	const nested = error.body.history;
	if (isRecord(nested) && typeof nested.code === 'number') return nested.code;
	return undefined;
}

/**
 * Whether replaying an operation could delete a post twice or miss a
 * confirmation. Corsair re-invokes the whole endpoint when a handler asks for
 * a retry, so a network failure after Ayrshare already deleted is unsafe to
 * replay. `autoSchedule.set` is an upsert and is safe.
 */
export const isNonIdempotent = (operation: string): boolean =>
	operation === 'posts.delete';

const NOT_FOUND_CODES = new Set([
	114, // delete id not found (live 2026-08-13: HTTP 404)
	192, // no auto-schedules have ever been set
	221, // history not found for the requested window
	383, // post already deleted
]);

/**
 * Ayrshare reports failures with ordinary HTTP status codes plus a numeric
 * `code` in the JSON body.
 *
 * Docs: https://www.ayrshare.com/docs/errors/errors-http
 */
export const errorHandlers = {
	/**
	 * Transport already retries a 429 (client maxRetries: 2). Returning
	 * another budget here would re-invoke the endpoint and multiply that.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid_auth')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[AYRSHARE:${context.operation}] Authentication failed - check the API key (https://app.ayrshare.com)`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 403 is a suspended User Profile or a key that is not allowed to call
	 * this route. Retrying will not unsuspend the profile.
	 */
	PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('access denied') || msg.includes('forbidden');
		},
		handler: async (error, context) => {
			console.warn(
				`[AYRSHARE:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const code = ayrshareErrorCode(error);
			if (code !== undefined && NOT_FOUND_CODES.has(code)) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('does not exist');
		},
		handler: async (error, context) => {
			console.warn(
				`[AYRSHARE:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 400) {
				const code = ayrshareErrorCode(error);
				return code === undefined || !NOT_FOUND_CODES.has(code);
			}
			return error instanceof ApiError && error.status === 405;
		},
		handler: async (error, context) => {
			console.warn(
				`[AYRSHARE:${context.operation}] Invalid request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status !== undefined) {
				return error.status >= 500;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('500') || msg.includes('internal server error');
		},
		handler: async (_error, context) => ({
			maxRetries: isNonIdempotent(context.operation) ? 0 : 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('network') ||
				msg.includes('connection') ||
				msg.includes('econnrefused') ||
				msg.includes('enotfound') ||
				msg.includes('etimedout') ||
				msg.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[AYRSHARE:${context.operation}] Network error: ${error.message}`,
			);
			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 2,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[AYRSHARE:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
