import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// ScrapeCreators errors are `{ success: false, error: "<code>", errorStatus,
// message }` (checked live 11-27). The HTTP status is the primary signal; the
// `error` code, which the client appends to the message, is the fallback for
// wrapped errors that lost their status. Errors cost 0 credits.
function text(error: Error): string {
	return error.message.toLowerCase();
}

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export const errorHandlers = {
	// Out of credits: a retry can't succeed until the account is topped up.
	// Checked before the rate limit because a drained balance is not a 429.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (status(error) === 402) return true;
			const msg = text(error);
			return (
				msg.includes('insufficient credits') ||
				msg.includes('out of credits') ||
				msg.includes('no credits')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Core's request() already retried the 429 three times with Retry-After.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 429;
			const msg = text(error);
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code === 401 || code === 403) return true;
			const msg = text(error);
			return msg.includes('invalid api key') || msg.includes('unauthorized');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (status(error) === 404) return true;
			return text(error).includes('(not_found)');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code === 400 || code === 422) return true;
			const msg = text(error);
			return (
				msg.includes('(bad_request)') ||
				msg.includes('(missing_parameter)') ||
				msg.includes('(invalid_parameter)')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: the upstream platform failed. Every operation is a read, so one
	// retry is safe; errors cost 0 credits.
	SERVER_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			return code !== undefined && code >= 500;
		},
		handler: async () => ({ maxRetries: 1 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
