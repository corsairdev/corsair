import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limit') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			return {
				retryable: true,
				retryAfterMs: 2000,
				message: error.message,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('401') ||
				msg.includes('403')
			);
		},
		handler: async (error: Error) => {
			return {
				retryable: false,
				message: error.message,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not_found') || msg.includes('404');
		},
		handler: async (error: Error) => {
			return {
				retryable: false,
				message: error.message,
			};
		},
	},
} satisfies Record<string, CorsairErrorHandler>;
