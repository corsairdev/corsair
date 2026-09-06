import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class EverhourAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'EverhourAPIError';
	}
}

const EVERHOUR_API_BASE = 'https://api.everhour.com';

export async function makeEverhourRequest<T>(
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
		BASE: EVERHOUR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Api-Key': apiKey,
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
	} catch (error: any) {
		if (error instanceof ApiError) {
			throw new EverhourAPIError(error.message, error.status, error.body);
		}
		if (error instanceof Error) {
			throw new EverhourAPIError(error.message);
		}
		throw new EverhourAPIError('Unknown error');
	}
}
