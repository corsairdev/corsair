import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const KLIPFOLIO_API_BASE = 'https://app.klipfolio.com/api/1.0';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Core's transport retries a 429 up to three times and honours
	// Retry-After (Klipfolio allows five requests a second); the plugin's own
	// 429 handler returns maxRetries 0 so the two never stack.
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeKlipfolioRequest<T>(
	ctx: { key: string },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		// unknown: Klipfolio request bodies differ by operation and are
		// validated by the corresponding endpoint schema before this boundary.
		// A raw string body (e.g. datasource instance data uploads) rides
		// through verbatim when the media type is not JSON.
		body?: Record<string, unknown> | string;
		// unknown: Klipfolio documents offset-based list pagination and
		// scoping filters as scalar query parameters; passthrough extras ride
		// along as opaque values.
		query?: Record<string, unknown>;
		// unknown: media type defaults to JSON for every documented
		// operation; raw-content uploads override it per call.
		mediaType?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		mediaType = 'application/json; charset=utf-8',
	} = options;

	const config: OpenAPIConfig = {
		BASE: KLIPFOLIO_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// Klipfolio authenticates with its own API-key header, not a Bearer
			// scheme; the provider's header name is sent unchanged.
			'kf-api-key': ctx.key,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// Klipfolio documents request bodies on DELETE too (e.g. share-right
		// removal takes a `groups` body); only GET stays body-less.
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType,
		// Documented query parameters apply to writes as well; the shared
		// transport serializes them into the URL for every method.
		query,
	};

	// Core's ApiError goes through unchanged: its status and retryAfter are
	// what the error handlers and core's retry logic read, and its body keeps
	// Klipfolio's meta.error_code / meta.error_desc.
	return request<T>(config, requestOptions, {
		rateLimitConfig: RATE_LIMIT_CONFIG,
	});
}
