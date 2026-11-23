import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ProductboardJsonObject } from './endpoints/types';

export const PRODUCTBOARD_API_BASE = 'https://api.productboard.com/v2';

const PRODUCTBOARD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export async function makeProductboardRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: ProductboardJsonObject;
		query?: ProductboardJsonObject;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	if (apiKey.length === 0) {
		throw new AuthMissingError('productboard', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: PRODUCTBOARD_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: PRODUCTBOARD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Rejection values have no declared type; only core's ApiError is rebuilt.
		if (!(error instanceof ApiError)) throw error;
		const errors = safeProductboardErrors(error.body);
		const summary = errors
			.map((item) => item.title ?? item.code)
			.filter((text): text is string => typeof text === 'string')
			.join('; ');
		// Rebuild without the request body, query and URL query (they carry workspace content)
		// and without each error's `detail`, which can echo submitted values. Status, retry
		// metadata, error codes, titles and field pointers stay.
		throw new ApiError(
			{ method, url: endpoint },
			{
				url: `${PRODUCTBOARD_API_BASE}${endpoint}`,
				ok: false,
				status: error.status,
				statusText: `HTTP ${error.status}`,
				body: {
					...(typeof errorId(error.body) === 'string'
						? { id: errorId(error.body) }
						: {}),
					errors,
				},
			},
			`Productboard request failed with HTTP ${error.status}${summary ? `: ${summary}` : ''}`,
			{
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			},
		);
	}
}

type SafeProductboardError = {
	code?: string;
	title?: string;
	source?: { pointer?: string; parameter?: string };
};

// `unknown` because provider error bodies are untrusted JSON.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because provider error bodies are untrusted JSON.
function errorId(body: unknown): string | undefined {
	return isRecord(body) && typeof body.id === 'string' ? body.id : undefined;
}

// `unknown` because provider error bodies are untrusted JSON.
function safeProductboardErrors(body: unknown): SafeProductboardError[] {
	if (!isRecord(body) || !Array.isArray(body.errors)) return [];
	return body.errors.filter(isRecord).map((item) => {
		const source = isRecord(item.source) ? item.source : undefined;
		return {
			...(typeof item.code === 'string' ? { code: item.code } : {}),
			...(typeof item.title === 'string' ? { title: item.title } : {}),
			...(source &&
			(typeof source.pointer === 'string' ||
				typeof source.parameter === 'string')
				? {
						source: {
							...(typeof source.pointer === 'string'
								? { pointer: source.pointer }
								: {}),
							...(typeof source.parameter === 'string'
								? { parameter: source.parameter }
								: {}),
						},
					}
				: {}),
		};
	});
}
