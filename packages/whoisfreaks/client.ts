import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const WHOISFREAKS_API_BASE = 'https://api.whoisfreaks.com';

// Parse Retry-After onto ApiError; do not retry here.
// The plugin error-handlers own the 429 policy (up to 5 operation retries
// with the server delay). Retrying in the transport too would nest the two
// layers into up to 24 provider calls for one persistently-limited operation.
const WHOISFREAKS_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function makeWhoisfreaksRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown: bulk endpoints accept varying JSON shapes (domainNames, ips, tld, ...).
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: WHOISFREAKS_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
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
		query: {
			apiKey,
			...(query ?? {}),
		},
	};

	// ApiError is intentionally rethrown unchanged so the plugin's
	// error-handlers can match on status (429/401/404) and retryAfter.
	return await request<T>(config, requestOptions, {
		rateLimitConfig: WHOISFREAKS_NO_TRANSPORT_RETRIES,
	});
}
