import type { CorsairErrorHandler } from 'corsair/core';
import { AnthropicAdministratorAPIError } from './client';

/**
 * Handlers match on the status carried by `AnthropicAdministratorAPIError`
 * rather than on message text. corsair throws a 429 with the message
 * "Too Many Requests" — which contains neither "429" nor "rate_limited" — so a
 * text-matching policy would never fire.
 */
function asApiError(error: Error): AnthropicAdministratorAPIError | undefined {
	return error instanceof AnthropicAdministratorAPIError ? error : undefined;
}

/**
 * Only GET is safe to replay. A 5xx can be returned after the server already
 * applied a write (a member removed, a workspace archived), and the Admin API
 * documents no idempotency key, so mutations are never retried.
 */
function isSafeToReplay(error: Error): boolean {
	const method = asApiError(error)?.method;
	return method === undefined || method === 'GET';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// Safe to retry for any method: a 429 was rejected before being applied.
		match: (error: Error) => asApiError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: asApiError(error)?.retryAfter,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = asApiError(error)?.status;
			return status === 401 || status === 403;
		},
		handler: async (error: Error) => {
			const type = asApiError(error)?.errorType;
			console.error(
				`[ANTHROPICADMINISTRATOR] Authentication failed${type ? ` (${type})` : ''} — the Admin API requires an Admin API key (sk-ant-admin…), not a standard API key.`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => asApiError(error)?.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	INVALID_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = asApiError(error)?.status;
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = asApiError(error)?.status;
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => {
			if (!isSafeToReplay(error)) return { maxRetries: 0 };
			return { maxRetries: 2, retryStrategy: 'exponential_backoff' as const };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
