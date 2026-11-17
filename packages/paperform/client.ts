import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const PAPERFORM_API_BASE = 'https://api.paperform.co';

// Core's request() already retries a 429 three times with Retry-After.
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type PaperformQuery = Record<string, string | number | undefined>;

export async function paperformRequest<T>(
	apiKey: string | undefined,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	url: string,
	options: { query?: PaperformQuery; body?: Record<string, unknown> } = {},
): Promise<T> {
	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey ?? ''}`,
	};
	if (options.body) headers['Content-Type'] = 'application/json';
	const config: OpenAPIConfig = {
		BASE: PAPERFORM_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url,
		query: options.query,
		body: options.body,
		mediaType: options.body ? 'application/json' : undefined,
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export async function paperformGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: PaperformQuery,
): Promise<T> {
	return paperformRequest<T>(apiKey, 'GET', url, { query });
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

/** Path segment from caller input, escaped. */
export function seg(value: string | number): string {
	return encodeURIComponent(String(value));
}
