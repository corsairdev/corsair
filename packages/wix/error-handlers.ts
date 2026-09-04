import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { WixAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof WixAPIError) {
		return error.status;
	}
	if (error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

function retryAfterMs(error: Error): number | undefined {
	if (error instanceof ApiError && typeof error.retryAfter === 'number') {
		return error.retryAfter;
	}
	if (error instanceof WixAPIError) {
		if (
			error.cause instanceof ApiError &&
			typeof error.cause.retryAfter === 'number'
		) {
			return error.cause.retryAfter;
		}
		const body = error.body;
		if (body && typeof body === 'object') {
			const record = body as Record<string, unknown>;
			const raw =
				record.retry_after ?? record.retryAfter ?? record['Retry-After'];
			if (typeof raw === 'number' && Number.isFinite(raw)) {
				return raw > 0 && raw < 1000 ? raw * 1000 : raw;
			}
			if (typeof raw === 'string' && raw.trim() !== '') {
				const asNumber = Number(raw);
				if (Number.isFinite(asNumber)) {
					return asNumber > 0 && asNumber < 1000 ? asNumber * 1000 : asNumber;
				}
			}
		}
	}
	return undefined;
}

function messageIncludes(error: Error, ...fragments: string[]): boolean {
	const message = error.message.toLowerCase();
	return fragments.some((fragment) => message.includes(fragment));
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			return messageIncludes(
				error,
				'rate_limited',
				'ratelimited',
				'rate limit',
				'too many requests',
				'429',
			);
		},
		handler: async (error: Error) => {
			const headersRetryAfterMs = retryAfterMs(error);
			return {
				maxRetries: 5,
				retryStrategy: 'exponential_backoff' as const,
				...(headersRetryAfterMs !== undefined ? { headersRetryAfterMs } : {}),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401) return true;
			return messageIncludes(
				error,
				'unauthorized',
				'invalid_auth',
				'token_revoked',
				'token_expired',
				'not_authed',
				'invalid_token',
			);
		},
		handler: async (error: Error) => {
			console.warn(
				`[WIX] Authentication failed - token may be expired, refresh the OAuth token or check the API key: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			return messageIncludes(
				error,
				'missing_scope',
				'forbidden',
				'permission_denied',
				'insufficient_permissions',
				'access_denied',
			);
		},
		handler: async (error: Error) => {
			console.warn(`[WIX] Permission denied: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			return messageIncludes(error, 'not_found', 'not found', '404');
		},
		handler: async (error: Error) => {
			console.warn(`[WIX] Resource not found: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error: Error) => {
			return messageIncludes(
				error,
				'network',
				'connection',
				'econnrefused',
				'enotfound',
				'etimedout',
				'fetch failed',
				'network error',
			);
		},
		handler: async (error: Error) => {
			console.warn(`[WIX] Network error: ${error.message}`);
			return { maxRetries: 3 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => {
			console.warn(`[WIX] Server error, retrying: ${error.message}`);
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (error: Error) => {
			console.error(`[WIX] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
