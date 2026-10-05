import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class TurbotPipesAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'TurbotPipesAPIError';
	}
}

const TURBOTPIPES_API_BASE = 'https://pipes.turbot.com/api/v1';

/**
 * Performs an HTTP request to the Turbot Pipes API.
 * Auth: Bearer Token in Authorization header (e.g., Bearer tpt_...).
 */
export async function makeTurbotPipesRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const formattedToken =
		apiKey.startsWith('Bearer ') || apiKey.startsWith('api key ')
			? apiKey
			: `Bearer ${apiKey}`;

	const config: OpenAPIConfig = {
		BASE: TURBOTPIPES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: formattedToken,
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
		query: query,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new TurbotPipesAPIError(error.message);
		}
		throw new TurbotPipesAPIError('Unknown Turbot Pipes API error');
	}
}
