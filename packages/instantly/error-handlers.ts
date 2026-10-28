import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { InstantlyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof InstantlyAPIError ? error.status : undefined;
}

function retryAfterOf(error: Error): number | undefined {
	return error instanceof InstantlyAPIError ? error.retryAfter : undefined;
}

// The client's deadline fires as a TimeoutError, wrapped as the error's cause.
function timedOut(error: Error): boolean {
	const name = (error.cause as Error | undefined)?.name ?? error.name;
	return name === 'TimeoutError' || name === 'AbortError';
}

// fetch fails with a TypeError when the connection itself fails.
function networkFailed(error: Error): boolean {
	const cause = error.cause as Error | undefined;
	return cause?.name === 'TypeError' || error.name === 'TypeError';
}

// emails.list allows 20 requests a minute, so one request every 3 seconds.
// Instantly does not always send Retry-After, and the core's exponential
// backoff (1 s, 2 s, 4 s) would spend all three retries inside that window.
const EMAILS_LIST_SPACING_MS = 3_000;

/**
 * Status codes: https://api.instantly.ai/openapi/api_v2.json (400, 401, 402,
 * 404 and 429 on every endpoint).
 *
 * Only reads are retried. A write that failed with a 429, a 5xx or a timeout
 * may still have run (a reply sent, leads uploaded against the workspace's
 * lifetime contact limit), so it is never replayed: the caller decides.
 *
 * @param isRead whether an operation path (e.g. `leads.list`) only reads.
 */
export function createErrorHandlers(
	isRead: (operation: string) => boolean,
): CorsairErrorHandler {
	const readsOnly = (context: ErrorContext | undefined) =>
		context !== undefined && isRead(context.operation);

	return {
		// 400 invalid input (FST_ERR_VALIDATION). A retry sends the same input.
		VALIDATION_ERROR: {
			match: (error: Error) =>
				error.name === 'ZodError' ||
				statusOf(error) === 400 ||
				statusOf(error) === 422,
			handler: async () => ({ maxRetries: 0 }),
		},
		// 401: the API key is missing, invalid or revoked.
		AUTH_ERROR: {
			match: (error: Error) => statusOf(error) === 401,
			handler: async () => ({ maxRetries: 0 }),
		},
		// 402: the workspace has no paid plan for this. Waiting does not help.
		PLAN_ERROR: {
			match: (error: Error) => statusOf(error) === 402,
			handler: async () => ({ maxRetries: 0 }),
		},
		// 403: the key's scopes or the plan do not cover the endpoint.
		PERMISSION_ERROR: {
			match: (error: Error) => statusOf(error) === 403,
			handler: async () => ({ maxRetries: 0 }),
		},
		NOT_FOUND_ERROR: {
			match: (error: Error) => statusOf(error) === 404,
			handler: async () => ({ maxRetries: 0 }),
		},
		// 429: the workspace-wide limit (100/s, 6,000/min) or emails.list's
		// 20/min. A rate-limited request did not run, but writes are still
		// left to the caller.
		RATE_LIMIT_ERROR: {
			match: (error: Error) => statusOf(error) === 429,
			handler: async (error: Error, context?: ErrorContext) => {
				if (!readsOnly(context)) return { maxRetries: 0 };
				const retryAfter = retryAfterOf(error);
				if (retryAfter === undefined && context?.operation === 'emails.list') {
					return { maxRetries: 3, headersRetryAfterMs: EMAILS_LIST_SPACING_MS };
				}
				return {
					maxRetries: 3,
					headersRetryAfterMs: retryAfter,
					retryStrategy: 'exponential_backoff_jitter' as const,
				};
			},
		},
		TIMEOUT_ERROR: {
			match: (error: Error) =>
				statusOf(error) === 504 ||
				(statusOf(error) === undefined && timedOut(error)),
			handler: async (_error: Error, context?: ErrorContext) =>
				readsOnly(context)
					? { maxRetries: 1, retryStrategy: 'linear_2s' as const }
					: { maxRetries: 0 },
		},
		SERVER_ERROR: {
			match: (error: Error) => {
				const status = statusOf(error);
				return status !== undefined && status >= 500;
			},
			handler: async (_error: Error, context?: ErrorContext) =>
				readsOnly(context)
					? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
					: { maxRetries: 0 },
		},
		NETWORK_ERROR: {
			match: (error: Error) =>
				statusOf(error) === undefined && networkFailed(error),
			handler: async (_error: Error, context?: ErrorContext) =>
				readsOnly(context)
					? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
					: { maxRetries: 0 },
		},
		DEFAULT: {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		},
	} satisfies CorsairErrorHandler;
}

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
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
