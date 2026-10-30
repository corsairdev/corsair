import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	BetterProposalsAPIError,
	BetterProposalsRateLimitError,
} from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BetterProposalsRateLimitError) return true;
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof BetterProposalsAPIError && error.status === 429)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof BetterProposalsRateLimitError
					? error.retryAfterMs
					: error instanceof ApiError
						? error.retryAfter
						: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			if (
				error instanceof BetterProposalsAPIError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid token') ||
				msg.includes('invalid_token') ||
				msg.includes('forbidden')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PLAN_ERROR: {
		match: (error: Error) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('trial expired') ||
				msg.includes('trial has expired') ||
				msg.includes('current plan') ||
				msg.includes('unsupported plan')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	CLIENT_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				error.status &&
				error.status >= 400 &&
				error.status < 500
			)
				return true;
			if (
				error instanceof BetterProposalsAPIError &&
				error.status &&
				error.status >= 400 &&
				error.status < 500
			)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('malformed request') || msg.includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				error.status &&
				error.status >= 500 &&
				error.status < 600
			)
				return true;
			if (
				error instanceof BetterProposalsAPIError &&
				error.status &&
				error.status >= 500 &&
				error.status < 600
			)
				return true;
			return false;
		},
		handler: async () => ({ maxRetries: 2 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
