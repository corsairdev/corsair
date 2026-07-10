import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GithubAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GithubAPIError';
	}
}

const GITHUB_API_BASE = 'https://api.github.com';

type GithubRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export type GithubAuthContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof GithubAPIError &&
		typeof error.code === 'number' &&
		error.code === 401
	);
}

async function makeGithubRequestWithToken<T>(
	endpoint: string,
	token: string,
	options: GithubRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: GITHUB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/vnd.github.v3+json',
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
			typeof error.status === 'number'
		) {
			throw new GithubAPIError(
				error instanceof Error ? error.message : 'GitHub API error',
				error.status,
			);
		}
		throw new GithubAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}

export async function makeGithubRequest<T>(
	endpoint: string,
	auth: string | GithubAuthContext,
	options: GithubRequestOptions = {},
): Promise<T> {
	const token = typeof auth === 'string' ? auth : auth.key;
	const refreshAuth = typeof auth === 'string' ? undefined : auth._refreshAuth;

	try {
		return await makeGithubRequestWithToken<T>(endpoint, token, options);
	} catch (error) {
		if (isUnauthorizedError(error) && refreshAuth) {
			const freshToken = await refreshAuth();
			return await makeGithubRequestWithToken<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
