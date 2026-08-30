import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AutomAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AutomAPIError';
	}
}

const AUTOM_API_BASE = 'https://api.autom.dev';

export async function makeAutomRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (!apiKey.trim()) {
		throw new AutomAPIError('Autom API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: AUTOM_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Unset on purpose: `request()` injects `Authorization: Bearer` when TOKEN
		// is set. Autom authenticates with `x-api-key` only.
		TOKEN: undefined,
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
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new AutomAPIError(error.message);
		}
		throw new AutomAPIError('Unknown error');
	}
}
