import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const DOCPARSER_API_BASE = 'https://api.docparser.com';

export type DocparserQuery = Record<
	string,
	string | number | boolean | undefined
>;

export async function docparserRequest<T>(
	apiKey: string | undefined,
	method: 'GET' | 'POST',
	url: string,
	options: {
		query?: DocparserQuery;
		// Sent as multipart/form-data, the encoding Docparser's import routes take.
		formData?: Record<string, string | string[] | undefined>;
	} = {},
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
	const requestOptions: ApiRequestOptions = {
		method,
		url,
		query: options.query,
		formData: options.formData,
	};
	// Core's request() retries a 429 itself, honouring Retry-After.
	return await request<T>(config, requestOptions);
}

export async function docparserGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: DocparserQuery,
): Promise<T> {
	return docparserRequest<T>(apiKey, 'GET', url, { query });
}

// Narrows untyped provider JSON; callers check each field they read.
export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

/** Path segment from caller input, escaped. */
export function seg(value: string): string {
	return encodeURIComponent(value);
}
