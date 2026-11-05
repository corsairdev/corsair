import type { CorsairErrorHandler } from 'corsair/core';
import type { MarketstackAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<MarketstackAPIError>).status;
}

function getApiCode(error: Error): string | undefined {
	return (error as Partial<MarketstackAPIError>).apiCode;
}

const AUTH_CODES = new Set([
	'invalid_access_key',
	'missing_access_key',
	'inactive_user',
]);

const QUOTA_CODES = new Set(['usage_limit_reached']);

const PLAN_RESTRICTED_CODES = new Set([
	'https_access_restricted',
	'function_access_restricted',
]);

const VALIDATION_CODES = new Set([
	'validation_error',
	'invalid_api_function',
	'404_not_found',
]);

const RATE_LIMIT_CODES = new Set(['rate_limit_reached']);

export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			if (code && AUTH_CODES.has(code)) return true;
			return getStatus(error) === 401;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	QUOTA_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			return code !== undefined && QUOTA_CODES.has(code);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PLAN_RESTRICTED_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			if (code && PLAN_RESTRICTED_CODES.has(code)) return true;
			return getStatus(error) === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			if (code && VALIDATION_CODES.has(code)) return true;
			const status = getStatus(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			if (code && RATE_LIMIT_CODES.has(code)) return true;
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('rate limit') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: (error as Partial<MarketstackAPIError>).retryAfter,
			};
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('500') || msg.includes('internal server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
