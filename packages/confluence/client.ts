import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const ATLASSIAN_TOKEN_URL = 'https://auth.atlassian.com/oauth/token';
const ATLASSIAN_ACCESSIBLE_RESOURCES_URL =
	'https://api.atlassian.com/oauth/token/accessible-resources';

const CONFLUENCE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

type AtlassianTokenResponse = {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
};

export type ConfluenceCloudResource = {
	id: string;
	url: string;
	name: string;
	scopes: string[];
};

async function refreshConfluenceAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<AtlassianTokenResponse> {
	const response = await fetch(ATLASSIAN_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			grant_type: 'refresh_token',
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`Failed to refresh Confluence access token (${response.status}): ${await response.text()}`,
		);
	}

	return (await response.json()) as AtlassianTokenResponse;
}

export async function getValidConfluenceAccessToken({
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	accessToken?: string | null;
	expiresAt?: string | null;
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	forceRefresh?: boolean;
}): Promise<{
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	refreshed: boolean;
}> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;

	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return {
			accessToken,
			refreshToken,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}

	const tokenData = await refreshConfluenceAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);

	return {
		accessToken: tokenData.access_token,
		refreshToken: tokenData.refresh_token ?? refreshToken,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

export function normalizeConfluenceCloudUrl(cloudUrl: string): string {
	const trimmed = cloudUrl.trim();
	let end = trimmed.length;
	while (end > 0 && trimmed.charCodeAt(end - 1) === 47) end -= 1;
	return trimmed.slice(0, end);
}

function isConfluenceResource(
	value: unknown,
): value is ConfluenceCloudResource {
	if (!value || typeof value !== 'object') return false;
	const resource = value as Record<string, unknown>;
	return (
		typeof resource.id === 'string' &&
		typeof resource.url === 'string' &&
		typeof resource.name === 'string' &&
		Array.isArray(resource.scopes) &&
		resource.scopes.every((scope) => typeof scope === 'string') &&
		resource.scopes.some(
			(scope) => typeof scope === 'string' && scope.includes('confluence'),
		)
	);
}

export async function resolveConfluenceCloudResource(
	accessToken: string,
	cloudUrl?: string | null,
): Promise<ConfluenceCloudResource> {
	const response = await fetch(ATLASSIAN_ACCESSIBLE_RESOURCES_URL, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to resolve Confluence cloud site (${response.status}): ${await response.text()}`,
		);
	}

	const payload = (await response.json()) as unknown;
	const resources = Array.isArray(payload)
		? payload.filter(isConfluenceResource)
		: [];

	if (resources.length === 0) {
		throw new Error(
			'No accessible Confluence sites were returned by Atlassian',
		);
	}

	if (cloudUrl) {
		const requestedUrl = normalizeConfluenceCloudUrl(cloudUrl);
		const selected = resources.find(
			(resource) => normalizeConfluenceCloudUrl(resource.url) === requestedUrl,
		);
		if (!selected) {
			throw new Error(
				`The configured Confluence cloudUrl (${requestedUrl}) is not accessible to this OAuth account`,
			);
		}
		return selected;
	}

	if (resources.length === 1) return resources[0]!;

	throw new Error(
		'This OAuth account can access multiple Confluence sites; set cloudUrl to select one',
	);
}

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
		/** Atlassian cloud ID required by the OAuth API gateway. */
		cloudId?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, base, authType, cloudId } = options;

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

	const apiPath = base ?? '/wiki/rest/api';
	const apiBase =
		authType === 'oauth_2'
			? cloudId
				? `https://api.atlassian.com/ex/confluence/${encodeURIComponent(cloudId)}${apiPath}`
				: null
			: cloudUrl
				? `${normalizeConfluenceCloudUrl(cloudUrl)}${apiPath}`
				: null;

	if (!apiBase) {
		throw new Error(
			authType === 'oauth_2'
				? 'Confluence OAuth requests require a resolved cloud ID'
				: 'Confluence API-key requests require a cloud URL',
		);
	}

	const config: OpenAPIConfig = {
		BASE: apiBase,
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
