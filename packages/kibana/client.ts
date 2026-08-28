import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class KibanaAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'KibanaAPIError';
	}
}

export async function makeKibanaRequest<T>(
	endpoint: string,
	baseUrl: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	if (!baseUrl) {
		throw new KibanaAPIError('Base URL is required', 'MISSING_BASE_URL');
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'kbn-xsrf': 'true', // Required for many Kibana API endpoints
	};

	// Try basic auth if it looks like a base64 string, otherwise default to ApiKey
	// Note: To be safe, users should supply 'Basic <base64>' or 'ApiKey <token>'
	if (
		apiKey.startsWith('Basic ') ||
		apiKey.startsWith('ApiKey ') ||
		apiKey.startsWith('Bearer ')
	) {
		headers.Authorization = apiKey;
	} else {
		// Default to ApiKey if not prefixed
		headers.Authorization = `ApiKey ${apiKey}`;
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl.replace(/\/$/, ''),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: headers,
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
			throw new KibanaAPIError(error.message);
		}
		throw new KibanaAPIError('Unknown error');
	}
}
