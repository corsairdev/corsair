import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class AttioAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AttioAPIError';
	}
}

const ATTIO_API_BASE = 'https://api.attio.com';

export const ATTIO_OAUTH_AUTH_URL = 'https://app.attio.com/authorize';
export const ATTIO_OAUTH_TOKEN_URL = 'https://app.attio.com/oauth/token';

export async function getValidAccessToken({
	accessToken,
}: {
	accessToken?: string | null;
}): Promise<{ accessToken: string; refreshed: boolean }> {
	if (!accessToken) {
		throw new AttioAPIError('Missing Attio access token');
	}
	return { accessToken, refreshed: false };
}

export async function makeAttioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ATTIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
	} catch (error: unknown) {
		if (error && typeof error === 'object' && 'status' in error) {
			throw error;
		}
		const err = error as { message?: string; status?: number; code?: string };
		const message =
			error instanceof Error
				? error.message
				: err?.message || String(error || 'Unknown error');
		throw new AttioAPIError(message, err?.status, err?.code);
	}
}

type AttioRequestContext = {
	key: string;
};

export async function makeAuthenticatedAttioRequest<T>(
	endpoint: string,
	ctx: AttioRequestContext,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	return await makeAttioRequest<T>(endpoint, ctx.key, options);
}
