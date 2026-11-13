import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FIREBERRY_API_BASE = 'https://api.fireberry.com';
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export class FireberryAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'FireberryAPIError';
	}
}

export async function makeFireberryRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		metadata?: boolean;
	} = {},
): Promise<T> {
	if (apiKey.length === 0) throw new AuthMissingError('fireberry', 'api_key');
	const { method = 'GET', body, query, metadata = false } = options;
	const config: OpenAPIConfig = {
		BASE: FIREBERRY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: metadata
			? {}
			: { tokenid: apiKey, 'Content-Type': 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: metadata ? { ...query, tokenid: apiKey } : query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Provider errors include CRM request/response data; expose status and retry timing only.
			throw new FireberryAPIError(
				error.message,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) throw new FireberryAPIError(error.message);
		// `unknown` because JavaScript permits throwing non-Error values.
		throw new FireberryAPIError('Fireberry request failed');
	}
}
