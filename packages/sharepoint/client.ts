import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

// ─────────────────────────────────────────────────────────────────────────────
// Token refresh
// ─────────────────────────────────────────────────────────────────────────────

const MICROSOFT_TOKEN_URL =
	'https://login.microsoftonline.com/common/oauth2/v2.0/token';

async function refreshSharepointAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}> {
	const response = await fetch(MICROSOFT_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to refresh SharePoint access token: ${error}`);
	}

	// Microsoft token response is untyped; cast to extract the expected fields
	return response.json() as Promise<{
		access_token: string;
		refresh_token?: string;
		expires_in: number;
	}>;
}

/**
 * Returns a valid access token, refreshing via the refresh token if the stored
 * token is missing or within 5 minutes of expiry. Microsoft issues a new refresh
 * token on each refresh — callers should persist both the new access token and
 * the new refresh token when `refreshed` is true.
 */
export async function getValidSharepointAccessToken({
	accessToken,
	expiresAt,
	refreshToken,
	clientId,
	clientSecret,
	forceRefresh = false,
}: {
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken: string;
	clientId: string;
	clientSecret: string;
	forceRefresh?: boolean;
}): Promise<{
	accessToken: string;
	newRefreshToken?: string;
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
		return { accessToken, expiresAt: Number(expiresAt), refreshed: false };
	}

	const tokenData = await refreshSharepointAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: tokenData.access_token,
		// Microsoft issues a new refresh token on each refresh; propagate it if present
		newRefreshToken: tokenData.refresh_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

const SHAREPOINT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

/**
 * Builds a Graph API URL for a site sub-resource.
 * Handles both GUID format ("tenant.sharepoint.com,siteGuid,webGuid")
 * and hostname:path format ("tenant.sharepoint.com:/sites/MySite").
 * The hostname:path format requires ":/subresource" notation.
 */
export function graphSiteUrl(siteId: string, subpath?: string): string {
	if (!subpath) return `/sites/${siteId}`;
	// hostname:path format contains ':' but no ','
	const isHostnamePath = siteId.includes(':') && !siteId.includes(',');
	return isHostnamePath
		? `/sites/${siteId}:/${subpath}`
		: `/sites/${siteId}/${subpath}`;
}

export async function makeSharePointRequest<T>(
	siteUrl: string,
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers: extraHeaders = {} } = options;

	const config: OpenAPIConfig = {
		BASE: siteUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			Accept: 'application/json;odata=nometadata',
			'Content-Type': 'application/json;odata=nometadata',
			...extraHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query: method === 'GET' ? query : undefined,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: SHAREPOINT_RATE_LIMIT_CONFIG,
	});

	return response;
}

/**
 * Resolves a site ID to GUID format (e.g. "tenant.sharepoint.com,siteGuid,webGuid").
 * Required for drive item operations — the hostname:path format cannot be combined
 * with drive item colon-path syntax (root:/{path}) in a single URL.
 * If the ID is already in GUID format (contains ',') it is returned as-is.
 */
export async function resolveSiteGuid(
	siteId: string,
	token: string,
): Promise<string> {
	if (siteId.includes(',')) return siteId;
	const site = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}`,
		token,
		{ method: 'GET', query: { $select: 'id' } },
	);
	return site.id ?? siteId;
}

export async function makeGraphRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | string;
		mediaType?: string;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, mediaType, query } = options;

	const isRawBody = typeof body === 'string';
	const effectiveMediaType =
		mediaType ?? (isRawBody ? 'text/plain' : 'application/json');

	const config: OpenAPIConfig = {
		BASE: GRAPH_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: effectiveMediaType,
		query: method === 'GET' ? query : undefined,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: SHAREPOINT_RATE_LIMIT_CONFIG,
	});

	return response;
}
