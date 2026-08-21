import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * The Data Access API base.
 *
 * @see https://docs.bugsnag.com/api/data-access/
 */
const BUGSNAG_API_BASE = 'https://api.bugsnag.com';

/**
 * BugSnag reports its rate-limit budget on **every** successful response, and the
 * budget is **per-endpoint rather than global**. Observed live on 2026-08-14:
 *
 * ```
 * GET /user                          x-ratelimit-limit: 100
 * GET /organizations/{id}/projects   x-ratelimit-limit: 100
 * GET /projects/{id}/errors          x-ratelimit-limit: 30
 * ```
 *
 * That is unusual and worth stating: most providers publish a single documented
 * figure and no headers, so a client can only react to a 429. Here it can pace
 * proactively. Some sources quote a flat 500 requests per minute, which the headers
 * contradict, so nothing in this plugin hard-codes a figure - the headers are the
 * authority and {@link readRateLimit} exposes them.
 *
 * The retry configuration below is the fallback for when a 429 does arrive.
 */
const BUGSNAG_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/** The rate-limit state BugSnag reports on a response. */
export type BugsnagRateLimit = {
	limit?: number;
	remaining?: number;
};

/**
 * Reads the rate-limit headers from a response.
 *
 * Exposed so a caller sweeping many projects can slow down before being throttled
 * rather than after. Returns an empty object rather than throwing when the headers
 * are absent, since not every response carries them.
 */
export function readRateLimit(headers: Headers): BugsnagRateLimit {
	const num = (name: string) => {
		const raw = headers.get(name);
		if (raw === null) return undefined;
		const parsed = Number(raw);
		return Number.isFinite(parsed) ? parsed : undefined;
	};
	return {
		limit: num('x-ratelimit-limit'),
		remaining: num('x-ratelimit-remaining'),
	};
}

export type BugsnagRequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/**
	 * The JSON request body, serialised as given.
	 *
	 * `unknown` values rather than a narrower union because bodies are assembled by
	 * the endpoints from their own already-validated input schemas, and those shapes
	 * vary widely. Validation belongs to the endpoint input schemas in
	 * `endpoints/types.ts`; this type says only "already-checked JSON".
	 */
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
};

/**
 * Issues a BugSnag request with token auth and rate-limit retries.
 *
 * Two details of this API are easy to get wrong and are handled here rather than
 * left to callers:
 *
 * - The scheme is the literal word `token`, **not** `Bearer`.
 * - `X-Version: 2` pins the Data Access API version, so a future default shift
 *   cannot silently change response shapes underneath the plugin.
 */
export async function makeBugsnagRequest<T>(
	endpoint: string,
	authToken: string,
	options: BugsnagRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: BUGSNAG_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `token ${authToken}`,
			'X-Version': '2',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: BUGSNAG_RATE_LIMIT_CONFIG,
	});
}

export { BUGSNAG_API_BASE, BUGSNAG_RATE_LIMIT_CONFIG };
