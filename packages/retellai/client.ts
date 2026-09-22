import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const RETELL_API_BASE = 'https://api.retellai.com';

export class RetellAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'RetellAPIError';
	}
}

export async function makeRetellRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
		body?: Record<string, unknown>;
	} = { method: 'GET' },
): Promise<T> {
	const method = options.method ?? 'GET';
	const config: OpenAPIConfig = {
		BASE: RETELL_API_BASE,
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
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: method === 'POST' || method === 'PATCH' ? options.body : undefined,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) throw new RetellAPIError(error.message);
		throw new RetellAPIError('Unknown Retell API error');
	}
}
