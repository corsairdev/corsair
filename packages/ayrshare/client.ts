import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AyrshareAPIError extends Error {
	constructor(message: string, public readonly status?: number) {
		super(message);
		this.name = 'AyrshareAPIError';
	}
}

const AYRSHARE_API_BASE = 'https://api.ayrshare.com/api';

export async function makeAyrshareRequest<T>(
	endpoint: string,
	apiKey: string,
	profileKey: string | undefined,
	options: {
		method?: 'GET' | 'POST' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const config: OpenAPIConfig = {
		BASE: AYRSHARE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...(profileKey ? { 'Profile-Key': profileKey } : {}),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: method === 'POST' || method === 'DELETE' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AyrshareAPIError(error.message, error.status);
		}
		throw new AyrshareAPIError(
			error instanceof Error ? error.message : 'Unknown Ayrshare API error',
		);
	}
}
