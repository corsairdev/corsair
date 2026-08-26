import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const COLLEGE_FOOTBALL_DATA_API_BASE = 'https://api.collegefootballdata.com';

/**
 * The provider documents no published rate-limit numbers for the free
 * tier (not stated on collegefootballdata.com/key or the OpenAPI
 * document), so the retry loop reacts to a 429 when it arrives.
 */
const COLLEGE_FOOTBALL_DATA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type CollegeFootballDataRequestOptions = {
	method?: 'GET';
	query?: Record<string, string | number | boolean | string[] | undefined>;
};

/**
 * Issues a College Football Data request with Bearer auth and rate-limit
 * retries.
 *
 * Every operation in this catalog is a GET against the single
 * `api.collegefootballdata.com` host, confirmed from the provider's
 * official OpenAPI 3.0.0 document (`api-docs.json`, version 5.24.0) -
 * `securitySchemes.apiKey` declares `{ type: "http", scheme: "bearer" }`,
 * so the key travels as `Authorization: Bearer {key}`, not a custom
 * header. A separate GraphQL endpoint exists at
 * `graphqldocs.collegefootballdata.com` but nothing in this 56-op catalog
 * uses it.
 */
export async function makeCollegeFootballDataRequest<T>(
	path: string,
	apiKey: string,
	options: CollegeFootballDataRequestOptions = {},
): Promise<T> {
	const { method = 'GET', query } = options;

	const config: OpenAPIConfig = {
		BASE: COLLEGE_FOOTBALL_DATA_API_BASE,
		VERSION: '5.24.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: COLLEGE_FOOTBALL_DATA_RATE_LIMIT_CONFIG,
	});
}
