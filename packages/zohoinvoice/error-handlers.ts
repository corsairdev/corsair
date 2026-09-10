import type { CorsairErrorHandler } from 'corsair/core';

function statusOf(error: Error): number | undefined {
	const status = (error as { status?: unknown }).status;
	return typeof status === 'number' ? status : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs = (error as { retryAfter?: unknown }).retryAfter;
			return {
				maxRetries: 5,
				headersRetryAfterMs:
					typeof retryAfterMs === 'number' ? retryAfterMs : undefined,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid_oauthtoken')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 ||
			error.message.toLowerCase().includes('forbidden'),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 404 ||
			error.message.toLowerCase().includes('not found'),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({ maxRetries: 2 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
