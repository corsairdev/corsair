import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const PARSEHUB_API_BASE = 'https://www.parsehub.com';

export type ParsehubRequest = {
	method?: 'GET' | 'POST' | 'DELETE';
	/** Path after `/api/v2`, with every path value already encoded. */
	path: string;
	query?: Record<string, string | number | undefined>;
	/** Form fields for a POST. ParseHub takes POST bodies form-encoded only. */
	form?: Record<string, string | undefined>;
};

/** Encode one path value so tokens cannot add path segments. */
export function pathPart(value: string): string {
	return encodeURIComponent(value);
}

/**
 * ParseHub takes the key as `api_key`: in the query string for GET and
 * DELETE, in the form body for POST. Core's `request()` keeps its default
 * 429 retries (it honours Retry-After).
 */
export async function makeParsehubRequest<T>(
	apiKey: string,
	req: ParsehubRequest,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: PARSEHUB_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const method = req.method ?? 'GET';
	const requestOptions: ApiRequestOptions =
		method === 'POST'
			? {
					method,
					url: `/api/v2${req.path}`,
					query: req.query,
					body: new URLSearchParams(
						Object.entries({ api_key: apiKey, ...req.form }).filter(
							(entry): entry is [string, string] => entry[1] !== undefined,
						),
					).toString(),
					mediaType: 'application/x-www-form-urlencoded; charset=utf-8',
				}
			: {
					method,
					url: `/api/v2${req.path}`,
					query: { api_key: apiKey, ...req.query },
				};

	return await request<T>(config, requestOptions);
}
