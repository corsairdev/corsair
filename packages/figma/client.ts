import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FigmaAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'FigmaAPIError';
	}
}

const FIGMA_API_BASE = 'https://api.figma.com';

const FIGMA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeFigmaRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		authType?: 'api_key' | 'oauth_2' | 'managed';
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, authType = 'api_key' } = options;

	// api_key authenticates via Figma's X-Figma-Token header; request() turns
	// TOKEN into a bearer header for oauth/managed.
	const useBearer = authType !== 'api_key';

	const config: OpenAPIConfig = {
		BASE: FIGMA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: useBearer ? apiKey : undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			...(useBearer ? {} : { 'X-Figma-Token': apiKey }),
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
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: FIGMA_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new FigmaAPIError(error.message, error.status, error.retryAfter);
		}
		if (error instanceof Error) {
			throw new FigmaAPIError(error.message);
		}
		throw new FigmaAPIError('Unknown error');
	}
}
