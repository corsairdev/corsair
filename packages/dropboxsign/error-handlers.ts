import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DropboxSignAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof DropboxSignAPIError) {
		return error.status;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limit') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async () => {
			return {
				maxRetries: 5,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('401') ||
				msg.includes('403')
			);
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not_found') || msg.includes('404');
		},
		handler: async () => {
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
