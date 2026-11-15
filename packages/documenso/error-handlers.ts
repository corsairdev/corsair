import type { CorsairErrorHandler } from 'corsair/core';
import { DocumensoAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof DocumensoAPIError
				? error.status === 429
				: /too many requests|rate.?limit|429/i.test(error.message),
		handler: async (error: Error) => ({
			// No requests are automatically replayed: send/distribute/cancel and quota-consuming creates are not documented as idempotent. Preserve the provider's Retry-After for the caller.
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof DocumensoAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof DocumensoAPIError
				? error.status === 401 || error.status === 403
				: /unauthorized|forbidden|invalid api key/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof DocumensoAPIError
				? error.status === 404
				: /not found/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof DocumensoAPIError
				? error.status === 400 || error.status === 422
				: /bad request|invalid input/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof DocumensoAPIError
				? error.status >= 500
				: /internal server|server error/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
