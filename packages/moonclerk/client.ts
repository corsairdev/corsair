import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export async function makeMoonClerkRequest<T>(
	path: string,
	key: string,
	query?: Record<string, string | number | undefined>,
): Promise<T> {
	if (!key?.trim()) throw new AuthMissingError('moonclerk', 'api_key');
	const config: OpenAPIConfig = {
		BASE: 'https://api.moonclerk.com',
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Token token=${key}`,
			Accept: 'application/vnd.moonclerk+json;version=1',
		},
	};
	const options: ApiRequestOptions = { method: 'GET', url: path, query };
	return request<T>(config, options);
}
