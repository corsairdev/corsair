import type { CorsairErrorHandler } from 'corsair/core';
import { DnsfilterAPIError } from './client';

// 429s include Retry-After / RateLimit-* headers; retry with the server's delay.
// The transport turns failures into DnsfilterAPIError before we get them.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof DnsfilterAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs:
				error instanceof DnsfilterAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof DnsfilterAPIError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof DnsfilterAPIError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error instanceof DnsfilterAPIError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
