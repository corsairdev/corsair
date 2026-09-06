import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SupadataAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SupadataAPIError';
	}
}

const SUPADATA_API_BASE = 'https://api.supadata.ai/v1';

export async function makeSupadataRequest<T>(
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
		BASE: SUPADATA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
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
		if (error instanceof SupadataAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const errorBody = error.body as
				| { error?: string; message?: string; code?: string }
				| undefined;
			const message =
				errorBody?.message ||
				errorBody?.error ||
				error.message ||
				'Supadata API Error';
			const code =
				errorBody?.code || (error.status ? String(error.status) : undefined);
			throw new SupadataAPIError(message, code);
		}
		if (error instanceof Error) {
			throw new SupadataAPIError(error.message);
		}
		throw new SupadataAPIError('Unknown error');
	}
}
