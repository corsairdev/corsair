import type { CorsairErrorHandler } from 'corsair/core';
import { VaquillAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof VaquillAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (
				error instanceof VaquillAPIError &&
				error.retryAfter !== undefined &&
				error.retryAfter !== null
			) {
				const retryAfterVal = Number(error.retryAfter);
				if (!isNaN(retryAfterVal)) {
					retryAfterMs = retryAfterVal;
				}
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof VaquillAPIError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	CREDITS_EXHAUSTED_ERROR: {
		match: (error: Error) => {
			if (error instanceof VaquillAPIError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('402') ||
				msg.includes('payment required') ||
				msg.includes('insufficient credits')
			);
		},
		handler: async (_error, context) => {
			console.warn(
				`[vaquill:${context.operation}] Credits exhausted; top up at vaquill.ai before retrying`,
			);
			return { maxRetries: 0 };
		},
	},
	DUPLICATE_WATCH_ERROR: {
		match: (error: Error) => {
			if (error instanceof VaquillAPIError && error.status === 409) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('409') ||
				msg.includes('already exists') ||
				msg.includes('duplicate')
			);
		},
		handler: async (_error, context) => {
			console.warn(
				`[vaquill:${context.operation}] A watch already exists for this board and scope`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
