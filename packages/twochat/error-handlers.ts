import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import type { TwoChatAPIError } from './client';

// The framework hands error handlers a base Error; TwoChatAPIError fields are
// optional extras, so Partial<TwoChatAPIError> is the safest view.
function getStatus(error: Error): number | undefined {
	return (error as Partial<TwoChatAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<TwoChatAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('ratelimited') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error, _context: ErrorContext) => {
			return { maxRetries: 5, headersRetryAfterMs: getRetryAfter(error) };
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid_key')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[TWOCHAT:${context.operation}] Authentication failed – check your API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('permission_denied') ||
				msg.includes('insufficient')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[TWOCHAT:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('network') ||
				msg.includes('connection') ||
				msg.includes('econnrefused') ||
				msg.includes('enotfound') ||
				msg.includes('etimedout') ||
				msg.includes('fetch failed')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[TWOCHAT:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: (_error: Error, _context: ErrorContext) => true,
		handler: async (error: Error, context: ErrorContext) => {
			console.error(
				`[TWOCHAT:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
