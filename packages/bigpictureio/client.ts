import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BigpictureioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BigpictureioAPIError';
	}
}

const BIGPICTUREIO_API_BASE = 'https://company.bigpicture.io';

const BIGPICTUREIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeBigpictureioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiKey) {
		throw new AuthMissingError('bigpictureio', 'api_key');
	}

	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: BIGPICTUREIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
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
		errors: {
			202: 'Company lookup is still processing',
		},
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BIGPICTUREIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError || error instanceof AuthMissingError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new BigpictureioAPIError(error.message);
		}
		throw new BigpictureioAPIError('Unknown error');
	}
}
