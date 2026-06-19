import type { CorsairErrorHandler } from 'corsair/core';
import type { AhrefsAPIError } from './client';

// Cast to Partial<AhrefsAPIError> because the error handler receives a base
// Error type from the Corsair framework; AhrefsAPIError fields are optional
// extras that may not be present on every Error subclass, so Partial is the
// safest narrowing without introducing a separate runtime instanceof check.
function getStatus(error: Error): number | undefined {
	return (error as Partial<AhrefsAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AhrefsAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('429') || message.includes('rate limit');
		},
		handler: async (error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error) => {
			if (getStatus(error) === 401) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid api key') ||
				message.includes('authentication')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[AHREFS:${context.operation}] Authentication failed - check your API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (getStatus(error) === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('forbidden') ||
				message.includes('permission') ||
				message.includes('access denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[AHREFS:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			if (getStatus(error) === 400) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('bad request') ||
				message.includes('invalid request') ||
				message.includes('validation')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[AHREFS:${context.operation}] Bad request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const message = error.message.toLowerCase();
			return message.includes('500') || message.includes('server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[AHREFS:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
