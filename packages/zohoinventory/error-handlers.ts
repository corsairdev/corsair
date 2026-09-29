import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZohoInventoryAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ZohoInventoryAPIError && error.status !== undefined) {
		return error.status;
	}
	if (error instanceof ApiError) {
		return error.status;
	}
	const status = (error as { status?: unknown }).status;
	return typeof status === 'number' ? status : undefined;
}

function codeOf(error: Error): number | string | undefined {
	if (error instanceof ZohoInventoryAPIError && error.code !== undefined) {
		return error.code;
	}
	const code = (error as { code?: unknown }).code;
	return typeof code === 'number' || typeof code === 'string'
		? code
		: undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const code = codeOf(error);
			if (
				code === 43 ||
				code === '43' ||
				code === 44 ||
				code === '44' ||
				code === 45 ||
				code === '45' ||
				code === 1070 ||
				code === '1070'
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('rate limit') ||
				msg.includes('ratelimit') ||
				msg.includes('throttl') ||
				msg.includes('limit_exceeded') ||
				msg.includes('maximum number of requests')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error instanceof ZohoInventoryAPIError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const code = codeOf(error);
			if (code === 57 || code === '57') return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid_oauthtoken') ||
				msg.includes('invalid oauthtoken') ||
				msg.includes('invalid_token') ||
				msg.includes('unauthorized') ||
				msg.includes('authentication')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[ZOHOINVENTORY:${context.operation}] Authentication failed — check the access/refresh token and OAuth scopes`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 403) return true;
			const code = codeOf(error);
			if (code === 4 || code === '4') return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('access_denied') ||
				msg.includes('not authorized') ||
				msg.includes('insufficient scope') ||
				msg.includes('permission')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[ZOHOINVENTORY:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 404) return true;
			const code = codeOf(error);
			if (code === 1002 || code === '1002' || code === 14 || code === '14') {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('not found') ||
				msg.includes('invalid_organization') ||
				msg.includes('invalid value passed for organization_id') ||
				msg.includes('does not exist')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[ZOHOINVENTORY:${context.operation}] Not found or invalid organization: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: (_error?: Error) => true,
		handler: async (error, context) => {
			console.error(
				`[ZOHOINVENTORY:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
