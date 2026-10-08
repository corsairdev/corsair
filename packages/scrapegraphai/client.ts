import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ScrapegraphAiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'ScrapegraphAiAPIError';
	}
}

export class ScrapegraphAiRateLimitError extends ScrapegraphAiAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'ScrapegraphAiRateLimitError';
	}
}

/**
 * ScrapeGraphAI v1 REST API.
 * Official: https://docs.scrapegraphai.com/v1/api-reference/introduction
 * OpenAPI: https://api.scrapegraphai.com/openapi.json
 */
const SCRAPEGRAPHAI_API_BASE = 'https://api.scrapegraphai.com';

export type ScrapegraphAiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(error: ApiError): string {
	const bodyObj =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	const detail = bodyObj?.detail;
	if (typeof detail === 'string' && detail.length > 0) return detail;
	if (bodyObj && typeof bodyObj.message === 'string' && bodyObj.message) {
		return bodyObj.message;
	}
	if (bodyObj && typeof bodyObj.error === 'string' && bodyObj.error) {
		return bodyObj.error;
	}
	return error.message;
}

export async function makeScrapegraphAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ScrapegraphAiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	if (!apiKey || !apiKey.trim()) {
		throw new ScrapegraphAiAPIError('ScrapeGraphAI API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: SCRAPEGRAPHAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'SGAI-APIKEY': apiKey,
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? (body as Record<string, unknown>) : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new ScrapegraphAiRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new ScrapegraphAiAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new ScrapegraphAiAPIError(error.message);
		}
		throw new ScrapegraphAiAPIError('Unknown error');
	}
}
