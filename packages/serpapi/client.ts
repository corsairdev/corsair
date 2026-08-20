import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Confirmed from the provider's own docs (serpapi.com/search-api) - every
 * operation in this catalog is a GET against a single host, keyed off the
 * `engine` query parameter (`google`, `bing`, `youtube`, `walmart`, ...)
 * rather than distinct per-engine paths.
 */
const SERPAPI_API_BASE = 'https://serpapi.com';

export type SerpapiRequestOptions = {
	method?: 'GET' | 'POST';
	query?: Record<string, string | number | boolean | undefined>;
	timeout?: number;
};

export async function makeSerpapiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SerpapiRequestOptions = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new Error('SerpApi API key is required');
	}

	const { method = 'GET', query, timeout } = options;

	const config: OpenAPIConfig = {
		BASE: SERPAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeout,
		// Left unset deliberately: the shared request layer injects
		// `Authorization: Bearer {TOKEN}` whenever this is set, which would be
		// wrong here - auth travels as an `api_key` query parameter instead
		// (confirmed from the docs: `?api_key=YOUR_API_KEY`, not a header).
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		mediaType: 'application/json; charset=utf-8',
		// `api_key` is merged in here rather than left to each endpoint to
		// remember - every one of this catalog's 48 operations needs it, and
		// a caller-supplied `query.api_key` (there shouldn't be one) would be
		// overwritten, never silently ignored.
		query: { ...query, api_key: apiKey },
	};

	// No try/catch here deliberately: `request()` throws a `corsair/http`
	// `ApiError` (with `.status`/`.retryAfter`) on failure, and
	// `error-handlers.ts`'s matchers depend on that concrete type. Wrapping
	// it in a generic error class here (the generator's original scaffold
	// did this) would strip the status code before any handler ever saw it.
	return await request<T>(config, requestOptions);
}
