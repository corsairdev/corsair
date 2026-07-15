import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { NeonMethod } from './endpoints/operations';

export class NeonAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'NeonAPIError';
	}
}

const NEON_API_BASE = 'https://console.neon.tech/api/v2';

export type NeonRequestOptions = {
	method?: NeonMethod;
	// bodies and query values are operation-specific json; the neon api
	// validates their shape, so they intentionally stay unknown here
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export async function makeNeonRequest<T>(
	endpoint: string,
	apiKey: string,
	options: NeonRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers,
		baseUrl = NEON_API_BASE,
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TOKEN is the single source of auth: corsair/http builds the
		// `Authorization: Bearer` header from it on every request
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...headers,
		},
	};

	const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new NeonAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}
