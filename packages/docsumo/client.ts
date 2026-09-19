import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DocsumoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DocsumoAPIError';
	}
}

export const DOCSUMO_API_BASE = 'https://app.docsumo.com';

type QueryValue = string | number | boolean | undefined;

export async function makeDocsumoRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, QueryValue | string[]>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (!apiKey) {
		throw new DocsumoAPIError('Docsumo API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: DOCSUMO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			apikey: apiKey,
		},
	};

	const definedQuery = query
		? Object.fromEntries(
				Object.entries(query).filter(([, value]) => value !== undefined),
			)
		: undefined;

	const sendsBody =
		method === 'POST' ||
		method === 'PUT' ||
		method === 'PATCH' ||
		method === 'DELETE';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: sendsBody && body !== undefined ? body : sendsBody ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query:
			definedQuery && Object.keys(definedQuery).length > 0
				? definedQuery
				: undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new DocsumoAPIError(error.message);
		}
		throw new DocsumoAPIError('Unknown Docsumo API error');
	}
}
