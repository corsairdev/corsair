import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const WEBSCRAPING_AI_API_BASE = 'https://api.webscraping.ai';
export type WebScrapingAIQuery = Record<string, unknown>;

export async function makeWebScrapingAIRequest<T>(
	endpoint: string,
	apiKey: string,
	query: WebScrapingAIQuery = {},
): Promise<T> {
	if (!apiKey.trim()) throw new Error('WebScraping.AI API key is required');
	const config: OpenAPIConfig = {
		BASE: WEBSCRAPING_AI_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: { Accept: '*/*' },
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: { ...query, api_key: apiKey },
	};
	return await request<T>(config, requestOptions);
}
