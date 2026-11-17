import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const EMAILABLE_API_BASE = 'https://api.emailable.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

function config(): OpenAPIConfig {
	return {
		BASE: EMAILABLE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
}

export async function emailableGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: Record<string, string | undefined>,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url,
		query: { ...query, api_key: apiKey ?? '' },
	};
	return await request<T>(config(), requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export async function emailablePost<T>(
	apiKey: string | undefined,
	url: string,
	body: Record<string, unknown>,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		body: { ...body, api_key: apiKey ?? '' },
		mediaType: 'application/json',
	};
	return await request<T>(config(), requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: undefined;
}
