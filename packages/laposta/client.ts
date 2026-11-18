import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class LapostaAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string | number,
	) {
		super(message);
		this.name = 'LapostaAPIError';
	}
}

export const LAPOSTA_API_BASE = 'https://api.laposta.nl/v2';

export async function makeLapostaRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because request bodies are endpoint-specific payloads validated by Zod prior to network call.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('laposta', 'api_key');
	}

	// Basic auth: Laposta uses the API key as username with an empty password
	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: LAPOSTA_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...authHeaders,
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
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new LapostaAPIError('Unknown error occurred during Laposta request');
	}
}
