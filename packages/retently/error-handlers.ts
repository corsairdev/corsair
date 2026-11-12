import type { CorsairErrorHandler } from 'corsair/core';
import { RetentlyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RetentlyAPIError ? error.status : undefined;
}

function methodOf(error: Error): string | undefined {
	return error instanceof RetentlyAPIError ? error.method : undefined;
}

/**
 * Status codes: the Response section of each endpoint at
 * https://www.retently.com/docs/api/.
 */
export const errorHandlers = {
	// 150 requests a minute. The docs document no Retry-After, so the delay is
	// exponential unless a header happens to arrive. A 429 means the request was
	// refused before it ran, so replaying is safe even for a write.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RetentlyAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the key is missing, unknown, or belongs to a deleted account. Every
	// route answers `{ message: "Account not found", code: 401, data: null }`.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: a read-only key on a route that needs write permission, or a plan
	// that does not include the feature. The key has to change first.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: the resource does not exist, was deleted, or belongs to another
	// account - all three are the same answer by design.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400/409/413/422: a body Retently refused, a conflict, or a filter that
	// matched more customers than one sync may touch. A retry sends the same
	// request, and the caller has to change it.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 413 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Only a request Retently declared replayable is sent again: a failed
	// write or send may already have taken effect.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error instanceof RetentlyAPIError && (status ?? 0) >= 500;
		},
		handler: async (error: Error) => {
			const replayable = error instanceof RetentlyAPIError && error.replayable;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/** Handlers match in key order and DEFAULT matches everything, so it stays last. */
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
