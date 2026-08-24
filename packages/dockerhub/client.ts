import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DockerHubAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DockerHubAPIError';
	}
}

/** Docker Hub HTTP API v2 host. */
export const DOCKER_HUB_BASE = 'https://hub.docker.com/v2';

export type DockerHubQueryValue = string | number | boolean | undefined;

export type DockerHubRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// body shape varies per endpoint; validated by callers via typed Zod input schemas
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, DockerHubQueryValue>;
	/** When true (default), send Authorization Bearer if token is non-empty. */
	bearer?: boolean;
	/**
	 * When true, treat HTTP 404 as a successful empty object (idempotent deletes).
	 */
	okOn404?: boolean;
};

/**
 * HTTP helper for Docker Hub API v2.
 * Auth: Personal Access Token (or JWT from users/login) as `Authorization: Bearer`.
 */
export async function makeDockerHubRequest<T>(
	endpoint: string,
	accessToken: string | undefined,
	options: DockerHubRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		bearer = true,
		okOn404 = false,
	} = options;

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	if (bearer && accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	const config: OpenAPIConfig = {
		BASE: DOCKER_HUB_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			(method === 'DELETE' && body !== undefined)
				? // cast: RequestOptions.body is Record | array; ApiRequestOptions.body is Record
					(body as Record<string, unknown>)
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: query as Record<string, string | number | boolean | undefined>,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			if (okOn404 && error.status === 404) {
				// cast: idempotent delete success payload is empty
				return { success: true, deleted: false } as T;
			}
			throw error;
		}
		if (error instanceof Error) {
			throw new DockerHubAPIError(error.message);
		}
		throw new DockerHubAPIError('Unknown Docker Hub API error');
	}
}

/**
 * Exchange username + PAT for a short-lived JWT (some org create endpoints).
 * POST /v2/users/login/
 */
export async function loginDockerHubJwt(
	username: string,
	passwordOrToken: string,
): Promise<string> {
	const result = await makeDockerHubRequest<{
		token?: string;
		access_token?: string;
	}>('/users/login/', undefined, {
		method: 'POST',
		bearer: false,
		body: { username, password: passwordOrToken },
	});
	const token = result.token ?? result.access_token;
	if (!token) {
		throw new DockerHubAPIError('Docker Hub login did not return a token');
	}
	return token;
}
