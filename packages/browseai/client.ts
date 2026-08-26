import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import type { z } from 'zod';

/**
 * Official v2 base. Auth is `Authorization: Bearer <api key>`.
 *
 * @see https://docs.browse.ai/api/
 */
export const BROWSEAI_API_BASE = 'https://api.browse.ai/v2';

export const BROWSEAI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

const BROWSEAI_NO_RETRY: RateLimitConfig = {
	...BROWSEAI_RATE_LIMIT_CONFIG,
	enabled: false,
	maxRetries: 0,
};

export type BrowseaiRequestOptions<T> = {
	schema: z.ZodType<T>;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, string | number | boolean | object>;
	query?: Record<string, string | number | boolean | undefined>;
};

function buildConfig(apiKey: string): OpenAPIConfig {
	return {
		BASE: BROWSEAI_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};
}

function retryConfigFor(
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
): RateLimitConfig {
	// POST/PATCH/PUT create tasks, monitors, bulk runs, and webhooks.
	// Retrying those on 429 would duplicate work. GET and DELETE are safe.
	if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
		return BROWSEAI_NO_RETRY;
	}
	return BROWSEAI_RATE_LIMIT_CONFIG;
}

export async function makeBrowseaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BrowseaiRequestOptions<T>,
): Promise<T> {
	const { schema, method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	const raw = await request(buildConfig(apiKey), requestOptions, {
		rateLimitConfig: retryConfigFor(method),
	});
	return schema.parse(raw);
}
