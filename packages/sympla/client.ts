import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const SYMPLA_API_BASE = 'https://api.sympla.com.br';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function makeSymplaRequest<T>(
	apiKey: string,
	query: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: SYMPLA_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			s_token: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/public/v3/events',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
