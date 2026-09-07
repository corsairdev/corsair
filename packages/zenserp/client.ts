import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const ZENSERP_API_BASE = 'https://app.zenserp.com';

export type ZenserpQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export async function makeZenserpRequest<T>(
	endpoint: string,
	apiKey: string,
	query: ZenserpQuery = {},
): Promise<T> {
	if (!apiKey.trim()) throw new Error('Zenserp API key is required');

	const config: OpenAPIConfig = {
		BASE: ZENSERP_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json', apikey: apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query,
	};
	return await request<T>(config, requestOptions);
}
