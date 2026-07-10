import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class NeonAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'NeonAPIError';
	}
}

const NEON_API_BASE = 'https://console.neon.tech/api/v2';

type NeonRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export type NeonAuthContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof NeonAPIError &&
		typeof error.code === 'number' &&
		error.code === 401
	);
}

async function makeNeonRequestWithToken<T>(
	endpoint: string,
	token: string,
	options: NeonRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: NEON_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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
			throw new NeonAPIError(
				error instanceof Error ? error.message : 'Neon API error',
				error.status,
			);
		}
		throw new NeonAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}

export async function makeNeonRequest<T>(
	endpoint: string,
	auth: string | NeonAuthContext,
	options: NeonRequestOptions = {},
): Promise<T> {
	const token = typeof auth === 'string' ? auth : auth.key;
	const refreshAuth = typeof auth === 'string' ? undefined : auth._refreshAuth;

	try {
		return await makeNeonRequestWithToken<T>(endpoint, token, options);
	} catch (error) {
		if (isUnauthorizedError(error) && refreshAuth) {
			const freshToken = await refreshAuth();
			return await makeNeonRequestWithToken<T>(
				endpoint,
				freshToken,
				options,
			);
		}
		throw error;
	}
}
