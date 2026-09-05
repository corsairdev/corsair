import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ClickhouseAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _ctx: ErrorContext) => {
			// Both ApiError (corsair/http REST clients) and ClickhouseAPIError
			// (the raw-fetch client we use for the HTTP SQL interface) report
			// their status code on the instance, so 429s from either path
			// route into this handler.
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof ClickhouseAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error, ctx: ErrorContext) => {
			// query.execute accepts arbitrary SQL. A 429 after ClickHouse
			// accepted an INSERT/ALTER/DROP must not replay the statement.
			if (ctx.operation === 'query.execute') {
				return { maxRetries: 0 };
			}
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _ctx: ErrorContext) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof ClickhouseAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async (_error: Error, _ctx: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	DEFAULT: {
		match: (_error: Error, _ctx: ErrorContext) => true,
		handler: async (_error: Error, _ctx: ErrorContext) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
