import type { CorsairErrorHandler } from 'corsair/core';
import type { MondayMcpAPIError } from './client';

// The client throws MondayMcpAPIError with the HTTP status of the failed
// transport call when the server rejects at the HTTP layer, and with the
// JSON-RPC error code when the failure is protocol-level. Handlers only
// inspect the optional fields, so a plain Error from elsewhere still routes.
function getStatus(error: Error): number | undefined {
	return (error as Partial<MondayMcpAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<MondayMcpAPIError>).retryAfter;
}

// maxRetries is 0 throughout: bind.ts discards the retried call's result and
// rethrows the original error, so retries only add backoff sleeps before the
// same failure surfaces. Callers retry using the metadata preserved on the error.
// MCP tool calls consume the account's daily API call limit, so 429s are a
// normal operating condition, not an exceptional state.
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
				message.includes('invalid api token')
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
				`[MONDAYMCP:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
