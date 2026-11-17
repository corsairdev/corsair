import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const PAPERFORM_API_BASE = 'https://api.paperform.co';

export type PaperformQuery = Record<string, string | number | undefined>;

export async function paperformRequest<T>(
	apiKey: string | undefined,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	url: string,
	// JSON request body; each endpoint builds it from its validated input.
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
	// Core's request() retries a 429 itself, honouring Retry-After.
	return await request<T>(config, requestOptions);
}

export async function paperformGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: PaperformQuery,
): Promise<T> {
	return paperformRequest<T>(apiKey, 'GET', url, { query });
}

// Narrows untyped provider JSON; callers check each field they read.
export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

/** Path segment from caller input, escaped. */
export function seg(value: string | number): string {
	return encodeURIComponent(String(value));
}
