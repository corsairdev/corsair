import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';

export class NotionAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'NotionAPIError';
	}
}

/**
 * API Configuration
 * 
 * AUTH CONFIGURATION:
 * Update the API base URL and authentication headers based on your provider.
 * 
 * Common authentication patterns:
 * - API Key in header: HEADERS: { 'X-API-Key': apiKey }
 * - Bearer token: HEADERS: { 'Authorization': `Bearer ${apiKey}` }
 * - Custom header: HEADERS: { 'X-Custom-Auth': apiKey }
 * 
 * For OAuth 2.0, you might use:
 * - HEADERS: { 'Authorization': `Bearer ${accessToken}` }
 */
const NOTION_API_BASE = 'https://api.notion.com';

/**
 * Makes a request to the Notion API
 * 
 * AUTH CONFIGURATION:
 * The 'apiKey' parameter will contain:
 * - For 'api_key' auth: The API key from keyBuilder
 * - For 'oauth_2' auth: The access token from keyBuilder
 * - For 'bot_token' auth: The bot token from keyBuilder
 * 
 * Update the TOKEN and HEADERS configuration based on how your API expects authentication.
 */
export async function makeNotionRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: NOTION_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`,
			'Notion-Version': '2022-06-28',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error: any) {
		if (error?.body?.message) {
			throw new NotionAPIError(error.body.message, error.body.code);
		}
		if (error instanceof Error) {
			throw new NotionAPIError(error.message);
		}
		throw new NotionAPIError('Unknown error');
	}
}
