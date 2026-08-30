import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export async function makeAgilityCmsRequest<T>(
	instanceGuid: string,
	apiKey: string,
	apiType: 'fetch' | 'preview' = 'fetch',
	endpoint: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
		body?: Record<string, unknown>;
		apiBaseUrl?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		query,
		body,
		apiBaseUrl = 'https://api.aglty.io',
	} = options;

	const config: OpenAPIConfig = {
		BASE: `${apiBaseUrl.replace(/\/$/, '')}/${instanceGuid}/${apiType}`,
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
