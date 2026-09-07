import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const TOKEN_METRICS_API_BASE = 'https://api.tokenmetrics.com/v2';

export async function makeTokenMetricsRequest<T>(
	endpoint: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	if (!apiKey.trim()) throw new Error('Token Metrics API key is required');
	const config: OpenAPIConfig = {
		BASE: TOKEN_METRICS_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json', api_key: apiKey },
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query,
	};
	return await request<T>(config, requestOptions);
}
