import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import type { ZohoAccount, ZohoFolder, ZohoResponse } from './types';

export class ZohoMailAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'ZohoMailAPIError';
	}
}

/**
 * Zoho operates region-specific datacenters. The OAuth (accounts.zoho.*) and
 * Mail API (mail.zoho.*) hosts share the same top-level domain per region.
 * @see https://www.zoho.com/mail/help/api/getting-started-with-api.html
 */
export type ZohoRegion = 'us' | 'eu' | 'in' | 'au' | 'jp' | 'cn';

const REGION_TLD: Record<ZohoRegion, string> = {
	us: 'com',
	eu: 'eu',
	in: 'in',
	au: 'com.au',
	jp: 'jp',
	cn: 'com.cn',
};

function regionTld(region?: ZohoRegion): string {
	return REGION_TLD[region ?? 'us'] ?? REGION_TLD.us;
}

export function zohoApiBase(region?: ZohoRegion): string {
	return `https://mail.zoho.${regionTld(region)}/api`;
}

export function zohoOAuthAuthUrl(region?: ZohoRegion): string {
	return `https://accounts.zoho.${regionTld(region)}/oauth/v2/auth`;
}

export function zohoOAuthTokenUrl(region?: ZohoRegion): string {
	return `https://accounts.zoho.${regionTld(region)}/oauth/v2/token`;
}

async function refreshZohoAccessToken(
	tokenUrl: string,
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	const response = await fetch(tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: clientId,
			client_secret: clientSecret,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new ZohoMailAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
		);
	}

	const json = (await response.json()) as {
		access_token: string;
		expires_in: number;
	};

	return json;
}

export async function getValidAccessToken({
	tokenUrl,
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	tokenUrl: string;
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	forceRefresh?: boolean;
}): Promise<{ accessToken: string; expiresAt: number; refreshed: boolean }> {
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

	const tokenData = await refreshZohoAccessToken(
		tokenUrl,
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: tokenData.access_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

export type ZohoRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	region?: ZohoRegion;
};

/**
 * Zoho Mail authenticates with `Authorization: Zoho-oauthtoken <token>` — not
 * Bearer — so the token is injected via HEADERS rather than the client's TOKEN
 * field (which would emit a Bearer prefix).
 */
export async function makeZohoRequest<T>(
	endpoint: string,
	token: string,
	options: ZohoRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, region } = options;

	const config: OpenAPIConfig = {
		BASE: zohoApiBase(region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Zoho-oauthtoken ${token}`,
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

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const status =
				'status' in error &&
				typeof (error as { status: unknown }).status === 'number'
					? (error as { status: number }).status
					: undefined;
			throw new ZohoMailAPIError(error.message, status);
		}
		throw new ZohoMailAPIError('Unknown error');
	}
}

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

type ZohoRequestContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

/**
 * Wrapper around makeZohoRequest that retries once on 401 by force-refreshing
 * the access token.
 */
export async function makeAuthenticatedZohoRequest<T>(
	endpoint: string,
	ctx: ZohoRequestContext,
	options: ZohoRequestOptions = {},
): Promise<T> {
	try {
		return await makeZohoRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeZohoRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}

/**
 * Every Zoho Mail data call is scoped to an accountId. When the caller does not
 * pass one explicitly, resolve it from `GET /api/accounts` (first account) and
 * cache it on the request context to avoid repeat lookups within a session.
 */
export async function resolveAccountId(
	ctx: ZohoRequestContext & { _zohoAccountId?: string },
	region: ZohoRegion | undefined,
	explicit?: string,
): Promise<string> {
	if (explicit) return explicit;
	if (ctx._zohoAccountId) return ctx._zohoAccountId;

	const res = await makeAuthenticatedZohoRequest<ZohoResponse<ZohoAccount[]>>(
		'/accounts',
		ctx,
		{ method: 'GET', region },
	);

	const accountId = res.data?.[0]?.accountId;
	if (!accountId) {
		throw new ZohoMailAPIError(
			'Unable to resolve Zoho Mail accountId from /accounts response',
		);
	}

	ctx._zohoAccountId = String(accountId);
	return ctx._zohoAccountId;
}

/**
 * Resolve a folderId for message listing. When the caller omits one, default to
 * the mailbox's Inbox (the common "show me my mail" case) by reading the folder
 * list and matching `folderType === 'Inbox'`. Cached per request context.
 */
export async function resolveInboxFolderId(
	ctx: ZohoRequestContext & { _zohoInboxFolderId?: string },
	region: ZohoRegion | undefined,
	accountId: string,
	explicit?: string,
): Promise<string> {
	if (explicit) return explicit;
	if (ctx._zohoInboxFolderId) return ctx._zohoInboxFolderId;

	const res = await makeAuthenticatedZohoRequest<ZohoResponse<ZohoFolder[]>>(
		`/accounts/${accountId}/folders`,
		ctx,
		{ method: 'GET', region },
	);

	const folders = res.data ?? [];
	const inbox = folders.find((f) => f.folderType === 'Inbox') ?? folders[0];
	if (!inbox?.folderId) {
		throw new ZohoMailAPIError(
			'Unable to resolve an Inbox folderId from /folders response',
		);
	}

	ctx._zohoInboxFolderId = String(inbox.folderId);
	return ctx._zohoInboxFolderId;
}
