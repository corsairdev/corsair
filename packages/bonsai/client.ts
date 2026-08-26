import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class BonsaiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BonsaiAPIError';
	}
}

const BONSAI_API_BASE = 'https://api.bonsai.io';

export async function makeBonsaiRequest<T>(
	endpoint: string,
	credentialsString: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const credentials = JSON.parse(credentialsString) as { apiKey: string; apiSecret: string };

	const config: OpenAPIConfig = {
		BASE: BONSAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		USERNAME: credentials.apiKey,
		PASSWORD: credentials.apiSecret,
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
		if (error instanceof Error) {
			throw new BonsaiAPIError(error.message);
		}
		throw new BonsaiAPIError('Unknown error');
	}
}
