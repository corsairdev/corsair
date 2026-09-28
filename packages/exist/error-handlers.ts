import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ExistAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ExistAPIError) return error.status;
	if (error instanceof ApiError) return error.status;
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ExistAPIError) return error.retryAfter;
	if (error instanceof ApiError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	/**
	 * Exist allows 300 requests per hour per user token and answers an exceeded
	 * quota with a bodiless 429.
	 * @see https://developer.exist.io/guide/
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (statusOf(error) === 429) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('too many requests') ||
				message.includes('rate limit') ||
				message.includes('429')
			);
		},
		handler: async (error) => ({
			maxRetries: 0,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},
	/** An expired or revoked access token. Retrying without re-auth cannot help. */
	AUTH_ERROR: {
		match: (error) => {
			if (statusOf(error) === 401) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid_token') ||
				message.includes('authentication credentials were not provided')
			);
		},
		handler: async (_error, context) => {
			console.warn(
				`[EXIST:${context.operation}] Authentication failed - the access token is missing, expired or revoked`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Usually a missing OAuth2 scope, or writing to an attribute this client
	 * does not own.
	 * @see https://developer.exist.io/reference/authentication/oauth2/
	 */
	PERMISSION_ERROR: {
		match: (error) => {
			if (statusOf(error) === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('forbidden') ||
				message.includes('permission') ||
				message.includes('unauthorised')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[EXIST:${context.operation}] Permission denied - check the granted OAuth2 scopes and attribute ownership: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (statusOf(error) === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[EXIST:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[EXIST:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
