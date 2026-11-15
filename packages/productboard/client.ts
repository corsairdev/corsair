import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ProductboardJsonObject } from './endpoints/types';

export class ProductboardAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ProductboardAPIError';
	}
}

export const PRODUCTBOARD_API_BASE = 'https://api.productboard.com/v2';

const PRODUCTBOARD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export async function makeProductboardRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: ProductboardJsonObject;
		query?: ProductboardJsonObject;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	if (apiKey.length === 0) {
		throw new AuthMissingError('productboard', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: PRODUCTBOARD_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: PRODUCTBOARD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Rejection values have no declared type; instanceof narrows core API errors safely.
		// Preserve transport status and rate-limit metadata while dropping the
		// provider body and request payload, which can contain customer feedback,
		// member email addresses, or other workspace data.
		if (error instanceof ApiError) {
			throw new ApiError(
				{ method: requestOptions.method, url: requestOptions.url },
				{
					url: `${PRODUCTBOARD_API_BASE}${requestOptions.url}`,
					ok: false,
					status: error.status,
					statusText: 'Productboard request failed',
					body: {},
				},
				'Productboard request failed',
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		if (error instanceof Error) {
			throw new ProductboardAPIError('Productboard request failed');
		}
		throw new ProductboardAPIError('Productboard request failed');
	}
}
