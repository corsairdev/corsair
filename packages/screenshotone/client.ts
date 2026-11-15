import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const SCREENSHOTONE_API_BASE = 'https://api.screenshotone.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export async function screenshotoneRequest<T>(
	apiKey: string | undefined,
	method: 'GET' | 'POST',
	url: string,
	query?: Record<string, string | number | boolean | undefined>,
	body?: unknown,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: SCREENSHOTONE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url,
		query: { ...query, access_key: apiKey ?? '' },
		body,
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

/** Drop access_key if a returned URL copied the request query. */
export function withoutAccessKey(value: string): string | undefined {
	try {
		const url = new URL(value);
		url.searchParams.delete('access_key');
		return url.toString();
	} catch {
		if (value.toLowerCase().includes('access_key')) return undefined;
		return value;
	}
}
