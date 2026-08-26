import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BoxheroAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BoxheroAPIError';
	}
}

const BOXHERO_API_BASE = 'https://rest.boxhero-app.com';
type QueryValue =
	| string
	| number
	| boolean
	| Array<string | number | boolean>
	| undefined;

export async function makeBoxheroRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, QueryValue>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (!apiKey.trim()) {
		throw new BoxheroAPIError('BoxHero API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: BOXHERO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The shared request layer converts TOKEN into the required auth header.
		TOKEN: apiKey,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new BoxheroAPIError(error.message);
		}
		throw new BoxheroAPIError('Unknown error');
	}
}
