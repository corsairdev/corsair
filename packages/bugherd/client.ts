import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const BUGHERD_API_BASE = 'https://www.bugherd.com/api_v2';

export type BugherdQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * One request to BugHerd API v2. Paths are relative to /api_v2 and end in
 * `.json`, as in BugHerd's OpenAPI reference. Auth is HTTP Basic with the API
 * key as the username and `x` as the password. Core's ApiError passes through
 * unchanged so the error handlers can read its status and Retry-After.
 */
export async function makeBugherdRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		// JSON request body. Values are whatever the endpoint's zod-checked
		// input holds (strings, numbers, booleans, arrays, nested objects).
		body?: Record<string, unknown>;
		// Raw request body (attachment uploads). Core sends a Blob as is, with
		// its type as the Content-Type; a mediaType here would make core
		// JSON-encode a JSON file instead.
		file?: Blob;
		query?: BugherdQuery;
	} = {},
): Promise<T> {
	const { method = 'GET', body, file, query } = options;

	const config: OpenAPIConfig = {
		BASE: BUGHERD_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${btoa(`${apiKey}:x`)}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		...(file
			? { body: file }
			: body
				? { body, mediaType: 'application/json' }
				: {}),
	};

	return request<T>(config, requestOptions);
}

/** Numeric path segment, escaped. */
export function seg(value: number): string {
	return encodeURIComponent(String(value));
}
