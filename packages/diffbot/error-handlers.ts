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
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			return { maxRetries: 5, headersRetryAfterMs: retryAfter(error) };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (hasStatus(error, 401)) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
