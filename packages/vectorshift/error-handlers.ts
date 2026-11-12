import type { CorsairErrorHandler } from 'corsair/core';
import { VectorshiftAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof VectorshiftAPIError ? error.status : undefined;
}

/**
 * Errors: https://docs.vectorshift.ai/api-reference/overview
 *
 * A failure is `{ error: "..." }`, and a missing key has its own messages
 * rather than a code. Note that this API is documented as beta, so the sets
 * below follow the documented routes and fall back to the status.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof VectorshiftAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof VectorshiftAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401, plus the three messages the API uses for a missing or malformed key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof VectorshiftAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but the plan or role does not cover the resource.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 or 422, and a ZodError from the input schema.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(error instanceof VectorshiftAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 200 that reported `status: 'failed'` in its body. The run may have done
	// real work before failing — a pipeline can have side effects — so it is not
	// replayed.
	RUN_FAILED_ERROR: {
		match: (error: Error) => error.name === 'VectorshiftRunFailedError',
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A pipeline or transformation run may have had
	// side effects, and a create may already have made the object.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof VectorshiftAPIError &&
			error.method === 'GET' &&
			(statusOf(error) ?? 0) >= 500,
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
