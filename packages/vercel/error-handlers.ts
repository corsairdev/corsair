import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

const status = (error: Error) =>
	error instanceof ApiError ? error.status : undefined;

export const errorHandlers = {
	// Core's request() has already retried the 429 three times (honouring
	// Retry-After) by the time it reaches here, so no further retries.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => status(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	// A 401 reaches core's OAuth refresh before these handlers; for an API key
	// it means the token is wrong or revoked, and retrying won't change that.
	AUTH_ERROR: {
		match: (error: Error) => status(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token lacks the scope, or the resource belongs to a team the
	// token can't reach (pass that team's teamId).
	PERMISSION_ERROR: {
		match: (error: Error) => status(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
