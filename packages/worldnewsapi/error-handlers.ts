import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { WorldNewsApiError } from './client';

function statusOf(error: unknown): number | undefined {
	if (error instanceof ApiError || error instanceof WorldNewsApiError) {
		return error.status;
	}
	return undefined;
}

function messageOf(error: unknown): string {
	return error instanceof Error ? error.message.toLowerCase() : '';
}

function retryAfterOf(error: unknown): number | undefined {
	return error instanceof ApiError ? error.retryAfter : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: unknown, _context?: unknown) => {
			if (statusOf(error) === 429) return true;
			const message = messageOf(error);
			return (
				message.includes('rate_limit') ||
				message.includes('ratelimit') ||
				message.includes('429') ||
				message.includes('too many requests')
			);
		},
		handler: async (error: unknown, _context?: unknown) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},

	QUOTA_ERROR: {
		match: (error: unknown, _context?: unknown) => {
			if (statusOf(error) === 402) return true;
			const message = messageOf(error);
			return (
				message.includes('quota exceeded') ||
				message.includes('payment required')
			);
		},
		handler: async (_error?: unknown, _context?: unknown) => ({
			maxRetries: 0,
		}),
	},

	AUTH_ERROR: {
		match: (error: unknown, _context?: unknown) => {
			if (statusOf(error) === 401) return true;
			const message = messageOf(error);
			return (
				message.includes('unauthorized') ||
				message.includes('invalid api key') ||
				message.includes('auth_missing') ||
				message.includes('authentication failed')
			);
		},
		handler: async (_error?: unknown, _context?: unknown) => ({
			maxRetries: 0,
		}),
	},

	PERMISSION_ERROR: {
		match: (error: unknown, _context?: unknown) => {
			if (statusOf(error) === 403) return true;
			const message = messageOf(error);
			return (
				message.includes('forbidden') ||
				message.includes('access denied') ||
				message.includes('insufficient_permissions')
			);
		},
		handler: async (_error?: unknown, _context?: unknown) => ({
			maxRetries: 0,
		}),
	},

	NOT_FOUND_ERROR: {
		match: (error: unknown, _context?: unknown) => {
			if (statusOf(error) === 404) return true;
			const message = messageOf(error);
			return message.includes('not found') || message.includes('404');
		},
		handler: async (_error?: unknown, _context?: unknown) => ({
			maxRetries: 0,
		}),
	},

	BAD_REQUEST_ERROR: {
		match: (error: unknown, _context?: unknown) => {
			if (statusOf(error) === 400) return true;
			const message = messageOf(error);
			return (
				message.includes('bad request') ||
				message.includes('invalid_url') ||
				message.includes('malformed_url') ||
				message.includes('invalid_protocol') ||
				message.includes('ssrf_protected')
			);
		},
		handler: async (_error?: unknown, _context?: unknown) => ({
			maxRetries: 0,
		}),
	},

	DEFAULT: {
		match: (_error?: unknown, _context?: unknown) => true,
		handler: async (_error?: unknown, _context?: unknown) => ({
			maxRetries: 0,
		}),
	},
} satisfies CorsairErrorHandler;
