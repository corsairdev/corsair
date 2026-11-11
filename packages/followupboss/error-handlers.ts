import type { CorsairErrorHandler } from 'corsair/core';
import { FollowUpBossAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof FollowUpBossAPIError ? error.status : undefined;
}

// Status codes and their meaning: https://docs.followupboss.com/reference/error-responses
export const errorHandlers = {
	// FUB enforces a sliding 10-second window per context (global 250/10s with
	// a registered X-System-Key) and answers 429 with a Retry-After header. The
	// window is short, so waiting for Retry-After and replaying is safe: FUB
	// states a 429 request was not processed.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof FollowUpBossAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs:
				error instanceof FollowUpBossAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong or revoked API key. Basic auth with a bad key never
	// succeeds on a retry.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: no access to the resource, or the account expired into its grace
	// period and is locked down. Either way the state must change first.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 malformed request and 404 unknown resource. A retry sends the same
	// request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// FUB documents truncated exponential backoff for 5xx. Only reads are
	// replayed: a failed write may have gone through.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof FollowUpBossAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
