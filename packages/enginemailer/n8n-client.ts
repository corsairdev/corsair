import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { EnginemailerAPIError } from './client';

export const ENGINEMAILER_N8N_API_BASE =
	'https://connect.enginemailer.com/api/N8N/v1';

export async function makeEnginemailerN8nRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		// Official N8N Swagger publishes no shared response/body schema; endpoint
		// input schemas preserve documented fields before this transport boundary.
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new EnginemailerAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}
