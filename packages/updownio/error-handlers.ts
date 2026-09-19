import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * The client wraps transport failures in `UpdownIOAPIError`, which carries the
 * HTTP status across but is not an `ApiError`. Read the status off either shape
 * so classification keeps working once an error has been wrapped.
 */
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	const status = (error as { status?: unknown }).status;
	return typeof status === 'number' ? status : undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError && error.retryAfter !== undefined) {
		return error.retryAfter;
	}
	const cause = (error as { cause?: unknown }).cause;
	if (cause instanceof ApiError && cause.retryAfter !== undefined) {
		return cause.retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		// updown.io throttles per account; the caller retries rather than this
		// layer, so the delay is surfaced without compounding a retry loop here.
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid api key') ||
				msg.includes('api key is required')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
