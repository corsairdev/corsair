import type { CorsairErrorHandler } from 'corsair/core';
import type { GoogleAddressValidationAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<GoogleAddressValidationAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<GoogleAddressValidationAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 5,
				headersRetryAfterMs: getRetryAfter(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			// Google Maps Platform APIs reject a missing/invalid key with 403
			// PERMISSION_DENIED, not 401 — same key mechanism as this API.
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
