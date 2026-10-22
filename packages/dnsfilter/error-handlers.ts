import type { CorsairErrorHandler } from 'corsair/core';
import { DnsfilterAPIError } from './client';

/**
 * DNSFilter rate limits every endpoint and documents `Retry-After` plus the
 * `RateLimit-*` headers on 429 responses, so we honour the server-provided
 * delay instead of guessing. `makeDnsfilterRequest` normalises every transport
 * failure into `DnsfilterAPIError` (status + retryAfter) before Corsair
 * dispatches it, so the matchers below check that type.
 */
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
