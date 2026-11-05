import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CloudflareApiKeyAPIError } from './api-error';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof CloudflareApiKeyAPIError) {
		return error.status;
	}
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof CloudflareApiKeyAPIError) {
		return error.retryAfter;
	}
	return undefined;
}

const IDEMPOTENT_READS = new Set([
	'zones.list',
	'zones.get',
	'dns.list',
	'lockdowns.get',
	'rulesets.get',
	'rulesets.getEntrypointVersion',
	'cache.getRegionalTieredCache',
	'ips.get',
]);

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error: Error, context: ErrorContext) => {
			// Corsair retries by rerunning the whole endpoint. Only GET/list
			// ops are safe to replay; create/update/delete/upload must not.
			if (IDEMPOTENT_READS.has(context.operation)) {
				return { maxRetries: 3 };
			}
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
