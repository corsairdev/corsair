import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const NEURONWRITER_API_BASE = 'https://app.neuronwriter.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export async function neuronwriterPost<T>(
	apiKey: string | undefined,
	url: string,
	body: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: NEURONWRITER_API_BASE,
		VERSION: '0.5',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-API-KEY': apiKey ?? '',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		body,
		mediaType: 'application/json',
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
