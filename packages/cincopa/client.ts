import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CincopaAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'CincopaAPIError';
	}
}

export const CINCOPA_API_BASE = 'https://api.cincopa.com/v2/';

export async function makeCincopaRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiKey || !apiKey.trim()) {
		throw new CincopaAPIError('Cincopa API key is required');
	}

	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CINCOPA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
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
		query: {
			...query,
			api_token: apiKey,
		},
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new CincopaAPIError(error.message);
		}
		throw new CincopaAPIError('Unknown error');
	}
}
