import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TickTickAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TickTickAPIError';
	}
}

const TICKTICK_API_BASE = 'https://api.ticktick.com/open/v1';
const TICKTICK_TOKEN_URL = 'https://ticktick.com/oauth/token';

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	const response = await fetch(TICKTICK_TOKEN_URL, {
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
		throw new TickTickAPIError(
			`Failed to refresh access token: ${error}`,
			String(response.status),
		);
	}

	const json = (await response.json()) as {
		access_token: string;
		expires_in: number;
		token_type: string;
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

function extractTickTickError(error: ApiError): string {
	const body = error.body as
		| Record<string, unknown>
		| string
		| undefined
		| null;
	if (!body) return `[${error.status}] ${error.message}`;

	if (typeof body === 'string') {
		const preview = body.length > 300 ? `${body.slice(0, 300)}...` : body;
		return `[${error.status}] ${preview}`;
	}

	if (typeof body.error === 'string') {
		return `[${error.status}] ${body.error}`;
	}

	if (typeof body.errorMessage === 'string') {
		return `[${error.status}] ${body.errorMessage}`;
	}

	try {
		return `[${error.status}] ${JSON.stringify(body)}`;
	} catch {
		return `[${error.status}] ${error.message}`;
	}
}

export async function makeTickTickRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | string;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TICKTICK_API_BASE,
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new TickTickAPIError(
				extractTickTickError(error),
				String(error.status),
			);
		}
		if (error instanceof Error) {
			throw new TickTickAPIError(error.message);
		}
		throw new TickTickAPIError('Unknown error');
	}
}

function isUnauthorizedError(error: unknown): boolean {
	if (error instanceof TickTickAPIError) {
		return error.code === '401';
	}
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

export async function makeAuthenticatedTickTickRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: Parameters<typeof makeTickTickRequest>[2] = {},
): Promise<T> {
	try {
		return await makeTickTickRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeTickTickRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
