import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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

export const DROPBOX_SIGN_API_BASE = 'https://api.hellosign.com/v3';

/**
 * Authenticated Dropbox Sign v3 request.
 * Official: https://developers.hellosign.com/api/api-reference-authentication
 * API key uses HTTP Basic with an empty password. OAuth uses Bearer.
 *
 * Do not set OpenAPI `TOKEN` for API-key calls. corsair/http overwrites
 * Authorization with Bearer whenever TOKEN is set.
 */
export async function makeDropboxSignRequest<T>(
	endpoint: string,
	keyOrCtx: string | { key: string; authType?: string },
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, unknown> | FormData;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<T> {
	const apiKey = typeof keyOrCtx === 'string' ? keyOrCtx : keyOrCtx.key;
	const {
		method = 'GET',
		body,
		query,
		headers = {},
		authType = typeof keyOrCtx === 'object' && keyOrCtx.authType === 'oauth_2'
			? 'oauth_2'
			: 'api_key',
	} = options;

	const authHeader =
		authType === 'oauth_2'
			? `Bearer ${apiKey}`
			: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

	const config: OpenAPIConfig = {
		BASE: DROPBOX_SIGN_API_BASE,
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: authHeader,
			...headers,
		},
	};

	const isWrite = method === 'POST' || method === 'PUT';
	const isFormData =
		typeof FormData !== 'undefined' && body instanceof FormData;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: isWrite ? body : undefined,
		mediaType:
			isWrite && !isFormData ? 'application/json; charset=utf-8' : undefined,
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DropboxSignAPIError(error.message, undefined, error.status);
		}
		if (error instanceof Error) {
			throw new DropboxSignAPIError(error.message);
		}
		throw new DropboxSignAPIError('Unknown Dropbox Sign API error');
	}
}
