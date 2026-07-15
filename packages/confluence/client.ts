import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const CONFLUENCE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeConfluenceRequest<T>(
	endpoint: string,
	apiKey: string,
	cloudUrl: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		/**
		 * When 'oauth_2', the Authorization header uses Bearer scheme.
		 * Otherwise (api_key or static key), Basic auth is used.
		 */
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, authType } = options;

	const authorization =
		authType === 'oauth_2'
			? `Bearer ${apiKey}`
			: `Basic ${Buffer.from(apiKey).toString('base64')}`;

	const config: OpenAPIConfig = {
		BASE: `${cloudUrl}/wiki/rest/api`,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: authorization,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: CONFLUENCE_RATE_LIMIT_CONFIG,
	});
}
