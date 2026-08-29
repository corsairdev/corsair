import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Wraps a DynaPictures API failure while surfacing the transport status and retry information. */
export class DynapicturesAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: string | number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'DynapicturesAPIError';

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

export const DYNAPICTURES_API_BASE = 'https://api.dynapictures.com';

/** Performs a request against the canonical DynaPictures API host using bearer-token auth. */
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

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DynapicturesAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new DynapicturesAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new DynapicturesAPIError('Unknown error');
	}
}
