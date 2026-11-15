import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const SEARCHAPI_BASE = 'https://www.searchapi.io';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export async function searchApiGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: Record<string, string | number | undefined>,
	accept = 'application/json',
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: SEARCHAPI_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: accept },
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url,
		query: { ...query, api_key: apiKey ?? '' },
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
