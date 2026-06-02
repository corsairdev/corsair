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
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, authType = 'api_key' } = options;

	const config: OpenAPIConfig = {
		BASE: FIGMA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: authType === 'oauth_2' ? apiKey : undefined,
		HEADERS:
			authType === 'api_key'
				? {
						'Content-Type': 'application/json',
						'X-Figma-Token': apiKey,
					}
				: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${apiKey}`,
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
