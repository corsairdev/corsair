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

// Managed auth uses Corsair's gitlab.com OAuth app, so its token is valid only
// against canonical gitlab.com. Match the hostname (case-insensitive,
// trailing-dot tolerant) but also require https on the default port — a custom
// port or scheme is a different service and must not receive the managed token.
export function isManagedGitlabHost(baseUrl: string): boolean {
	try {
		const url = new URL(baseUrl);
		const hostname = url.hostname.replace(/\.$/, '').toLowerCase();
		return (
			hostname === 'gitlab.com' &&
			url.protocol === 'https:' &&
			(url.port === '' || url.port === '443')
		);
	} catch {
		return false;
	}
}

export function gitlabApiBase(baseUrl?: string): string {
	return `${normalizeGitlabBaseUrl(baseUrl)}/api/v4`;
}

export function gitlabOAuthTokenUrl(baseUrl?: string): string {
	return `${normalizeGitlabBaseUrl(baseUrl)}/oauth/token`;
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
				'status' in error &&
				typeof (error as { status: unknown }).status === 'number'
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
