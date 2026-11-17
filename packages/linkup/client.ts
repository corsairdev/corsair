import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const LINKUP_API_BASE = 'https://api.linkup.so';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

function config(apiKey: string | undefined): OpenAPIConfig {
	return {
		BASE: LINKUP_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey ?? ''}`,
		},
	};
}

export async function linkupGet<T>(
	apiKey: string | undefined,
	url: string,
): Promise<T> {
	const requestOptions: ApiRequestOptions = { method: 'GET', url };
	return await request<T>(config(apiKey), requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export async function linkupPost<T>(
	apiKey: string | undefined,
	url: string,
	body: Record<string, unknown>,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		body,
		mediaType: 'application/json',
	};
	return await request<T>(config(apiKey), requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: undefined;
}
