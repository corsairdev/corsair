import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SpotifyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'SpotifyAPIError';
	}
}

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const SPOTIFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

let cachedAccessToken: string | null = null;
let tokenExpiryTime: number = 0;

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	const response = await fetch('https://accounts.spotify.com/api/token', {
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
		throw new SpotifyAPIError(
			`Failed to refresh access token: ${error}`,
			undefined,
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
	clientId,
	clientSecret,
	refreshToken,
}: {
	clientId: string;
	clientSecret: string;
	accessToken?: string | null;
	refreshToken: string;
}): Promise<string | undefined> {
	const now = Date.now();
	const bufferTime = 5 * 60 * 1000;

	if (
		cachedAccessToken &&
		tokenExpiryTime > now + bufferTime &&
		cachedAccessToken === accessToken
	) {
		return cachedAccessToken;
	}

	try {
		const tokenData = await refreshAccessToken(
			clientId,
			clientSecret,
			refreshToken,
		);
		cachedAccessToken = tokenData.access_token;
		tokenExpiryTime = now + tokenData.expires_in * 1000;
		return cachedAccessToken;
	} catch (error) {
		if (error instanceof SpotifyAPIError) {
			throw error;
		}
		return accessToken || undefined;
	}
}

export type SpotifyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Using 'unknown' because request body structure varies by endpoint and is validated by the Spotify API
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeSpotifyRequest<T>(
	endpoint: string,
	accessToken: string,
	options: SpotifyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: SPOTIFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
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
			rateLimitConfig: SPOTIFY_RATE_LIMIT_CONFIG,
		});

		if (
			response &&
			typeof response === 'object' &&
			'error' in response &&
			response.error
		) {
			const error = response.error as { message?: string; status?: number };
			throw new SpotifyAPIError(
				error.message || 'Spotify API error',
				undefined,
				error.status,
			);
		}

		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new SpotifyAPIError(error.message, undefined, error.status);
		}
		if (error instanceof SpotifyAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new SpotifyAPIError(error.message);
		}
		throw new SpotifyAPIError('Unknown error');
	}
}

function isUnauthorizedError(error: unknown): boolean {
	return (
		(error instanceof Error &&
			'status' in error &&
			(error as { status: number }).status === 401) ||
		(error instanceof SpotifyAPIError && error.status === 401)
	);
}

export async function makeAuthenticatedSpotifyRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: SpotifyRequestOptions = {},
): Promise<T> {
	try {
		return await makeSpotifyRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeSpotifyRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
