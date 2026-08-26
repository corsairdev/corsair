import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Official v2 base. Auth is `Authorization: Bearer <api key>`.
 *
 * @see https://docs.browse.ai/api/
 */
export const BROWSEAI_API_BASE = 'https://api.browse.ai/v2';

const BROWSEAI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type BrowseaiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown>;
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

export async function makeBrowseaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BrowseaiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	return await request<T>(buildConfig(apiKey), requestOptions, {
		rateLimitConfig: BROWSEAI_RATE_LIMIT_CONFIG,
	});
}

export { BROWSEAI_RATE_LIMIT_CONFIG };
