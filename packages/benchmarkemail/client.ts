import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class BenchmarkEmailAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BenchmarkEmailAPIError';
	}
}

/**
 * Base URL of the Benchmark Email classic REST API v3.0. Every account in
 * every region shares this host; the account is resolved server-side from
 * the API token.
 *
 * @see https://developer.benchmarkemail.com/
 */
const BENCHMARKEMAIL_API_BASE = 'https://clientapi.benchmarkemail.com';

/**
 * The classic API allows 500 calls per 2 minutes and 60,000 calls per day,
 * answering 429 once either budget is exceeded. The retry honours the
 * `Retry-After` header the API returns on the 429.
 *
 * @see https://developer.benchmarkemail.com/ ("Limitations")
 */
const BENCHMARKEMAIL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function buildConfig(apiToken: string): OpenAPIConfig {
	return {
		BASE: BENCHMARKEMAIL_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			AuthToken: apiToken,
		},
	};
}

/**
 * Issues a classic REST API v3.0 request. Authentication is the account's
 * Admin API token (found at https://ui.benchmarkemail.com/Integrate#API),
 * passed in the `AuthToken` header - there is no OAuth or bearer scheme.
 *
 * Transport errors surface as `ApiError` (with `status` and `retryAfter`)
 * so the plugin's error handlers can match on them; only a missing
 * credential throws `BenchmarkEmailAPIError` before any request is made.
 *
 * @see https://developer.benchmarkemail.com/
 */
export async function makeBenchmarkEmailRequest<T>(
	endpoint: string,
	apiToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiToken) {
		throw new BenchmarkEmailAPIError(
			'An API token is required for the Benchmark Email integration (Benchmark Email account > Integrate > API)',
			'MISSING_API_TOKEN',
		);
	}
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(buildConfig(apiToken), requestOptions, {
		rateLimitConfig: BENCHMARKEMAIL_RATE_LIMIT_CONFIG,
	});
}
