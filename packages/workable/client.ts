import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class WorkableAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'WorkableAPIError';
	}
}

/**
 * Workable hosts every account on its own subdomain, so the base URL cannot
 * be a constant. The subdomain is the second half of the credential.
 * @see https://workable.readme.io/reference/generate-an-access-token
 */
export function buildWorkableBaseUrl(subdomain: string): string {
	return `https://${subdomain}.workable.com/spi/v3`;
}

/** Public job-board API - unauthenticated, hosted on www.workable.com rather than the tenant subdomain. */
export const WORKABLE_PUBLIC_API_BASE = 'https://www.workable.com/api';

/**
 * Not publicly documented by Workable; retry generously on 429 and back off.
 * Writes opt out via `retryOnRateLimit: false` in `makeWorkableRequest` -
 * without an idempotency key a replayed write could land twice.
 */
const WORKABLE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/** Rejects missing or hostname-unsafe credentials before any request is issued. */
function assertCredentials(accessToken: string, subdomain: string): void {
	if (!accessToken) {
		throw new WorkableAPIError(
			'An access token is required for the Workable integration',
			'MISSING_ACCESS_TOKEN',
		);
	}
	if (!subdomain) {
		throw new WorkableAPIError(
			'A Workable account subdomain is required - it is the subdomain of your account URL, https://<subdomain>.workable.com',
			'MISSING_ACCOUNT',
		);
	}
	if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) {
		throw new WorkableAPIError(
			'The Workable account subdomain must contain only letters, numbers and hyphens',
			'INVALID_ACCOUNT',
		);
	}
}

/** Builds the authenticated OpenAPI config for a tenant subdomain. */
function buildConfig(accessToken: string, subdomain: string): OpenAPIConfig {
	return {
		BASE: buildWorkableBaseUrl(subdomain),
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	};
}

/**
 * Sends an authenticated SPI v3 request to a tenant subdomain. Pass
 * `retryOnRateLimit: false` for writes - without an idempotency key a
 * replayed create/update could land twice.
 */
export async function makeWorkableRequest<T>(
	endpoint: string,
	accessToken: string,
	subdomain: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		// unknown: generic JSON body — forwarded to the HTTP layer, never inspected.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		retryOnRateLimit?: boolean;
	} = {},
): Promise<T> {
	assertCredentials(accessToken, subdomain);
	const { method = 'GET', body, query, retryOnRateLimit = true } = options;

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

	return await request<T>(buildConfig(accessToken, subdomain), requestOptions, {
		rateLimitConfig: retryOnRateLimit
			? WORKABLE_RATE_LIMIT_CONFIG
			: { ...WORKABLE_RATE_LIMIT_CONFIG, maxRetries: 0 },
	});
}

/**
 * Job-board listing for a given account subdomain. Documented as security-free
 * in Workable's OpenAPI spec - no bearer token is sent or required.
 * @see https://workable.readme.io/reference/jobs-1
 * The `suffix` selects a documented public sub-resource; it is a closed union
 * (not a free string) so callers cannot inject arbitrary paths.
 * @see https://workable.readme.io/reference/apiaccountssubdomainlocations
 */
export async function makeWorkablePublicRequest<T>(
	subdomain: string,
	query?: Record<string, string | number | boolean | undefined>,
	suffix: '' | '/locations' = '',
): Promise<T> {
	if (!subdomain) {
		throw new WorkableAPIError(
			'A Workable account subdomain is required to look up public jobs',
			'MISSING_ACCOUNT',
		);
	}
	if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) {
		throw new WorkableAPIError(
			'The Workable account subdomain must contain only letters, numbers and hyphens',
			'INVALID_ACCOUNT',
		);
	}

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/accounts/${subdomain}${suffix}`,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(
		{
			BASE: WORKABLE_PUBLIC_API_BASE,
			VERSION: 'v1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: undefined,
			HEADERS: { Accept: 'application/json' },
		},
		requestOptions,
		{ rateLimitConfig: WORKABLE_RATE_LIMIT_CONFIG },
	);
}
