import type { CorsairErrorHandler } from 'corsair/core';
import type { TavilyMcpAPIError } from './client';

// Cast to Partial<TavilyMcpAPIError> because the error handler receives a base
// Error type from the Corsair framework; TavilyMcpAPIError fields are optional
// extras that may not be present on every Error subclass, so Partial is the
// safest narrowing without introducing a separate runtime instanceof check.
function getStatus(error: Error): number | undefined {
	return (error as Partial<TavilyMcpAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<TavilyMcpAPIError>).retryAfter;
}

// maxRetries is 0 throughout: bind.ts discards the retried call's result and
// rethrows the original error, so retries only add backoff sleeps before the
// same failure surfaces. Callers retry using the metadata preserved on the error.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('429') ||
				message.includes('rate limit') ||
				message.includes('rate_limited') ||
				message.includes('too many requests')
			);
		},
		handler: async (error) => ({
			maxRetries: 0,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid_auth') ||
				message.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const message = error.message.toLowerCase();
			return message.includes('500') || message.includes('server error');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[TAVILYMCP:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
