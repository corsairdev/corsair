import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const BASECAMP_API_BASE = 'https://3.basecampapi.com';
export const BASECAMP_AUTH_BASE = 'https://launchpad.37signals.com';
export const BASECAMP_AUTH_URL =
	'https://launchpad.37signals.com/authorization/new';
export const BASECAMP_TOKEN_URL =
	'https://launchpad.37signals.com/authorization/token';
export const BASECAMP_DEFAULT_USER_AGENT =
	'Corsair Basecamp Integration (https://corsair.dev)';

function rateLimitConfig(retrySafe: boolean): RateLimitConfig {
	return {
		enabled: true,
		maxRetries: retrySafe ? 3 : 0,
		initialRetryDelay: 1000,
		backoffMultiplier: 2,
		headerNames: { retryAfter: 'Retry-After' },
	};
}

export class BasecampAccountIdMissingError extends Error {
	constructor() {
		super(
			'Basecamp requires one selected account. Set accountId in the plugin options or store account_id for the OAuth account.',
		);
		this.name = 'BasecampAccountIdMissingError';
	}
}

export class BasecampOAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'BasecampOAuthError';
	}
}

export class BasecampAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BasecampAPIError';
	}
}

export function validateAccountId(value: string): string {
	if (!/^[0-9]+$/.test(value)) {
		throw new BasecampAccountIdMissingError();
	}
	return value;
}

export function compactObject(
	value: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value)
			.filter(([, item]) => item !== undefined)
			.map(([key, item]) => [
				key,
				item !== null && typeof item === 'object' && !Array.isArray(item)
					? compactObject(item as Record<string, unknown>)
					: item,
			]),
	);
}

type AuthorizationAccount = {
	id?: number | string;
	product?: string;
	href?: string;
	resource?: string;
};

export async function discoverBasecampAccountId(
	accessToken: string,
	userAgent = BASECAMP_DEFAULT_USER_AGENT,
): Promise<string> {
	const config: OpenAPIConfig = {
		BASE: BASECAMP_AUTH_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: 'Bearer ' + accessToken,
			'User-Agent': userAgent,
			Accept: 'application/json',
		},
	};
	const payload = await request<{ accounts?: AuthorizationAccount[] }>(
		config,
		{ method: 'GET', url: '/authorization.json' },
		{ rateLimitConfig: rateLimitConfig(true) },
	);
	const accounts = (payload.accounts ?? []).filter((account) => {
		if (account.product && account.product !== 'bc3') return false;
		return (
			account.id !== undefined &&
			account.href?.startsWith(BASECAMP_API_BASE + '/')
		);
	});
	if (accounts.length !== 1) throw new BasecampAccountIdMissingError();
	return validateAccountId(String(accounts[0]?.id));
}

export type BasecampTokenResult = {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type?: string;
};

export async function refreshBasecampAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<BasecampTokenResult> {
	const config: OpenAPIConfig = {
		BASE: BASECAMP_AUTH_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json' },
	};
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
		client_id: clientId,
		client_secret: clientSecret,
	}).toString();
	try {
		return await request<BasecampTokenResult>(
			config,
			{
				method: 'POST',
				url: '/authorization/token',
				body,
				mediaType: 'application/x-www-form-urlencoded',
			},
			{ rateLimitConfig: rateLimitConfig(false) },
		);
	} catch (error) {
		throw new BasecampOAuthError(
			'Failed to refresh Basecamp access token: ' +
				(error instanceof Error ? error.message : String(error)),
		);
	}
}

export async function getValidBasecampAccessToken({
	accessToken,
	expiresAt,
	refreshToken,
	clientId,
	clientSecret,
	forceRefresh = false,
}: {
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken?: string | null;
	clientId?: string | null;
	clientSecret?: string | null;
	forceRefresh?: boolean;
}): Promise<{
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
	refreshed: boolean;
}> {
	const now = Math.floor(Date.now() / 1000);
	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + 300
	) {
		return {
			accessToken,
			refreshToken: refreshToken ?? undefined,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}
	if (!refreshToken || !clientId || !clientSecret) {
		throw new BasecampOAuthError(
			'Basecamp refresh token and OAuth client credentials are required',
		);
	}
	const token = await refreshBasecampAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: token.access_token,
		refreshToken: token.refresh_token ?? refreshToken,
		expiresAt: now + token.expires_in,
		refreshed: true,
	};
}

export type BasecampRequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown> | Blob;
	query?: Record<string, string | number | boolean | undefined>;
	mediaType?: string;
	retrySafe?: boolean;
	authenticated?: boolean;
};

export async function makeBasecampRequest<T>(
	endpoint: string,
	accessToken: string,
	userAgent: string,
	options: BasecampRequestOptions,
): Promise<T> {
	const authenticated = options.authenticated ?? true;
	const config: OpenAPIConfig = {
		BASE: BASECAMP_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(authenticated && accessToken
				? { Authorization: 'Bearer ' + accessToken }
				: {}),
			'User-Agent': userAgent,
			Accept: 'application/json',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: endpoint,
		body: options.body,
		query: options.query,
		mediaType: options.body
			? (options.mediaType ?? 'application/json; charset=utf-8')
			: undefined,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: rateLimitConfig(options.retrySafe ?? false),
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BasecampAPIError(
				'Basecamp API request failed with status ' + error.status,
				error.status,
				error.retryAfter,
			);
		}
		throw error;
	}
}
