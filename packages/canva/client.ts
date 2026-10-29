import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CanvaAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'CanvaAPIError';
	}
}

const CANVA_API_BASE = 'https://api.canva.com/rest';

const CANVA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function isBinaryBody(body: unknown): body is string | Blob {
	return (
		typeof body === 'string' ||
		(typeof Blob !== 'undefined' && body instanceof Blob)
	);
}

export async function makeCanvaRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | string | Blob;
		query?: Record<string, string | number | boolean | undefined>;
		extraHeaders?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, extraHeaders } = options;
	const binary = isBinaryBody(body);

	const config: OpenAPIConfig = {
		BASE: CANVA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			...(binary
				? { 'Content-Type': 'application/octet-stream' }
				: { 'Content-Type': 'application/json' }),
			...extraHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: binary
			? 'application/octet-stream'
			: 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: CANVA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const code =
				typeof error.body === 'object' &&
				error.body !== null &&
				'code' in error.body &&
				typeof (error.body as { code?: unknown }).code === 'string'
					? (error.body as { code: string }).code
					: undefined;
			throw new CanvaAPIError(
				error.message,
				error.status,
				error.retryAfter,
				code,
			);
		}
		if (error instanceof Error) {
			throw new CanvaAPIError(error.message);
		}
		throw new CanvaAPIError('Unknown error');
	}
}
