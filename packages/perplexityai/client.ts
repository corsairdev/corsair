import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class PerplexityAiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: string | null,
	) {
		super(message);
		this.name = 'PerplexityAiAPIError';
	}
}

// API Base URL for Perplexity AI
const PERPLEXITYAI_API_BASE = 'https://api.perplexity.ai';

export async function makePerplexityAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: PERPLEXITYAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: any) {
		const status = error?.status;
		const retryAfter = error?.retryAfter;
		if (error instanceof Error) {
			throw new PerplexityAiAPIError(
				error.message,
				undefined,
				status,
				retryAfter,
			);
		}
		throw new PerplexityAiAPIError(
			'Unknown error',
			undefined,
			status,
			retryAfter,
		);
	}
}
