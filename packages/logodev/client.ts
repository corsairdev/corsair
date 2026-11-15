import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const LOGODEV_API_BASE = 'https://api.logo.dev';
export const LOGODEV_IMAGE_BASE = 'https://img.logo.dev';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function searchLogoDev<T>(
	apiKey: string,
	query: { q: string; method?: string; limit?: number },
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: LOGODEV_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/v2/search',
		query: {
			q: query.q,
			method: query.method,
			limit: query.limit,
		},
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export async function fetchLogoContentType(
	apiKey: string,
	domain: string,
): Promise<string> {
	const config: OpenAPIConfig = {
		BASE: LOGODEV_IMAGE_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/${domain}`,
		query: { token: apiKey },
		responseHeader: 'content-type',
	};
	const contentType = await request<string>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
	return contentType ?? 'application/octet-stream';
}
