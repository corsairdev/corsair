import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	ENGINEMAILER_RATE_LIMIT_CONFIG,
	toEnginemailerAPIError,
} from './client';

export const ENGINEMAILER_N8N_API_BASE =
	'https://connect.enginemailer.com/api/N8N/v1';

export async function makeEnginemailerN8nRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		// The N8N API is documented only by Enginemailer's official n8n node, which
		// publishes no body schema; each operation's zod input schema shapes it.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const config: OpenAPIConfig = {
		BASE: ENGINEMAILER_N8N_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			APIKEY: apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		query: method === 'GET' ? query : undefined,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: ENGINEMAILER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw toEnginemailerAPIError(error);
		throw error;
	}
}
