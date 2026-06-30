import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleMeetAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GoogleMeetAPIError';
	}
}

const GOOGLEMEET_API_BASE = 'https://meet.googleapis.com';

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
		throw new GoogleMeetAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
		);
	}

	return (await response.json()) as {
		access_token: string;
		expires_in: number;
		refresh_token?: string;
	};
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

	const tokenData = await refreshAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: tokenData.access_token,
		newRefreshToken: tokenData.refresh_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

type GoogleMeetRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeGoogleMeetRequest<T>(
	endpoint: string,
	credentials: string,
	options: GoogleMeetRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: GOOGLEMEET_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: credentials,
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
		mediaType: 'application/json',
		query,
	};

	const response = await request<T>(config, requestOptions);
	return response;
}

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

export async function makeAuthenticatedGoogleMeetRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: GoogleMeetRequestOptions = {},
): Promise<T> {
	try {
		return await makeGoogleMeetRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeGoogleMeetRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
