import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class UploadcareAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'UploadcareAPIError';
	}
}

// TODO: Update with your API base URL
const UPLOADCARE_API_BASE = 'https://api.uploadcare.com';

export async function makeUploadcareRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const authHeader = apiKey.startsWith('Uploadcare.Simple ')
		? apiKey
		: `Uploadcare.Simple ${apiKey}`;

	const config: OpenAPIConfig = {
		BASE: UPLOADCARE_API_BASE,
		VERSION: '0.7.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/vnd.uploadcare-v0.7+json',
			Authorization: authHeader,
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
			throw new UploadcareAPIError(error.message);
		}
		throw new UploadcareAPIError('Unknown error');
	}
}
