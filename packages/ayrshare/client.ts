import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Official Ayrshare REST host. Every path below is relative to `/api`.
 * Docs: https://www.ayrshare.com/docs/apis/overview
 */
export const AYRSHARE_API_BASE = 'https://api.ayrshare.com/api';

/**
 * 300 requests per 5-minute window per User Profile.
 *
 * Ayrshare answers a 429 with `x-ratelimit-count` / `x-ratelimit-max` and does
 * not document `Retry-After`. 1,000 429s in 24 hours suspends the profile, so
 * this is the only 429 retry layer — the plugin handler must not add another.
 *
 * Docs: https://www.ayrshare.com/docs/errors/errors-http
 */
const AYRSHARE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 2,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'x-ratelimit-max',
	},
};

export type AyrshareQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type AyrshareRequestOptions = {
	method?: 'GET' | 'POST' | 'DELETE';
	body?: Record<string, unknown>;
	query?: AyrshareQuery;
	profileKey?: string;
};

/** Drop undefined values so we don't send `?foo=undefined`. */
export function compactQuery(query: AyrshareQuery): AyrshareQuery {
	const out: AyrshareQuery = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/** Same as {@link compactQuery}, for JSON bodies. */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/**
 * Issues an Ayrshare request with bearer auth and optional Profile-Key.
 *
 * Failures stay as `ApiError` so status, body (`code` / `message`) and
 * rate-limit metadata reach the plugin error handlers. Wrapping them would
 * drop `retryAfter` and skip RATE_LIMIT_ERROR.
 *
 * Auth: `Authorization: Bearer API_KEY`. Business-plan user profiles add
 * `Profile-Key: PROFILE_KEY`.
 * Docs: https://www.ayrshare.com/docs/apis/overview
 */
export async function makeAyrshareRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AyrshareRequestOptions = {},
): Promise<T> {
	if (!apiKey) {
		throw new AuthMissingError('ayrshare', 'api_key');
	}

	const { method = 'GET', body, query, profileKey } = options;
	const hasBody = method === 'POST' || method === 'DELETE';

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiKey}`,
	};
	if (profileKey) {
		headers['Profile-Key'] = profileKey;
	}

	const config: OpenAPIConfig = {
		BASE: AYRSHARE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};

	const compact = query ? compactQuery(query) : undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? 'application/json; charset=utf-8' : undefined,
		query: compact && Object.keys(compact).length > 0 ? compact : undefined,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: AYRSHARE_RATE_LIMIT_CONFIG,
	});
}
