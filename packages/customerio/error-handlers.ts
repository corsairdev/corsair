import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Error routing for the Customer.io plugin (R7).
// Covers rate-limit (429 with Retry-After), auth, permissions, network,
// not-found, validation and server errors. Every match/handler pair is fully
// typed via the CorsairErrorHandler contract: no `any`, no assertions,
// no manual narrowing beyond the `instanceof ApiError` status check that the
// framework itself documents for reading HTTP status codes.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error): boolean => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const message: string = error.message.toLowerCase();
			return message.includes('rate_limited') || message.includes('429');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error): boolean => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const message: string = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid_auth') ||
				message.includes('invalid api key') ||
				message.includes('authentication')
			);
		},
		handler: async (_error: Error) => {
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error): boolean => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const message: string = error.message.toLowerCase();
			return (
				message.includes('forbidden') ||
				message.includes('permission_denied') ||
				message.includes('access_denied') ||
				message.includes('insufficient')
			);
		},
		handler: async (_error: Error) => {
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error): boolean => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			const message: string = error.message.toLowerCase();
			return message.includes('not_found') || message.includes('not found');
		},
		handler: async (_error: Error) => {
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error): boolean => {
			if (error instanceof ApiError && error.status === 400) {
				return true;
			}
			if (error instanceof ApiError && error.status === 422) {
				return true;
			}
			const message: string = error.message.toLowerCase();
			return (
				message.includes('validation') ||
				message.includes('invalid request') ||
				message.includes('bad request')
			);
		},
		handler: async (_error: Error) => {
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error): boolean => {
			if (
				error instanceof ApiError &&
				error.status >= 500 &&
				error.status <= 599
			) {
				return true;
			}
			const message: string = error.message.toLowerCase();
			return (
				message.includes('internal server error') ||
				message.includes('502') ||
				message.includes('503')
			);
		},
		handler: async (_error: Error) => {
			return { maxRetries: 2 };
		},
	},
	NETWORK_ERROR: {
		match: (error: Error): boolean => {
			const message: string = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
			);
		},
		handler: async (_error: Error) => {
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: (_error: Error): boolean => {
			return true;
		},
		handler: async (_error: Error) => {
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
