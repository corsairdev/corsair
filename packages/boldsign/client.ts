import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class BoldsignAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BoldsignAPIError';
	}
}

const BOLDSIGN_API_BASE = 'https://api.boldsign.com';

const BOLDSIGN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type BoldsignRequestContext = {
	key: string;
	authType?: 'api_key' | 'oauth_2';
};

type QueryValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<string | number | boolean>;

export async function makeBoldsignRequest<T>(
	endpoint: string,
	ctxOrKey: string | BoldsignRequestContext,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | FormData;
		query?: Record<string, QueryValue>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const key = typeof ctxOrKey === 'string' ? ctxOrKey : ctxOrKey.key;
	const authType =
		typeof ctxOrKey === 'string' ? 'api_key' : (ctxOrKey.authType ?? 'api_key');

	const headers: Record<string, string> =
		authType === 'oauth_2'
			? { Authorization: `Bearer ${key}` }
			: { 'X-API-KEY': key };

	if (!(typeof FormData !== 'undefined' && body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
	}

	const config: OpenAPIConfig = {
		BASE: BOLDSIGN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType:
			typeof FormData !== 'undefined' && body instanceof FormData
				? undefined
				: 'application/json; charset=utf-8',
		query: method === 'GET' ? (query as Record<string, unknown>) : undefined,
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: BOLDSIGN_RATE_LIMIT_CONFIG,
	});
}
