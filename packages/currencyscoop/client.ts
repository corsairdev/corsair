import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const CURRENCYSCOOP_API_BASE = 'https://api.currencybeacon.com/v1';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function currencyGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: CURRENCYSCOOP_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url,
		query: { ...query, api_key: apiKey },
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: undefined;
}
