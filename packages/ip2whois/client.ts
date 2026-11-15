import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const IP2WHOIS_API_BASE = 'https://api.ip2whois.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function makeIp2whoisRequest<T>(
	apiKey: string,
	path: '/v2' | '/hosteddomain',
	query: Record<string, string | number | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: IP2WHOIS_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: {
			key: apiKey,
			format: 'json',
			...query,
		},
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
