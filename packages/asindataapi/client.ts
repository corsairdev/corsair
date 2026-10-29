import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AsinDataApiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AsinDataApiAPIError';

		// Preserve ApiError properties so error handlers can inspect status codes
		// and rate-limit headers without needing instanceof ApiError checks.
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

export const ASINDATAAPI_API_BASE = 'https://api.asindataapi.com';

/**
 * Performs a request to the ASIN Data API.
 *
 * Auth: the API key is supplied as the `api_key` query parameter on every
 * request — both the Product Data API (`GET /request`) and the Collections
 * API (`/collections`, `/destinations`). There is no header-based auth.
 */
export async function makeAsinDataApiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: ASINDATAAPI_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		api_key: apiKey,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: queryWithAuth,
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AsinDataApiAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new AsinDataApiAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new AsinDataApiAPIError('Unknown error');
	}
}
