import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BuiltWithAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BuiltWithAPIError';
	}
}

const BUILTWITH_API_BASE = 'https://api.builtwith.com';

export async function makeBuiltWithRequest<T>(
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
		BASE: BUILTWITH_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// BuiltWith authenticates with `Authorization: API <key>` — not Bearer.
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `API ${apiKey}`,
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
		// ApiError carries status and rate-limit headers for error-handlers.ts.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new BuiltWithAPIError(error.message);
		}
		throw new BuiltWithAPIError('Unknown error');
	}
}
