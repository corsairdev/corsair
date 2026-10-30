import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AddresszenAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Using unknown because Addresszen API error response bodies vary by endpoint
	// and error code, making a strict type infeasible without per-endpoint handling.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AddresszenAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const ADDRESSZEN_API_BASE = 'https://api.addresszen.com/v1';

/**
 * Performs a request to the Addresszen API.
 *
 * Auth: API key passed via the Authorization header to avoid leaking credentials
 * into URL access logs. Addresszen also supports query-string auth, but header
 * auth is preferred per their API reference.
 */
export async function makeAddresszenRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		/** When false, skip Authorization (public endpoints that identify the key in the path). */
		auth?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query = {}, auth = true } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: ADDRESSZEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(auth ? { Authorization: `api_key="${apiKey}"` } : {}),
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AddresszenAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new AddresszenAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new AddresszenAPIError('Unknown error');
	}
}
