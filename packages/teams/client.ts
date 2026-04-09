import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class TeamsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TeamsAPIError';
	}
}

const TEAMS_API_BASE = 'https://graph.microsoft.com/v1.0';

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<{ access_token: string; expires_in: number }> {
	const response = await fetch(
		'https://login.microsoftonline.com/common/oauth2/v2.0/token',
		{
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
		},
	);

	if (!response.ok) {
		const error = await response.text();
		throw new TeamsAPIError(`Failed to refresh access token: ${error}`);
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
	expiresAt?: string | null;
	refreshToken: string;
}): Promise<{ accessToken: string; expiresAt: number; refreshed: boolean }> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;

	if (accessToken && expiresAt && Number(expiresAt) > now + bufferSeconds) {
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

const TEAMS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeTeamsRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Values are typed per-endpoint by callers; unknown keeps this helper generic across all Graph API bodies
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TEAMS_API_BASE,
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
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: TEAMS_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new TeamsAPIError(error.message);
		}
		throw new TeamsAPIError('Unknown error');
	}
}
