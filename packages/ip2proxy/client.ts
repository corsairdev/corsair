import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const IP2PROXY_API_BASE = 'https://api.ip2proxy.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function makeIp2proxyRequest<T>(
	apiKey: string,
	query: {
		ip?: string;
		package?: string;
		/** Ask for the remaining credit balance instead of a lookup. */
		check?: boolean;
	} = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: IP2PROXY_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/',
		query: query.check
			? { key: apiKey, check: '1' }
			: {
					key: apiKey,
					format: 'json',
					ip: query.ip,
					package: query.package,
				},
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
