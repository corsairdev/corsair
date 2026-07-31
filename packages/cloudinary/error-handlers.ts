import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CloudinaryAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof ApiError && error.status === 420) return true;
			if (error instanceof CloudinaryAPIError && error.code === '429')
				return true;
			if (error instanceof CloudinaryAPIError && error.code === '420')
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit');
		},
		handler: async (error: Error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			console.warn(
				`[CLOUDINARY:${context.operation}] Rate limited: ${error.message}`,
			);
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof CloudinaryAPIError && error.code === '401')
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') || msg.includes('authorization required')
			);
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[CLOUDINARY:${context.operation}] Authentication failed - check your API key and secret`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			if (error instanceof CloudinaryAPIError && error.code === '403')
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not allowed') || msg.includes('forbidden');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[CLOUDINARY:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			if (error instanceof CloudinaryAPIError && error.code === '404')
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('resource not found');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[CLOUDINARY:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error: Error) => {
			const msg = error.message.toLowerCase();
			return msg.includes('network') || msg.includes('fetch failed');
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[CLOUDINARY:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error, context) => {
			console.error(
				`[CLOUDINARY:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
