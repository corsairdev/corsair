import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request, ApiError } from 'corsair/http';

export class OnePasswordAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'OnePasswordAPIError';
	}
}

function trimTrailingSlash(url: string): string {
	return url.replace(/\/+$/, '');
}

export async function makeOnePasswordRequest<T>(
	connectUrl: string | undefined,
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Using `unknown` for body values because the 1Password Connect API accepts
		// heterogeneous field shapes (strings, objects, arrays) that vary by item category.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const base = trimTrailingSlash(connectUrl || 'http://localhost:8080');

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
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
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new OnePasswordAPIError(error.message);
		}
		throw new OnePasswordAPIError('Unknown error');
	}
}
