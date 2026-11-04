import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ClickSendAPIError } from './client';

const rateLimitPattern = /\brate\b|429|too many requests/;
const badRequestPattern = /bad request|\binvalid\b|\bmissing\b/;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof ClickSendAPIError && error.status === 429)
				return true;
			const msg = error.message.toLowerCase();
			return rateLimitPattern.test(msg);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof ClickSendAPIError && error.status === 401)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('authenticate') ||
				msg.includes('unauthorized') ||
				msg.includes('invalid credentials') ||
				msg.includes('invalid_auth')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			if (error instanceof ClickSendAPIError && error.status === 400)
				return true;
			const msg = error.message.toLowerCase();
			return badRequestPattern.test(msg);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
