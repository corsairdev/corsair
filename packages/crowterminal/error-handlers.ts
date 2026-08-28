import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// CrowTerminal returns { error, code } with documented code families:
// AUTH_001-006 (401/403), VAL_001-004 (400), RES_001-004 (404/409/410),
// RATE_001-002 (429), EXT_001/004 (502/503), BIZ_001-003 (402/403).
const AUTH_CODE = /\bauth_00[1-6]\b/;
const RATE_CODE = /\brate_00[12]\b/;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return RATE_CODE.test(msg) || msg.includes('too many requests');
		},
		handler: async (error: Error) => {
			// maxRetries stays 0. The transport already retries 429 and honours
			// Retry-After, and a retry here would replay writes such as data
			// ingestion and webhook mutations, which have no idempotency key.
			// Retry-After is still forwarded so callers can back off themselves.
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				AUTH_CODE.test(msg) ||
				msg.includes('api key required') ||
				msg.includes('invalid or revoked api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
