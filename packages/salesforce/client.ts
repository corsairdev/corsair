import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * REST API version used in `/services/data/vXX.X/…` paths.
 * Docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_discoveryresource.htm
 */
export const SALESFORCE_API_VERSION = '60.0';

/**
 * Login host for OAuth and userinfo. API calls go to the org instance URL,
 * never here.
 * Docs: https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_endpoints.htm
 */
export const SALESFORCE_LOGIN_HOST = 'https://login.salesforce.com';

/**
 * Concurrent API request limit is org-specific; 429 / REQUEST_LIMIT_EXCEEDED
 * carries Retry-After when present.
 * Docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm
 */
const SALESFORCE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export class SalesforceInstanceUrlMissingError extends Error {
	constructor() {
		super(
			'Salesforce requires an instance URL. OAuth token responses include ' +
				'`instance_url`; set `instanceUrl` on the plugin options or store it ' +
				'under the `instance_url` account key.',
		);
		this.name = 'SalesforceInstanceUrlMissingError';
	}
}

export class SalesforceRequestOriginError extends Error {
	constructor() {
		super(
			'Salesforce request URL origin must be HTTPS and match the org instance URL',
		);
		this.name = 'SalesforceRequestOriginError';
	}
}

export type SalesforceRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
	body?: Record<string, unknown> | unknown[] | string;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	instanceUrl?: string;
	responseType?: 'json' | 'text' | 'binary';
	mediaType?: string;
};

type UserInfoUrls = {
	rest?: string;
	enterprise?: string;
	custom_domain?: string;
};

/**
 * Discovers the org instance URL from the OpenID userinfo endpoint.
 * Docs: https://help.salesforce.com/s/articleView?id=sf.remoteaccess_using_userinfo_endpoint.htm
 */
export async function discoverSalesforceInstanceUrl(
	accessToken: string,
	loginHost = SALESFORCE_LOGIN_HOST,
): Promise<string> {
	const config: OpenAPIConfig = {
		BASE: loginHost,
		VERSION: SALESFORCE_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
	};

	const payload = await request<{
		urls?: UserInfoUrls;
	}>(config, { method: 'GET', url: '/services/oauth2/userinfo' });

	const rest = payload?.urls?.rest;
	if (typeof rest === 'string' && rest.startsWith('https://')) {
		return new URL(rest).origin;
	}

	throw new SalesforceInstanceUrlMissingError();
}

function compactQuery(
	query: Record<string, string | number | boolean | undefined> | undefined,
): Record<string, string | number | boolean | undefined> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

function toPath(endpoint: string): string {
	if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
		const parsed = new URL(endpoint);
		return parsed.pathname + parsed.search;
	}
	if (endpoint.startsWith('/')) return endpoint;
	return `/services/data/v${SALESFORCE_API_VERSION}/${endpoint}`;
}

function httpsOrigin(url: string): string {
	const parsed = new URL(url);
	if (parsed.protocol !== 'https:') {
		throw new SalesforceRequestOriginError();
	}
	return parsed.origin;
}

function originOf(endpoint: string, instanceUrl: string): string {
	const instanceOrigin = httpsOrigin(instanceUrl);
	if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
		if (httpsOrigin(endpoint) !== instanceOrigin) {
			throw new SalesforceRequestOriginError();
		}
	}
	return instanceOrigin;
}

async function errorBody(res: Response): Promise<unknown> {
	try {
		return await res.json();
	} catch {
		return await res.text();
	}
}

function retryDelayMs(res: Response, attempt: number): number {
	const retryAfter = res.headers.get(
		SALESFORCE_RATE_LIMIT_CONFIG.headerNames.retryAfter ?? 'Retry-After',
	);
	const seconds = retryAfter ? Number.parseInt(retryAfter, 10) : Number.NaN;
	if (!Number.isNaN(seconds)) return Math.min(seconds * 1000, 60_000);
	return Math.min(
		SALESFORCE_RATE_LIMIT_CONFIG.initialRetryDelay *
			SALESFORCE_RATE_LIMIT_CONFIG.backoffMultiplier ** (attempt - 1),
		60_000,
	);
}

async function fetchSalesforceBinary(
	url: string,
	path: string,
	method: NonNullable<SalesforceRequestOptions['method']>,
	headers: Record<string, string>,
): Promise<Buffer> {
	const maxAttempts = SALESFORCE_RATE_LIMIT_CONFIG.maxRetries + 1;
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		const res = await fetch(url, { method, headers });
		if (
			SALESFORCE_RATE_LIMIT_CONFIG.enabled &&
			res.status === 429 &&
			attempt < maxAttempts
		) {
			await new Promise((resolve) =>
				setTimeout(resolve, retryDelayMs(res, attempt)),
			);
			continue;
		}
		if (!res.ok) {
			throw new ApiError(
				{ method, url: path },
				{
					url,
					ok: false,
					status: res.status,
					statusText: res.statusText,
					body: await errorBody(res),
				},
				res.statusText,
				res.status === 429
					? { retryAfter: retryDelayMs(res, attempt) }
					: undefined,
			);
		}
		return Buffer.from(await res.arrayBuffer());
	}
	throw new Error('Salesforce binary request failed');
}

/**
 * Issues a Salesforce REST request.
 *
 * Failures stay as `ApiError` so status, Salesforce error arrays, and
 * Retry-After reach the plugin error handlers. Wrapping them would drop
 * `retryAfter` and skip RATE_LIMIT_ERROR.
 *
 * Auth: `Authorization: Bearer <access_token>`.
 * Docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart_oauth.htm
 */
export async function makeSalesforceRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SalesforceRequestOptions = {},
): Promise<T> {
	if (!apiKey) {
		throw new AuthMissingError('salesforce', 'oauth_2');
	}

	const instanceUrl = options.instanceUrl;
	if (!instanceUrl) {
		throw new SalesforceInstanceUrlMissingError();
	}

	const method = options.method ?? 'GET';
	const origin = originOf(endpoint, instanceUrl);
	const path = toPath(endpoint);
	const authorization = apiKey.startsWith('Bearer ')
		? apiKey
		: `Bearer ${apiKey}`;

	if (options.responseType === 'binary') {
		return (await fetchSalesforceBinary(`${origin}${path}`, path, method, {
			Accept: 'application/octet-stream',
			Authorization: authorization,
			...options.headers,
		})) as T;
	}

	const hasJsonBody =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const mediaType =
		options.mediaType ??
		(hasJsonBody && typeof options.body !== 'string'
			? 'application/json; charset=utf-8'
			: options.mediaType);

	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: authorization,
		...options.headers,
	};

	const config: OpenAPIConfig = {
		BASE: origin,
		VERSION: SALESFORCE_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: hasJsonBody ? options.body : undefined,
		mediaType,
		query: compactQuery(options.query),
		responseHeader: options.responseType === 'text' ? 'text' : undefined,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: SALESFORCE_RATE_LIMIT_CONFIG,
	});
}
