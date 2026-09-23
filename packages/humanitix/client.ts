import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const HUMANITIX_API_BASE = 'https://api.humanitix.com/v1';

export async function makeHumanitixRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('humanitix', 'api_key');
	}

	const { method = 'GET', query } = options;

	const config: OpenAPIConfig = {
		BASE: HUMANITIX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
	};

	return request<T>(config, requestOptions);
}
