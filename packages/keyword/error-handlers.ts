import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isKeywordQuotaError,
	isKeywordRateLimit,
	KeywordAPIError,
} from './client';

// Keyword's HTTP errors arrive as core's ApiError; KeywordAPIError is a request
// that got no answer, so it has no status.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Keyword publishes 401, 403, 404, 422 and 429 on its routes, plus the usual
// gateway statuses. Reference: https://keyword.com/docs/serp-api/
export const errorHandlers = {
	// The plan's keyword allowance is full, or a refresh needs an upgrade. No
	// retry can fix a quota, so this sits before RATE_LIMIT_ERROR rather than
	// after: both look like "slow down", and only one of them clears on its own.
	QUOTA_ERROR: {
		match: (error: Error) => isKeywordQuotaError(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Keyword limits each token to 60 requests a minute (30 for competitor
	// history) and sends no Retry-After, so the backoff is exponential.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isKeywordRateLimit(error),
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is an invalid or missing bearer token. A token is revoked rather than
	// expired, so a retry cannot fix it.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a token whose user cannot do this: a viewer, a user limited to some
	// projects, or a create that needs write access across the account.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is an unknown project, group or keyword, and 422 a field Keyword
	// refused. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 404 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read is safe to replay: Keyword answers the same request with the same
	// data. A write is not, because a 5xx after a keyword add can arrive once the
	// keyword exists, and a replay would create a second one.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached Keyword. TIMEOUT sits first
	// because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KeywordAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KeywordAPIError && error.method === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof KeywordAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KeywordAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim a status no builtin covers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
