import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DiffbotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'DiffbotAPIError';
	}
}

// Diffbot API v3 base URL (extract/search)
const DIFFBOT_API_BASE = 'https://api.diffbot.com/v3';

// Diffbot Knowledge Graph base URL (DQL)
const DIFFBOT_KG_BASE = 'https://kg.diffbot.com/kg/v3';

/**
 * Make a request to the Diffbot API.
 *
 * Diffbot authenticates via `?token=<api-key>` as a query parameter —
 * NOT via an Authorization header. The token is injected automatically here.
 *
 * @param endpoint - The API endpoint path (e.g. 'analyze', 'dql')
 * @param token - The Diffbot API key
 * @param options - Request options including method, body, query params
 * @param useKgBase - If true, routes request to the Knowledge Graph host (kg.diffbot.com)
 */
export async function makeDiffbotRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		useKgBase?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, useKgBase = false } = options;

	const config: OpenAPIConfig = {
		BASE: useKgBase ? DIFFBOT_KG_BASE : DIFFBOT_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	// Diffbot auth: token is a query parameter, not a header
	const queryWithToken: Record<string, string | number | boolean | undefined> =
		{
			token,
			...query,
		};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query: queryWithToken,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new DiffbotAPIError(error.message);
		}
		throw new DiffbotAPIError('Unknown error occurred');
	}
}
