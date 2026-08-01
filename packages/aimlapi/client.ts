import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AimlApiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'AimlApiAPIError';
	}
}

const AIMLAPI_API_BASE = 'https://api.aimlapi.com';

export async function makeAimlApiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: AIMLAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	// Normalize endpoint: add /v1 prefix if not already versioned
	const normalizedEndpoint = /^\/v\d+\//.test(endpoint)
		? endpoint
		: `/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

	const requestOptions: ApiRequestOptions = {
		method,
		url: normalizedEndpoint,
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
			throw new AimlApiAPIError(error.message);
		}
		throw new AimlApiAPIError('Unknown error');
	}
}
