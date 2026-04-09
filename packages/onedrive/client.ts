import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class OnedriveAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'OnedriveAPIError';
	}
}

const ONEDRIVE_API_BASE = 'https://graph.microsoft.com/v1.0';
const MICROSOFT_TOKEN_URL =
	'https://login.microsoftonline.com/common/oauth2/v2.0/token';

const ONEDRIVE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<{ access_token: string; expires_in: number }> {
	const response = await fetch(MICROSOFT_TOKEN_URL, {
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
		throw new OnedriveAPIError(
			`Failed to refresh access token: ${error}`,
			String(response.status),
		);
	}

	return (await response.json()) as {
		access_token: string;
		expires_in: number;
	};
}

export async function getValidAccessToken({
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
}: {
	clientId: string;
	clientSecret: string;
	accessToken?: string | null;
	expiresAt?: string | number | null;
	refreshToken: string;
}): Promise<{ accessToken: string; expiresAt: number; refreshed: boolean }> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;

	const rawExpiresAt = expiresAt ? Number(expiresAt) : null;
	const normalizedExpiresAt =
		typeof rawExpiresAt === 'number' && Number.isFinite(rawExpiresAt)
			? rawExpiresAt > 1_000_000_000_000
				? Math.floor(rawExpiresAt / 1000)
				: Math.floor(rawExpiresAt)
			: null;

	const hasJwtShape =
		typeof accessToken === 'string' && accessToken.split('.').length === 3;

	if (
		accessToken &&
		hasJwtShape &&
		normalizedExpiresAt &&
		normalizedExpiresAt > now + bufferSeconds
	) {
		return {
			accessToken,
			expiresAt: normalizedExpiresAt,
			refreshed: false,
		};
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

export async function makeOnedriveRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ONEDRIVE_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
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
		query,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: ONEDRIVE_RATE_LIMIT_CONFIG,
	});

	return response;
}
