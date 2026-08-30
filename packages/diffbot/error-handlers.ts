import type { CorsairErrorHandler } from 'corsair/core';

type DiffbotError = Error & {
	status?: number;
	retryAfter?: number;
};

function hasStatus(error: Error, status: number): boolean {
	return (error as DiffbotError).status === status;
}

function retryAfter(error: Error): number | undefined {
	return (error as DiffbotError).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (hasStatus(error, 429)) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			return { maxRetries: 5, headersRetryAfterMs: retryAfter(error) };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (hasStatus(error, 401) || hasStatus(error, 403)) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid token') ||
				msg.includes('forbidden')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (hasStatus(error, 404)) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (
				hasStatus(error, 500) ||
				hasStatus(error, 502) ||
				hasStatus(error, 503)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('internal server error') || msg.includes('500');
		},
		handler: async (_error?: Error) => ({ maxRetries: 2 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
