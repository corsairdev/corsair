import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleCloudVisionAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GoogleCloudVisionAPIError';
	}
}

const GOOGLECLOUDVISION_API_BASE = 'https://vision.googleapis.com/v1';

export async function makeGoogleCloudVisionRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = GOOGLECLOUDVISION_API_BASE,
		authType = 'api_key',
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			...(authType === 'api_key'
				? { 'x-goog-api-key': apiKey }
				: { Authorization: `Bearer ${apiKey}` }),
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new GoogleCloudVisionAPIError(error.message);
		}
		throw new GoogleCloudVisionAPIError('Unknown error');
	}
}
