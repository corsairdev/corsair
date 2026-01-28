import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';

export class HubSpotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'HubSpotAPIError';
	}
}

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

export async function makeHubSpotRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: HUBSPOT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
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
		mediaType: 'application/json',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			'status' in error &&
			typeof error.status === 'number'
		) {
			throw new HubSpotAPIError(
				error instanceof Error ? error.message : 'HubSpot API error',
				error.status,
			);
		}
		throw new HubSpotAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}
