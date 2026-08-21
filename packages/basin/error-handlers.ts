import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BasinAPIError } from './client';

const hasNoStatus = (error: unknown): boolean =>
	!(error instanceof ApiError) && !(error instanceof BasinAPIError);

const getStatus = (error: unknown): number | undefined => {
	if (error instanceof ApiError) return error.status;
	if (error instanceof BasinAPIError) return error.status;
	return undefined;
};

const getRetryAfter = (error: unknown): number | undefined => {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof BasinAPIError) return error.retryAfter;
	return undefined;
};

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('rate_limited') ||
					msg.includes('ratelimited') ||
					msg.includes('too many requests') ||
					msg.includes('429'))
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs = getRetryAfter(error);
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('unauthorized') ||
					msg.includes('invalid_auth') ||
					msg.includes('invalid_token') ||
					msg.includes('authentication failed'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Authentication failed - check your Basin API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('forbidden') ||
					msg.includes('permission_denied') ||
					msg.includes('access_denied'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 404) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) && (msg.includes('not found') || msg.includes('404'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 400 || status === 422) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('bad request') ||
					msg.includes('unprocessable') ||
					msg.includes('invalid request') ||
					msg.includes('validation failed'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Invalid request / validation error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500 && status < 600) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('internal server error') || msg.includes('server error'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Server error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error, context: { operation: string }) => {
			console.error(
				`[BASIN:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
