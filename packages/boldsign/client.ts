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
	authType?: 'oauth_2';
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
		// unknown values: the shared transport carries every endpoint's JSON
		// body, so a narrower type is not practical; each endpoint validates
		// its own shape with zod before calling.
		body?: Record<string, unknown> | FormData;
		query?: Record<string, QueryValue>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const key = typeof ctxOrKey === 'string' ? ctxOrKey : ctxOrKey.key;
	// OAuth 2.0 is the plugin's sole auth type, so every request carries the
	// access token as a Bearer token.
	const headers: Record<string, string> = {
		Authorization: `Bearer ${key}`,
	};

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
		// Query params ride along on every method: BoldSign mutation endpoints
		// carry their resource IDs in the query string (e.g. PATCH
		// /v1/document/extendExpiry?documentId=...), and the transport appends
		// options.query to the URL regardless of method.
		query,
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: BOLDSIGN_RATE_LIMIT_CONFIG,
	});
}
