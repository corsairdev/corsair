import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class DropboxSignAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'DropboxSignAPIError';
	}
}

const DROPBOX_SIGN_API_BASE = 'https://api.hellosign.com/v3';

/**
 * Dispatches authenticated HTTP requests to the Dropbox Sign API.
 */
export async function makeDropboxSignRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, unknown> | FormData;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers = {},
		authType = 'api_key',
	} = options;

	const authHeader =
		authType === 'oauth_2'
			? 'Bearer ' + apiKey
			: 'Basic ' + Buffer.from(apiKey + ':').toString('base64');

	const config: OpenAPIConfig = {
		BASE: DROPBOX_SIGN_API_BASE,
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: authHeader,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : '/' + endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new DropboxSignAPIError(error.message);
		}
		throw new DropboxSignAPIError('Unknown Dropbox Sign API error');
	}
}
