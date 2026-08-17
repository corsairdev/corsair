import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const APALEO_API_BASE = 'https://api.apaleo.com';
export const APALEO_AUTH_URL = 'https://identity.apaleo.com/connect/authorize';
export const APALEO_TOKEN_URL = 'https://identity.apaleo.com/connect/token';

export class ApaleoAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'ApaleoAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export class ApaleoOAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApaleoOAuthError';
	}
}

export type ApaleoTokenResult = {
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
	refreshed: boolean;
};

async function requestApaleoToken(params: {
	clientId: string;
	clientSecret: string;
	grantType: 'client_credentials' | 'refresh_token';
	refreshToken?: string;
}): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}> {
	const body = new URLSearchParams({ grant_type: params.grantType });
	if (params.grantType === 'refresh_token' && params.refreshToken) {
		body.set('refresh_token', params.refreshToken);
	}
	const response = await fetch(APALEO_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization:
				'Basic ' +
				Buffer.from(params.clientId + ':' + params.clientSecret).toString(
					'base64',
				),
		},
		body,
	});
	const json = (await response.json()) as {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
		error?: string;
		error_description?: string;
	};
	if (
		!response.ok ||
		!json.access_token ||
		typeof json.expires_in !== 'number'
	) {
		throw new ApaleoOAuthError(
			json.error_description ||
				json.error ||
				`Failed to obtain Apaleo access token (${response.status})`,
		);
	}
	return {
		access_token: json.access_token,
		refresh_token: json.refresh_token,
		expires_in: json.expires_in,
	};
}

/**
 * Client-credentials grant (simple client) or refresh_token grant (connect client).
 * https://apaleo.dev/guides/oauth-connection/simple-client.html
 */
export async function getValidApaleoAccessToken({
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
}): Promise<ApaleoTokenResult> {
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
			refreshToken: refreshToken ?? undefined,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}
	if (!clientId || !clientSecret) {
		throw new ApaleoOAuthError(
			'Apaleo client_id and client_secret are required',
		);
	}
	const token = await requestApaleoToken(
		refreshToken
			? {
					clientId,
					clientSecret,
					grantType: 'refresh_token',
					refreshToken,
				}
			: { clientId, clientSecret, grantType: 'client_credentials' },
	);
	return {
		accessToken: token.access_token,
		refreshToken: token.refresh_token ?? refreshToken ?? undefined,
		expiresAt: now + token.expires_in,
		refreshed: true,
	};
}

export async function makeApaleoRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
		body?: unknown;
		query?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const config: OpenAPIConfig = {
		BASE: APALEO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: query as ApiRequestOptions['query'],
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
	};
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ApaleoAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new ApaleoAPIError(error.message, { cause: error });
		}
		throw new ApaleoAPIError('Unknown error');
	}
}

export async function apaleoResourceExists(
	endpoint: string,
	accessToken: string,
): Promise<boolean> {
	try {
		await makeApaleoRequest(endpoint, accessToken, { method: 'HEAD' });
		return true;
	} catch (error) {
		if (error instanceof ApaleoAPIError && error.status === 404) return false;
		throw error;
	}
}
