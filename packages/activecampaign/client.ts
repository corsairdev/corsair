import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class ActiveCampaignAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ActiveCampaignAPIError';
	}
}

/**
 * ActiveCampaign hosts every account on its own subdomain, so the base URL
 * cannot be a constant the way it can for a single-tenant API. The account
 * slug is the second half of the credential and is supplied alongside the key.
 *
 * @see https://developers.activecampaign.com/reference/url
 */
function buildBaseUrl(account: string): string {
	return `https://${account}.api-us1.com/api/3`;
}

/**
 * ActiveCampaign allows 5 requests per second per account, shared across the
 * REST and GraphQL surfaces, and answers 429 once that is exceeded. Unlike
 * many APIs it returns rate-limit headers on successful responses as well as
 * on rejections (`RateLimit-Limit`, `RateLimit-Remaining`), and a
 * `Retry-After` on the 429 itself, which is the header the retry honours.
 *
 * @see https://developers.activecampaign.com/reference/rate-limits
 */
const ACTIVECAMPAIGN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function buildConfig(apiToken: string, account: string): OpenAPIConfig {
	return {
		BASE: buildBaseUrl(account),
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'Api-Token': apiToken,
		},
	};
}

/**
 * Rejects a credential that is missing or that carries characters which cannot
 * appear in a hostname. The account slug is interpolated into the base URL, so
 * validating it here keeps a malformed value from redirecting a request to
 * another host.
 */
function assertCredentials(apiToken: string, account: string): void {
	if (!apiToken) {
		throw new ActiveCampaignAPIError(
			'An API token is required for the ActiveCampaign integration',
			'MISSING_API_TOKEN',
		);
	}
	if (!account) {
		throw new ActiveCampaignAPIError(
			'An account name is required for the ActiveCampaign integration - it is the subdomain of your API URL, https://<account>.api-us1.com',
			'MISSING_ACCOUNT',
		);
	}
	if (!/^[a-zA-Z0-9-]+$/.test(account)) {
		throw new ActiveCampaignAPIError(
			'The ActiveCampaign account name must contain only letters, numbers and hyphens',
			'INVALID_ACCOUNT',
		);
	}
}

/**
 * Issues a v3 REST request with the account's `Api-Token` header, rate-limit
 * retries and this plugin's error handlers.
 */
export async function makeActiveCampaignRequest<T>(
	endpoint: string,
	apiToken: string,
	account: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		/** Most endpoints take an object envelope; the bulk ones take a raw array. */
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	assertCredentials(apiToken, account);
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(buildConfig(apiToken, account), requestOptions, {
		rateLimitConfig: ACTIVECAMPAIGN_RATE_LIMIT_CONFIG,
	});
}

/**
 * Issues an eComm GraphQL request.
 *
 * ActiveCampaign puts its e-commerce catalog behind GraphQL at
 * `/ecom/graphql` rather than extending the REST surface, but on the same host
 * and behind the same `Api-Token` header and the same 5 req/sec budget. Both
 * transports therefore share one config builder and one rate-limit config, so
 * the two surfaces cannot drift apart in auth or throttling behaviour.
 *
 * Used by the e-commerce GraphQL operations in `endpoints/platform.ts`.
 *
 * @see https://developers.activecampaign.com/reference/about-the-graphql-api
 */
export async function makeActiveCampaignGraphQLRequest<T>(
	query: string,
	apiToken: string,
	account: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	assertCredentials(apiToken, account);

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: 'ecom/graphql',
		body: variables ? { query, variables } : { query },
		mediaType: 'application/json; charset=utf-8',
	};

	return await request<T>(buildConfig(apiToken, account), requestOptions, {
		rateLimitConfig: ACTIVECAMPAIGN_RATE_LIMIT_CONFIG,
	});
}
