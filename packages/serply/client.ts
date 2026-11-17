import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const SERPLY_API_BASE = 'https://api.serply.io';

/** Optional Serply request headers: proxy region and device type. */
export type SerplyHeaders = {
	proxyLocation?: string;
	device?: string;
};

/**
 * One Serply call. The key goes in `X-Api-Key`; `X-Proxy-Location` and
 * `X-User-Agent` pick the region and device Google sees. Errors are
 * `{ detail }` bodies, which core puts in the ApiError message; core retries
 * a 429. https://serply.io/docs/guides/authentication
 */
export async function serplyRequest<T>(
	apiKey: string,
	url: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
		// unknown: the JSON body of POST /v1/request, validated by its schema.
		body?: Record<string, unknown>;
		headers?: SerplyHeaders;
	} = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: SERPLY_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Api-Key': apiKey,
			...(options.headers?.proxyLocation
				? { 'X-Proxy-Location': options.headers.proxyLocation }
				: {}),
			...(options.headers?.device
				? { 'X-User-Agent': options.headers.device }
				: {}),
		},
	};
	const query = options.query
		? Object.fromEntries(
				Object.entries(options.query)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => [key, String(value)]),
			)
		: undefined;
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url,
		query,
		...(options.body
			? { body: options.body, mediaType: 'application/json' }
			: {}),
	};
	return await request<T>(config, requestOptions);
}

export async function serplyGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | undefined>,
): Promise<T> {
	return serplyRequest<T>(apiKey, url, { query });
}
