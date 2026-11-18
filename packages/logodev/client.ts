import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Every operation goes to the Logo.dev API with the secret key (`sk_`) as a
 * Bearer token. The image CDN (img.logo.dev) takes only the publishable key and
 * answers 401 to a secret key, so this plugin does not call it.
 * https://www.logo.dev/docs/platform/api-keys
 */
export const LOGODEV_API_BASE = 'https://api.logo.dev';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type LogoDevQuery = Record<
	string,
	string | number | boolean | undefined
>;

export async function logoDevRequest<T>(
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		path: string;
		query?: LogoDevQuery;
		// `unknown` values: a JSON body built by an endpoint from its parsed zod input.
		body?: Record<string, unknown>;
	},
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
		method: options.method ?? 'GET',
		url: options.path,
		query: options.query,
		...(options.body
			? { body: options.body, mediaType: 'application/json' }
			: {}),
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export async function searchLogoDev<T>(
	apiKey: string,
	query: { q: string; method?: string; limit?: number },
): Promise<T> {
	return await logoDevRequest<T>(apiKey, {
		path: '/v2/search',
		query: { q: query.q, method: query.method, limit: query.limit },
	});
}
