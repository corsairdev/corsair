import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FilloutFormsAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'FilloutFormsAPIError';
	}
}

export const FILLOUT_API_BASE = 'https://api.fillout.com/v1/api';
export const ZITE_API_BASE = 'https://tables.zite.com/api/v1';
export const FILLOUT_AUTH_URL = 'https://build.fillout.com/authorize/oauth';
export const FILLOUT_TOKEN_URL =
	'https://server.fillout.com/public/oauth/accessToken';
export const FILLOUT_INVALIDATE_URL =
	'https://server.fillout.com/public/oauth/invalidate';

export async function makeFilloutRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl = FILLOUT_API_BASE } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new FilloutFormsAPIError(error.message);
		}
		throw new FilloutFormsAPIError('Unknown error');
	}
}
