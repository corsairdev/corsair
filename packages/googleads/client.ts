import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GoogleAdsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'GoogleAdsAPIError';
	}
}

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new GoogleAdsAPIError(
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
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	clientId: string;
	clientSecret: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken: string;
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

	const tokenData = await refreshAccessToken(
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

const GOOGLEADS_API_BASE = 'https://googleads.googleapis.com/v18';

export async function makeGoogleAdsRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Using `unknown` because request bodies differ per endpoint; callers are responsible for constructing valid payloads.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		developerToken?: string;
		loginCustomerId?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		developerToken,
		loginCustomerId,
	} = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (developerToken) {
		headers['developer-token'] = developerToken;
	}

	if (loginCustomerId) {
		headers['login-customer-id'] = loginCustomerId;
	}

	const config: OpenAPIConfig = {
		BASE: GOOGLEADS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: headers,
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
		if (error instanceof ApiError) {
			throw new GoogleAdsAPIError(
				error.message,
				String(error.status),
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new GoogleAdsAPIError(error.message);
		}
		throw new GoogleAdsAPIError('Unknown error');
	}
}
