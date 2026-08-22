import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Custom error class representing API errors specific to Anonyflow integration.
 */
export class AnonyflowAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AnonyflowAPIError';
	}
}

const ANONYFLOW_API_BASE = 'https://api.anonyflow.com';

/**
 * Dispatches an HTTP request to the Anonyflow API, handling header-based
 * x-api-key authentication and wrapping generic errors.
 *
 * @template T The expected response payload type.
 * @param endpoint The API endpoint path (e.g. '/anony-value').
 * @param apiKey The secret API key used in x-api-key authentication.
 * @param options Configurable options for the request including method, query, and body.
 * @returns A promise resolving to the API response.
 * @throws {ApiError} Rethrows standard Corsair ApiError instances.
 * @throws {AnonyflowAPIError} For other unexpected standard errors.
 */
export async function makeAnonyflowRequest<T>(
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
		BASE: ANONYFLOW_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new AnonyflowAPIError(error.message);
		}
		throw new AnonyflowAPIError('Unknown error');
	}
}
