import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { AeroleadsAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof AeroleadsAPIError) return error.status;
	return undefined;
}

function messageOf(error: Error): string {
	return error.message.toLowerCase();
}

export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = messageOf(error);
			return (
				msg.includes('unauthorized') ||
				msg.includes('wrong api key') ||
				msg.includes('valid api key') ||
				msg.includes('pass your api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	CREDIT_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 402) return true;
			return messageOf(error).includes('credit limit');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = messageOf(error);
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 400) return true;
			return messageOf(error).includes('linkedin url');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => messageOf(error).includes('no profile details'),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
