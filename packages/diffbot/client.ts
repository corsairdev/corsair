import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class DiffbotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DiffbotAPIError';
	}
}

// Diffbot API v3 base URL
const DIFFBOT_API_BASE = 'https://api.diffbot.com/v3';

/**
 * Make a request to the Diffbot API.
 *
 * Diffbot authenticates via `?token=<api-key>` as a query parameter —
 * NOT via an Authorization header. The token is injected automatically here.
 */
export async function makeDiffbotRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: DIFFBOT_API_BASE,
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
		if (error instanceof Error) {
			throw new DiffbotAPIError(error.message);
		}
		throw new DiffbotAPIError('Unknown error occurred');
	}
}
