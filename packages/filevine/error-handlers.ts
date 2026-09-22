import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FilevineAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof FilevineAPIError) return error.status;
	return (error as { status?: number }).status;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof FilevineAPIError) return error.retryAfter;
	return (error as { retryAfter?: number }).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _ctx) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error, _ctx) => {
			return { maxRetries: 5, headersRetryAfterMs: getRetryAfter(error) };
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _ctx) => {
			if (getStatus(error) === 401 || getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid token') ||
				msg.includes('token_revoked') ||
				msg.includes('token_expired') ||
				msg.includes('not_authed')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error, _ctx) => {
			if (getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('permission') ||
				msg.includes('insufficient') ||
				msg.includes('access_denied') ||
				msg.includes('missing_scope')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error, _ctx) => {
			if (getStatus(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('not_found');
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error, _ctx) => {
			if (getStatus(error) === 400) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('validation') ||
				msg.includes('bad request') ||
				msg.includes('invalid')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error: Error, _ctx) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('network') ||
				msg.includes('econnrefused') ||
				msg.includes('enotfound') ||
				msg.includes('etimedout') ||
				msg.includes('fetch failed')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
