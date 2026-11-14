import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KontentAPIError, kontentErrorFields } from './client';

// An HTTP error from Kontent is core's ApiError; KontentAPIError is a request
// that got no answer or could not be sent.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// The Delivery API documents 401, 403, 404 and 429, and distinguishes a missing
// environment from a missing item by `error_code`, not by the status.
// Reference: https://kontent.ai/learn/reference/delivery-api
export const errorHandlers = {
	// A 429 is a throughput limit, and Kontent sends no Retry-After, so the
	// handler's own backoff is the only delay.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// An environment that does not exist reads as a wrong environment ID, which
	// is a configuration mistake rather than a missing item. It sits before
	// VALIDATION_ERROR because both answer 404.
	ENVIRONMENT_NOT_FOUND_ERROR: {
		match: (error: Error) => kontentErrorFields(error).isEnvironmentNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A preview token the environment refused. A published read sends no token.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// The item, type or taxonomy is missing, or was never published.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 404 || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every call here is a GET, so replaying one cannot change anything at
	// Kontent and cannot be charged twice.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection never reached Kontent. TIMEOUT sits first because a
	// timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KontentAPIError && error.timedOut,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof KontentAPIError && error.transport,
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
