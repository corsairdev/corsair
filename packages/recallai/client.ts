import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RecallaiAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'RecallaiAPIError';
	}
}

export const RECALLAI_API_BASE = 'https://us-west-2.recall.ai';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeRecallaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | string[] | number | boolean | undefined>;
		baseUrl?: string;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl = RECALLAI_API_BASE, headers } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new RecallaiAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}
