import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const GIVEBUTTER_API_BASE = 'https://api.givebutter.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	// Core retries a 429 here, honouring Retry-After: the provider refused the request
	// before running it, so a write is safe to resend (PLUGIN_PR_RULES R8/R9).
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

type RequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Endpoint schemas accept provider-specific JSON objects with varying documented fields.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

/** Sends one documented Givebutter REST request. Core's ApiError passes through unchanged. */
export async function makeGivebutterRequest<T>(
	endpoint: string,
	apiKey: string,
	{ method, body, query }: RequestOptions,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: GIVEBUTTER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: body ? 'application/json' : undefined,
		query,
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: RATE_LIMIT_CONFIG,
	});
}
