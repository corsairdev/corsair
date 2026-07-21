import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const CONFLUENCE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Makes a request to the Confluence REST API.
 * For Basic auth (api_key), the apiKey should be in "email:apiToken" format
 * (Confluence Cloud). For OAuth, the apiKey is the raw bearer token.
 */
export async function makeConfluenceRequest<T>(
	endpoint: string,
	apiKey: string,
	cloudUrl: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		/**
		 * Override the API base path. Defaults to '/wiki/rest/api' (v1).
		 * Use '/wiki/api/v2' for v2 endpoints.
		 */
		base?: string;
		/**
		 * When 'oauth_2', the Authorization header uses Bearer scheme.
		 * Otherwise (api_key or static key), Basic auth is used.
		 */
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, base, authType } = options;

	const authorization = (() => {
		if (authType === 'oauth_2') {
			return `Bearer ${apiKey}`;
		}
		// Atlassian Cloud Basic auth requires "email:apiToken" format.
		// The stored api_key must contain the full credential. If a bare
		// token is passed (no colon), reject it before sending a broken
		// Authorization header that would silently 401.
		// Ref: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/
		if (!apiKey.includes(':')) {
			throw new Error(
				'Confluence Basic auth requires "email:apiToken" format. ' +
					'The stored api_key appears to be a bare token.',
			);
		}
		return `Basic ${Buffer.from(apiKey).toString('base64')}`;
	})();

	const config: OpenAPIConfig = {
		BASE: `${cloudUrl}${base ?? '/wiki/rest/api'}`,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: authorization,
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
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: CONFLUENCE_RATE_LIMIT_CONFIG,
	});
}
