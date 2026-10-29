import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const CODA_API_BASE = 'https://coda.io/apis/v1';

type QueryValue = string | number | boolean | (string | number)[] | undefined;

export async function makeCodaRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: object;
		query?: Record<string, QueryValue>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CODA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	// Coda takes list query parameters as one comma-separated value (OpenAPI `explode: false`).
	const flatQuery = query
		? Object.fromEntries(
				Object.entries(query).map(([key, value]) => [
					key,
					Array.isArray(value) ? value.join(',') : value,
				]),
			)
		: undefined;

	return request<T>(config, {
		method,
		url: endpoint,
		body,
		mediaType: 'application/json; charset=utf-8',
		query: flatQuery,
	});
}
