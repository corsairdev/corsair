import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { AgentyAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof AgentyAPIError) {
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
	if (error instanceof AgentyAPIError) {
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
				// HTTP Retry-After is seconds; treat small values as seconds.
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

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => getStatus(error) === 429,
		handler: async (error: Error) => {
			const headersRetryAfterMs = retryAfterMs(error);
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				...(headersRetryAfterMs !== undefined ? { headersRetryAfterMs } : {}),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status === 401 || status === 403;
		},
		handler: async () => {
			console.error(
				'[AGENTY] Authentication failed — check your Agenty API key.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => getStatus(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[AGENTY] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
