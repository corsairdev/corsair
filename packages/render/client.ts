import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RenderAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'RenderAPIError';
	}
}

const RENDER_API_BASE = 'https://api.render.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeRenderRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Render request bodies differ by operation and are validated by the
		// corresponding endpoint schema before reaching this transport boundary.
		// Stricter typing is not feasible here because Render uses object bodies
		// for most writes and array bodies for replacement operations.
		// unknown: the endpoint schemas validate each provider-specific body.
		body?: /* unknown: provider-specific object or replacement-array body */
		Record<string, unknown> | unknown[];
		query?: Record<string, string | string[] | number | boolean | undefined>;
		headers?: Record<string, string>;
		mediaType?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType } = options;

	const config: OpenAPIConfig = {
		BASE: RENDER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: mediaType ?? 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new RenderAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}
