import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const DAFFY_API_BASE = 'https://public.daffy.org/v1';

export type DaffyRequestOptions = {
	method?: 'GET' | 'POST';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | undefined>;
};

export async function makeDaffyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: DaffyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: DAFFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'X-Api-Key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
		query,
	};
	return await request<T>(config, requestOptions);
}
