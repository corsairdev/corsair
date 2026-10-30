import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

type BrevoAPIErrorOptions = {
	cause?: Error;
	status?: number;
	statusText?: string;
	body?: unknown;
	retryAfter?: number;
};

export class BrevoAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options: BrevoAPIErrorOptions = {},
	) {
		super(message, options);
		this.name = 'BrevoAPIError';

		if (options.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		} else {
			this.status = options.status;
			this.statusText = options.statusText;
			this.body = options.body;
			this.retryAfter = options.retryAfter;
		}
	}
}

const BREVO_API_BASE = 'https://api.brevo.com/v3';

export const BREVO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeBrevoRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('brevo', 'api_key');
	}

	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: BREVO_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BREVO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const errorBody = error.body;
			const message =
				typeof errorBody === 'object' &&
				errorBody !== null &&
				'message' in errorBody &&
				typeof errorBody.message === 'string'
					? errorBody.message
					: error.message;

			const code =
				typeof errorBody === 'object' &&
				errorBody !== null &&
				'code' in errorBody &&
				typeof errorBody.code === 'string'
					? errorBody.code
					: error.status?.toString();

			throw new BrevoAPIError(message, code, { cause: error });
		}

		if (error instanceof Error) {
			throw new BrevoAPIError(error.message);
		}

		throw new BrevoAPIError('Unknown error');
	}
}
