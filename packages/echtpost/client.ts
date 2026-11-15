import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const ECHTPOST_API_BASE = 'https://api.echtpost.de/v2';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function echtpostGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: ECHTPOST_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Api-Key': apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url, query };
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
