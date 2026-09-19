import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function safeStatus(error: Error): number | 'unknown' {
	return error instanceof ApiError ? error.status : 'unknown';
}

/**
 * Endpoint-level `maxRetries` is always 0: `bind.ts` retries but discards a
 * successful result and rethrows the original error. Transport-level retry
 * in `corsair/http` `request()` is the only working 429 loop.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[AUTOM:${context.operation}] Rate limited after transport retries (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid api key');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[AUTOM:${context.operation}] Authentication failed (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	PAYMENT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			return error.message.toLowerCase().includes('payment required');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[AUTOM:${context.operation}] Payment required (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[AUTOM:${context.operation}] Permission denied (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			return error.message.toLowerCase().includes('bad request');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[AUTOM:${context.operation}] Invalid request (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error: Error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
			);
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[AUTOM:${context.operation}] Network error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error, context) => {
			console.error(
				`[AUTOM:${context.operation}] Unhandled error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
