import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PARSEUR_API_BASE = 'https://api.parseur.com';

export type ParseurQueryValue =
	| string
	| number
	| boolean
	| undefined
	| null
	| string[]
	| number[]
	| Record<string, string | number | boolean | undefined>;

export type ParseurRequestOptions = {
	apiKey?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, ParseurQueryValue>;
	headers?: Record<string, string>;
};

function formatAuthHeader(apiKey: string): string {
	if (apiKey.startsWith('Token ') || apiKey.startsWith('Bearer ')) {
		return apiKey;
	}
	return `Token ${apiKey}`;
}

function buildConfig(
	apiKey?: string,
	isWrite = false,
	customHeaders?: Record<string, string>,
): OpenAPIConfig {
	return {
		BASE: PARSEUR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(apiKey ? { Authorization: formatAuthHeader(apiKey) } : {}),
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
			...customHeaders,
		},
	};
}

async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError || error instanceof Error) {
		throw error;
	}
	throw new Error('Unknown Parseur API error');
}

export async function makeParseurRequest<T>(
	endpoint: string,
	options: ParseurRequestOptions = {},
): Promise<T> {
	const { apiKey, method = 'GET', body, query = {}, headers } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config = buildConfig(apiKey, isWrite, headers);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}
