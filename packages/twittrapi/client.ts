import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TwittrApiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TwittrApiAPIError';
	}
}

const TWITTRAPI_API_BASE = 'https://api.twittrapi.com';

export async function makeTwittrApiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Record<string, unknown>: each endpoint assembles its own JSON body
		// shape, so no single static type fits; stricter typing is not
		// feasible without a per-endpoint generic that callers don't need.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TWITTRAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-API-KEY': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		// Forwarded for every method: POST /tweet/{id}/favorites needs
		// ?format=simple just like the GET endpoints do.
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError (status, retryAfter, body) so the plugin's
		// status-based error handlers in error-handlers.ts can match.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new TwittrApiAPIError(error.message);
		}
		throw new TwittrApiAPIError('Unknown error');
	}
}
