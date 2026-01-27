import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';

export class GmailAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GmailAPIError';
	}
}

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

let cachedAccessToken: string | null = null;
let tokenExpiryTime: number = 0;

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<{ access_token: string; expires_in: number }> {
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
		throw new GmailAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
		);
	}

	return await response.json();
}

async function getValidAccessToken(
	clientId: string,
	clientSecret: string,
	accessToken: string,
	refreshToken: string,
): Promise<string> {
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
		if (error instanceof GmailAPIError) {
			throw error;
		}
		return accessToken;
	}
}

export async function makeGmailRequest<T>(
	endpoint: string,
	credentials: {
		clientId: string;
		clientSecret: string;
		accessToken: string;
		refreshToken: string;
	},
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const validAccessToken = await getValidAccessToken(
		credentials.clientId,
		credentials.clientSecret,
		credentials.accessToken,
		credentials.refreshToken,
	);

	const config: OpenAPIConfig = {
		BASE: GMAIL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: validAccessToken,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			'status' in error &&
			error.status === 401
		) {
			const refreshedToken = await refreshAccessToken(
				credentials.clientId,
				credentials.clientSecret,
				credentials.refreshToken,
			);
			cachedAccessToken = refreshedToken.access_token;
			tokenExpiryTime = Date.now() + refreshedToken.expires_in * 1000;

			const retryConfig: OpenAPIConfig = {
				...config,
				TOKEN: refreshedToken.access_token,
			};

			return await request<T>(retryConfig, requestOptions);
		}
		throw error;
	}
}
