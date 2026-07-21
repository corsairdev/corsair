import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

import {
	basicAuthHeader,
	bearerAuthHeader,
	dataCenterFromApiKey,
	mailchimpBaseUrl,
	parseMailchimpKey,
} from './utils';

export class MailchimpAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MailchimpAPIError';
	}
}

/**
 * Mailchimp OAuth metadata endpoint. After the OAuth token exchange, the access
 * token alone does not encode a data center — it must be resolved here.
 */
export const MAILCHIMP_OAUTH_METADATA_URL =
	'https://login.mailchimp.com/oauth2/metadata';

export type MailchimpOAuthMetadata = {
	dc: string;
	api_endpoint: string;
	login_url?: string;
	account_id?: string;
};

/**
 * Resolves the data center (and API endpoint) for an OAuth access token via the
 * Mailchimp metadata endpoint. Call this once after OAuth and persist the `dc`
 * so per-request calls can build the correct base URL without re-fetching.
 */
/**
 * Per-token metadata cache so we only hit Mailchimp's metadata endpoint once
 * per access token. Mailchimp access tokens do not expire, so the resolved
 * data center is stable for the token's lifetime; caching avoids doubling
 * latency on every OAuth request and removes the metadata endpoint as a
 * single point of failure for already-resolved tenants.
 *
 * Bounded with FIFO eviction to keep memory predictable in multi-tenant
 * deployments (a new token evicts the oldest entry once the cap is reached).
 */
const OAUTH_METADATA_CACHE_MAX = 1000;
const oauthMetadataCache = new Map<string, MailchimpOAuthMetadata>();

export async function fetchMailchimpOAuthMetadata(
	accessToken: string,
): Promise<MailchimpOAuthMetadata> {
	if (!accessToken) {
		throw new MailchimpAPIError(
			'An access token is required to resolve Mailchimp OAuth metadata.',
		);
	}

	const cached = oauthMetadataCache.get(accessToken);
	if (cached) return cached;

	const res = await fetch(MAILCHIMP_OAUTH_METADATA_URL, {
		headers: { Authorization: `OAuth ${accessToken}` },
	});
	if (!res.ok) {
		throw new MailchimpAPIError(
			`Failed to resolve Mailchimp data center (HTTP ${res.status}).`,
		);
	}

	const body = (await res.json()) as Partial<MailchimpOAuthMetadata>;
	if (!body.dc || !body.api_endpoint) {
		throw new MailchimpAPIError(
			'Mailchimp OAuth metadata did not include a data center.',
		);
	}
	const metadata: MailchimpOAuthMetadata = {
		dc: body.dc,
		api_endpoint: body.api_endpoint,
		login_url: body.login_url,
		account_id: body.account_id,
	};
	if (oauthMetadataCache.size >= OAUTH_METADATA_CACHE_MAX) {
		const oldestKey = oauthMetadataCache.keys().next().value;
		if (oldestKey) oauthMetadataCache.delete(oldestKey);
	}
	oauthMetadataCache.set(accessToken, metadata);
	return metadata;
}

/**
 * Resolves the Mailchimp account_id for the current connection so it can be
 * embedded into webhook URLs as a routing hint. OAuth pulls it from the cached
 * metadata; API-key fetches `/` once and caches per token. Bounded FIFO like
 * the OAuth metadata cache.
 */
const ACCOUNT_ID_CACHE_MAX = 1000;
const accountIdCache = new Map<string, string>();

export async function getMailchimpAccountId(
	key: string,
): Promise<string | undefined> {
	const parsed = parseMailchimpKey(key);
	const cached = accountIdCache.get(parsed.token);
	if (cached) return cached;

	let accountId: string | undefined;
	if (parsed.authType === 'oauth_2') {
		const metadata = await fetchMailchimpOAuthMetadata(parsed.token);
		accountId = metadata.account_id;
	} else {
		const root = await makeMailchimpRequest<{ account_id?: unknown }>(
			'/',
			key,
			{ method: 'GET' },
		);
		if (typeof root?.account_id === 'string') accountId = root.account_id;
	}

	if (accountId) {
		if (accountIdCache.size >= ACCOUNT_ID_CACHE_MAX) {
			const oldestKey = accountIdCache.keys().next().value;
			if (oldestKey) accountIdCache.delete(oldestKey);
		}
		accountIdCache.set(parsed.token, accountId);
	}
	return accountId;
}

export type MailchimpRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	/**
	 * How to authenticate. `api_key` derives the data center from the key
	 * suffix; `oauth_2` uses a bearer token and requires `dataCenter`.
	 */
	authType?: 'api_key' | 'oauth_2';
	/**
	 * Data center prefix (e.g. `us19`). Required for OAuth connections (resolved
	 * from the OAuth metadata endpoint); derived from the key for API-key
	 * connections when omitted.
	 */
	dataCenter?: string;
};

/**
 * Resolves the Marketing API base URL for a connection. OAuth connections must
 * supply the data center; API-key connections derive it from the key suffix.
 */
export function resolveMailchimpBaseUrl(
	key: string,
	options: Pick<MailchimpRequestOptions, 'authType' | 'dataCenter'>,
): string {
	const dc =
		options.dataCenter ??
		(options.authType === 'oauth_2' ? undefined : dataCenterFromApiKey(key));
	if (!dc) {
		throw new Error(
			'Mailchimp OAuth connections require a data center (resolve it from the OAuth metadata endpoint).',
		);
	}
	return mailchimpBaseUrl(dc);
}

export async function makeMailchimpRequest<T>(
	endpoint: string,
	key: string,
	options: MailchimpRequestOptions = {},
): Promise<T> {
	const parsed = parseMailchimpKey(key);
	const { method = 'GET', body, query } = options;
	const authType = options.authType ?? parsed.authType;
	const dataCenter = options.dataCenter ?? parsed.dataCenter;

	const authorization =
		authType === 'oauth_2'
			? bearerAuthHeader(parsed.token)
			: basicAuthHeader(parsed.token);

	const config: OpenAPIConfig = {
		BASE: resolveMailchimpBaseUrl(parsed.token, { authType, dataCenter }),
		VERSION: '3.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: parsed.token,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: authorization,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError so error-handlers.ts instanceof checks (status
		// routing, Retry-After on 429s) keep working instead of seeing a
		// flattened MailchimpAPIError that lost status/retryAfter.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new MailchimpAPIError(error.message);
		}
		throw new MailchimpAPIError('Unknown error');
	}
}
