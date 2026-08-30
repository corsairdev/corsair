import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Custom error class representing API failures from the Dynapictures REST API.
 * Preserves HTTP status codes, status text, response body, and rate limit retry-after metadata.
 */
export class DynapicturesAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'DynapicturesAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/** Base URL for the official Dynapictures REST API */
export const DYNAPICTURES_API_BASE = 'https://api.dynapictures.com';

/**
 * Executes an HTTP request against the Dynapictures REST API using the configured Bearer token authentication.
 *
 * @template T - Expected response type
 * @param endpoint - Relative API endpoint path (e.g. 'designs/template123')
 * @param apiKey - Dynapictures API key for Bearer authentication
 * @param options - Request options including HTTP method, JSON body, and URL query parameters
 * @returns Parsed response body payload
 * @throws {DynapicturesAPIError} When the API returns a non-2xx response or network error
 */
export async function makeDynapicturesRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: DYNAPICTURES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

	const requestOptions: ApiRequestOptions = {
		method,
		url,
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
		if (error instanceof ApiError) {
			throw new DynapicturesAPIError(error.message, undefined, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new DynapicturesAPIError(error.message);
		}
		throw new DynapicturesAPIError('Unknown error');
	}
}
