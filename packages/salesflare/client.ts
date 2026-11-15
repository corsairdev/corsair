import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SalesflareAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'SalesflareAPIError';
	}
}

const SALESFLARE_API_BASE = 'https://api.salesflare.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Single retry owner: the plugin error handler owns the 429 retry policy,
	// so the transport stays single-attempt (maxRetries 0). Keeping enabled
	// true makes the shared transport read the Retry-After/reset headers and
	// attach them to the thrown error without ever retrying on its own.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeSalesflareRequest<T>(
	ctx: { key: string },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Salesflare request bodies differ by operation and are validated by the
		// corresponding endpoint schema before reaching this transport boundary.
		// unknown: the endpoint schemas validate each provider-specific body.
		body?: Record<string, unknown>;
		// unknown: Salesflare documents multi-valued (repeated-key) query
		// filters, so arrays of each scalar kind are part of the contract.
		query?: Record<
			string,
			string | string[] | number | number[] | boolean | boolean[] | undefined
		>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: SALESFLARE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: ctx.key,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${ctx.key}`,
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
		// Documented query parameters apply to writes as well (e.g.
		// update_if_exists on POST /accounts, force on contact writes); the
		// shared transport serializes them into the URL for every method.
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new SalesflareAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new SalesflareAPIError(error.message);
		}
		throw new SalesflareAPIError('Unknown Salesflare API error');
	}
}
