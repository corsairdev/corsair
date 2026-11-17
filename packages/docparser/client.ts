import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const DOCPARSER_API_BASE = 'https://api.docparser.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export async function docparserGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: Record<string, string | number | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: DOCPARSER_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${btoa(`${apiKey ?? ''}:`)}`,
		},
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url, query };
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: undefined;
}
