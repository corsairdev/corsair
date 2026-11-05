import type { CorsairErrorHandler } from 'corsair/core';
import { GrafbaseAPIError } from './client';

// Status and payload behavior from https://grafbase.com/docs/platform/api:
// HTTP errors carry a status; GraphQL-level failures arrive with HTTP 200 and
// an errors array. Mutation unions report their own failure variants as data.
export const errorHandlers = {
	// Grafbase does not document rate limits. A 429 is honored with its
	// Retry-After header when sent. Only the platform API serves this endpoint,
	// and it answers 429, never a 409-style substitute.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof GrafbaseAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof GrafbaseAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A missing, wrong or expired token. GraphQL failures surface as an errors
	// array with HTTP 200, so the message is checked alongside the status.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof GrafbaseAPIError &&
			(error.status === 401 ||
				error.status === 403 ||
				error.errors.some((entry) =>
					entry.message.toLowerCase().includes('unauthorized'),
				)),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Zod validation and GraphQL-level failures: an unknown field, a bad
	// variable, a malformed operation. The request never ran, but resending it
	// fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(error instanceof GrafbaseAPIError &&
				error.status === undefined &&
				error.errors.length > 0),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only queries replay on 5xx: a failed mutation may have executed, and
	// publish and the deletes are not idempotent.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof GrafbaseAPIError &&
			error.operationKind === 'query' &&
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
// last. Caller handlers keep their value and come first, so one wins over a
// builtin that matches the same error under a different key; builtin keys the
// caller did not provide are appended after them.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [key, handler] of Object.entries(builtinRest)) {
		if (!(key in merged)) {
			merged[key as keyof CorsairErrorHandler] = handler;
		}
	}
	const fallback = userDefault ?? builtinDefault;
	return fallback ? { ...merged, DEFAULT: fallback } : merged;
}
