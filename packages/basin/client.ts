import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BasinAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'BasinAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const BASIN_API_BASE = 'https://usebasin.com/api/v1';

export const BASIN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type BasinQuery = Record<string, string | number | boolean | undefined>;

export type BasinRequestBody = Record<string, unknown> | readonly unknown[];

export type BasinRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: BasinRequestBody;
	query?: BasinQuery;
};

export async function makeBasinRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BasinRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Basin accepts exactly one scheme: `Authorization: Token <key>`. It answers
	// a Bearer header with 401 invalid_token. Strip either prefix a caller may
	// have pasted in with the key and always emit the Token form, so a stored
	// credential like "Bearer abc" cannot silently fail every request.
	const bareKey = apiKey.replace(/^(?:Bearer|Token)\s+/i, '');
	const authHeader = `Token ${bareKey}`;

	const config: OpenAPIConfig = {
		BASE: BASIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Deliberately no TOKEN. The shared transport turns TOKEN into an
		// `Authorization: Bearer …` header and applies it *after* config.HEADERS,
		// so setting it here overwrites the scheme Basin actually requires.
		// Basin accepts `Authorization: Token <key>` and answers `Bearer` with
		// 401 invalid_token, which made every request fail.
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: authHeader,
		},
	};

	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const requestOptions: ApiRequestOptions = {
		method,
		url: `/${cleanEndpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const res = await request<T>(config, requestOptions, {
			rateLimitConfig: BASIN_RATE_LIMIT_CONFIG,
		});
		if (res === undefined) {
			return { success: true } as unknown as T;
		}
		return res;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BasinAPIError(
				error.message,
				error.status === undefined ? undefined : String(error.status),
				{ cause: error },
			);
		}
		if (error instanceof Error) {
			throw new BasinAPIError(error.message, undefined, { cause: error });
		}
		throw new BasinAPIError('Unknown Basin error');
	}
}
