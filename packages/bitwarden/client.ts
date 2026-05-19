import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class BitwardenAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BitwardenAPIError';
	}
}

const BITWARDEN_API_BASE = 'https://api.bitwarden.com';
const BITWARDEN_IDENTITY_BASE = 'https://identity.bitwarden.com';

function trimTrailingSlash(url: string): string {
	return url.replace(/\/+$/, '');
}

async function requestBitwardenAccessToken({
	clientId,
	clientSecret,
	identityBaseUrl = BITWARDEN_IDENTITY_BASE,
}: {
	clientId: string;
	clientSecret: string;
	identityBaseUrl?: string;
}): Promise<{ accessToken: string; expiresIn: number }> {
	const response = await fetch(
		`${trimTrailingSlash(identityBaseUrl)}/connect/token`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				scope: 'api.organization',
				client_id: clientId,
				client_secret: clientSecret,
			}),
		},
	);

	if (!response.ok) {
		const error = await response.text();
		throw new BitwardenAPIError(
			`Failed to obtain access token: ${error}`,
			String(response.status),
		);
	}

	const json = (await response.json()) as {
		access_token?: string;
		expires_in?: number;
		token_type?: string;
	};

	if (!json.access_token || typeof json.expires_in !== 'number') {
		throw new BitwardenAPIError('Invalid access token response from Bitwarden');
	}

	return {
		accessToken: json.access_token,
		expiresIn: json.expires_in,
	};
}

export async function getValidBitwardenAccessToken({
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	identityBaseUrl,
	forceRefresh = false,
}: {
	accessToken?: string | null;
	expiresAt?: string | null;
	clientId: string;
	clientSecret: string;
	identityBaseUrl?: string;
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

	const tokenData = await requestBitwardenAccessToken({
		clientId,
		clientSecret,
		identityBaseUrl,
	});

	return {
		accessToken: tokenData.accessToken,
		expiresAt: now + tokenData.expiresIn,
		refreshed: true,
	};
}

export async function makeBitwardenRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: BITWARDEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new BitwardenAPIError(error.message);
		}
		throw new BitwardenAPIError('Unknown error');
	}
}
