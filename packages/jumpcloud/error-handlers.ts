import type { CorsairErrorHandler } from 'corsair/core';
import type { JumpCloudAPIError } from './client';

// The client throws JumpCloudAPIError with the HTTP status of the failed
// transport call. Handlers only inspect the optional fields, so a plain Error
// from elsewhere still routes.
function getStatus(error: Error): number | undefined {
	return (error as Partial<JumpCloudAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<JumpCloudAPIError>).retryAfter;
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
			// The client builds JumpCloudAPIError messages from the HTTP status
			// only, so printing the message never leaks provider response bodies
			// (which can echo submitted request values) into the logs.
			console.error(
				`[JUMPCLOUD:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
