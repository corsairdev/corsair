import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function safeStatus(error: Error): number | 'unknown' {
	return error instanceof ApiError ? error.status : 'unknown';
}

const NON_IDEMPOTENT = new Set([
	'messages.sendWhatsappTemplate',
	'actions.execute',
	'actions.executeByUser',
	'gupshup.forwardMessage',
	'shopify.cartCreation',
	'shopify.cartUpdate',
	'shopify.checkoutCreation',
	'shopify.checkoutUpdate',
	'shopify.orderCancellation',
	'shopify.orderFulfillment',
	'shopify.orderPayment',
	'contacts.update',
	'tags.update',
	'templates.update',
	'webhooks.update',
]);

export const isNonIdempotent = (operation: string): boolean =>
	NON_IDEMPOTENT.has(operation);

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 3,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('unauthorized');
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTBABA:${context.operation}] Authentication failed - check the API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTBABA:${context.operation}] Permission denied (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTBABA:${context.operation}] Resource not found (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 400,
		handler: async (error, context) => {
			console.warn(
				`[BOTBABA:${context.operation}] Invalid request (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTBABA:${context.operation}] Network error (status ${safeStatus(error)})`,
			);
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[BOTBABA:${context.operation}] Unhandled error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
