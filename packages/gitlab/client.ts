import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GitlabAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'GitlabAPIError';
	}
}

export function normalizeGitlabBaseUrl(baseUrl?: string): string {
	const trimmed = (baseUrl ?? 'https://gitlab.com').trim();
	const withoutSlash = trimmed.replace(/\/+$/, '');
	return withoutSlash || 'https://gitlab.com';
}

export function gitlabApiBase(baseUrl?: string): string {
	return `${normalizeGitlabBaseUrl(baseUrl)}/api/v4`;
}

export function gitlabOAuthTokenUrl(baseUrl?: string): string {
	return `${normalizeGitlabBaseUrl(baseUrl)}/oauth/token`;
}

async function refreshGitlabAccessToken(
	tokenUrl: string,
	clientId: string,
	clientSecret: string,
	refreshToken: string,
	redirectUri?: string | null,
) {
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
		client_id: clientId,
		client_secret: clientSecret,
	});
	if (redirectUri) {
		body.set('redirect_uri', redirectUri);
	}

	const response = await fetch(tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new GitlabAPIError(
			`Failed to refresh access token: ${errorText}`,
			response.status,
		);
	}

	const json = (await response.json()) as {
		access_token: string;
		expires_in: number;
	};

	return json;
}

export async function getValidGitlabAccessToken({
	tokenUrl,
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	redirectUri,
	forceRefresh = false,
}: {
	tokenUrl: string;
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	redirectUri?: string | null;
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

	const tokenData = await refreshGitlabAccessToken(
		tokenUrl,
		clientId,
		clientSecret,
		refreshToken,
		redirectUri,
	);
	return {
		accessToken: tokenData.access_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

export type GitlabRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, any>;
	query?: Record<string, any>;
	/** Self-managed host (default https://gitlab.com) */
	baseUrl?: string;
};

/**
 * GitLab accepts OAuth tokens as Bearer. Personal, project, and group access
 * tokens are also sent as Bearer by the shared HTTP client.
 */
export async function makeGitlabRequest<T>(
	endpoint: string,
	token: string,
	options: GitlabRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl } = options;

	const config: OpenAPIConfig = {
		BASE: gitlabApiBase(baseUrl),
		VERSION: '1.0.0',
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

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const status =
				'status' in error && typeof (error as { status: unknown }).status === 'number'
					? (error as { status: number }).status
					: undefined;
			throw new GitlabAPIError(error.message, status);
		}
		throw new GitlabAPIError('Unknown error');
	}
}

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

export async function makeAuthenticatedGitlabRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: GitlabRequestOptions = {},
): Promise<T> {
	try {
		return await makeGitlabRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeGitlabRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
