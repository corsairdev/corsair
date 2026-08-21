import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * API Ninjas serves every endpoint from one host under a version prefix. Most
 * endpoints are v1, a handful were moved to v2, and the recipe endpoint is v3 -
 * so the version travels with the endpoint rather than being fixed here.
 *
 * @see https://api-ninjas.com/api
 */
const API_NINJAS_HOST = 'https://api.api-ninjas.com';

export type ApiNinjasVersion = 'v1' | 'v2' | 'v3';

/**
 * The documented free-tier allowance is 3,000 calls a month and 100 an hour,
 * but responses carry no rate-limit headers at all - not `RateLimit-Limit`, not
 * `RateLimit-Remaining`, not `Retry-After` - so a client cannot pace itself
 * from the response and can only react to a rejection. Neither documented
 * figure is encoded here: 177 calls in one hour during development were never
 * throttled, so hardcoding either number would be guessing.
 *
 * `Retry-After` is still declared, so that a header would be honoured if the
 * provider starts sending one.
 */
const API_NINJAS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Serialises a query value.
 *
 * Booleans and numbers are stringified because the provider matches on the
 * literal text, and arrays are JSON-encoded because the two endpoints that take
 * a structured value - the Sudoku solver's grid - document a JSON array in the
 * query string.
 */
function queryValue(value: unknown): string | undefined {
	if (value === undefined || value === null) return undefined;
	if (Array.isArray(value) || typeof value === 'object') {
		return JSON.stringify(value);
	}
	return String(value);
}

/**
 * Drops unset parameters and stringifies the rest.
 *
 * Every input on this API is a query parameter, and the provider treats an
 * empty string as a supplied-but-blank value rather than as an omission, so
 * `undefined` has to be removed rather than serialised.
 */
export function buildQuery(
	params: Record<string, unknown>,
): Record<string, string> {
	const query: Record<string, string> = {};
	for (const [key, value] of Object.entries(params)) {
		const serialised = queryValue(value);
		if (serialised !== undefined) {
			query[key] = serialised;
		}
	}
	return query;
}

export type ApiNinjasRequestOptions = {
	/** Version prefix the endpoint lives under. Defaults to v1. */
	version?: ApiNinjasVersion;
	method?: 'GET' | 'POST';
	/** Query parameters; unset entries are dropped by {@link buildQuery}. */
	query?: Record<string, unknown>;
	/** JSON body, used by the two NLP endpoints that accept long text. */
	body?: Record<string, unknown>;
	/**
	 * Overrides the `Accept` header. The image endpoints need this: the provider
	 * selects its response format from `Accept` as well as from `format`.
	 */
	accept?: string;
};

/**
 * Issues an API Ninjas request with the account key, rate-limit retries and
 * this plugin's error handlers.
 *
 * The key travels in the `X-Api-Key` header and never in the query string, so
 * it cannot leak into a logged URL or into an `ApiError` message.
 */
export async function makeApiNinjasRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ApiNinjasRequestOptions = {},
): Promise<T> {
	const { version = 'v1', method = 'GET', query, body, accept } = options;

	const config: OpenAPIConfig = {
		BASE: `${API_NINJAS_HOST}/${version}`,
		VERSION: version,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'X-Api-Key': apiKey,
			...(accept ? { Accept: accept } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: query ? buildQuery(query) : undefined,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: API_NINJAS_RATE_LIMIT_CONFIG,
	});
}
