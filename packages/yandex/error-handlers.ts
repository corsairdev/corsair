import type { CorsairErrorHandler } from 'corsair/core';
import { YandexAPIError } from './client';

function grpcOf(error: Error): number | undefined {
	return error instanceof YandexAPIError ? error.grpcCode : undefined;
}

/**
 * Yandex Cloud reports a failure in gRPC's JSON mapping, so `code` is a gRPC
 * status rather than an HTTP one: 3 invalid argument, 5 not found, 7 permission
 * denied, 8 resource exhausted, 16 unauthenticated. The HTTP status is usually
 * 400 whatever the gRPC code says, which is why these handlers read `code`.
 */
export const errorHandlers = {
	// gRPC 8, or an HTTP 429: the quota or rate is exhausted.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof YandexAPIError && error.isResourceExhausted,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof YandexAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// gRPC 16: an unknown key, or a bad or expired IAM token.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof YandexAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// gRPC 7: the key is valid but the role does not allow the call.
	PERMISSION_ERROR: {
		match: (error: Error) => grpcOf(error) === 7,
		handler: async () => ({ maxRetries: 0 }),
	},
	// gRPC 5, or an HTTP 404.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof YandexAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// gRPC 3: a missing field, an unknown language code or an over-long text.
	// Also a ZodError, which never reaches the network.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(error instanceof YandexAPIError && error.isValidationError),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx. Every call here is a POST, but translation has no side effect, so a
	// retry is safe — which is why this is not restricted to GET the way a write
	// would be.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof YandexAPIError && (error.status ?? 0) >= 500,
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
