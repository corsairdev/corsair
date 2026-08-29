import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const CAML_API_BASE = 'https://api.campaigncleaner.com';

export class CampaignCleanerAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'CampaignCleanerAPIError';
	}
}

type CampaignCleanerRequestOptions = {
	method?: 'GET' | 'POST' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeCampaignCleanerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CampaignCleanerRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CAML_API_BASE,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'X-CC-API-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query: query,
	};

	const response = await request<T>(config, requestOptions);
	return response;
}
