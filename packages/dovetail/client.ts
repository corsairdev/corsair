import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class DovetailAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'DovetailAPIError';
	}
}

export const DOVETAIL_API_BASE = 'https://dovetail.com/api';

export type DovetailRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Justification: unknown is used here because request payload values can be arbitrary JSON data (e.g. metadata or custom field values)
	body?: Record<string, unknown> | undefined;
	query?: Record<string, string | number | boolean | undefined> | undefined;
};

export async function makeDovetailRequest<T>(
	endpoint: string,
	apiKey: string,
	options: DovetailRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: DOVETAIL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
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

	return request<T>(config, requestOptions);
}
