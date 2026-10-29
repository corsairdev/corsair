import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Confirmed from the provider's own API docs (nextdns.github.io/api) - the
 * REST API (currently in beta) is served from a single host, distinct from
 * the `my.nextdns.io` dashboard and `nextdns.io` marketing site.
 */
const NEXTDNS_API_BASE = 'https://api.nextdns.io';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Avoid re-submitting writes if the transport layer retries a 429. */
const NEXTDNS_MUTATION_RATE_LIMIT: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export type NextDNSRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// An array body is real here: the provider's array-resource endpoints
	// (denylist/allowlist/TLDs/blocklists/natives/parental-control
	// categories & services) full-replace via `PUT` with a JSON array, not
	// an object - confirmed from the docs and the independent Go client's
	// source.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeNextDNSRequest<T>(
	endpoint: string,
	apiKey: string,
	options: NextDNSRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: NEXTDNS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Left unset deliberately: the shared request layer injects
		// `Authorization: Bearer {TOKEN}` whenever this is set, which would be
		// wrong here - auth travels as `X-Api-Key` instead (set below).
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			// Confirmed from the provider's docs: "Pass your API key via the
			// X-Api-Key header for every call" - not a Bearer token.
			'X-Api-Key': apiKey,
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
		// Not restricted to GET: no operation in this catalog currently
		// combines a body with query params, but silently dropping query on
		// a future non-GET call would be a hard-to-notice bug rather than a
		// visible error.
		query,
	};

	// No try/catch here deliberately: `request()` throws a `corsair/http`
	// `ApiError` (with `.status`/`.retryAfter`) on failure, and
	// `error-handlers.ts`'s matchers depend on that concrete type. Wrapping
	// it in a generic error class here (the generator's original scaffold
	// did this) would strip the status code before any handler ever saw it.
	return await request<T>(
		config,
		requestOptions,
		MUTATION_METHODS.has(method)
			? { rateLimitConfig: NEXTDNS_MUTATION_RATE_LIMIT }
			: undefined,
	);
}
