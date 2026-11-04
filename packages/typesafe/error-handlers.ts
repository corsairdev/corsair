import type { CorsairErrorHandler } from 'corsair/core';
import { TypeSafeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TypeSafeAPIError ? error.status : undefined;
}

// The client's deadline fires as a TimeoutError, wrapped as the error's cause.
function timedOut(error: Error): boolean {
	const name = (error.cause as Error | undefined)?.name ?? error.name;
	return name === 'TimeoutError' || name === 'AbortError';
}

// Status codes: https://docs.typesafe.ai/api/errors ("Request rules and errors").
export const errorHandlers = {
	// 400 breaks a request rule (nesting, unknown model, context too long,
	// images without opt-in), 413/415 are body size and encoding, and 422 is a
	// malformed question. A retry sends the same body.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 413 ||
				status === 415 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: the API key is missing or invalid.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: over the organization's tokens-per-second or requests-per-second
	// limit. TypeSafe documents exponential backoff and sends Retry-After.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TypeSafeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 529: TypeSafe is temporarily overloaded; retry after a short delay.
	OVERLOADED_ERROR: {
		match: (error: Error) => statusOf(error) === 529,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TypeSafeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A request may have been answered (and billed) after the client gave up,
	// so it is not replayed.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 ||
			(statusOf(error) === undefined && timedOut(error)),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
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
