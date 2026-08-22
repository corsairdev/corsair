import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const AGILITYCMS_API_BASE = 'https://api.aglty.io';

export async function makeAgilityCmsRequest<T>(
	instanceGuid: string,
	apiKey: string,
	apiType: 'fetch' | 'preview' = 'fetch',
	endpoint: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', query, body } = options;

	const config: OpenAPIConfig = {
		BASE: `${AGILITYCMS_API_BASE}/${instanceGuid}/${apiType}`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			APIKey: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		mediaType: 'application/json',
		query,
		body,
	};

	return await request<T>(config, requestOptions);
}
