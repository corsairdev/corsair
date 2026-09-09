import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const CODY_API_BASE = 'https://sourcegraph.com';

export type CodyAuthScheme = 'token' | 'Bearer';

export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, string | number | boolean] =>
				entry[1] !== undefined,
		),
	);
}

export async function makeCodyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		authScheme?: CodyAuthScheme;
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', authScheme = 'token', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CODY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `${authScheme} ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: 'application/json; charset=utf-8',
		query: query ? compactQuery(query) : undefined,
	};

	return await request<T>(config, requestOptions);
}
