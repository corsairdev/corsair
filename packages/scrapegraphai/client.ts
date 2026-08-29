import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ScrapegraphAiAPIError extends Error {
	public readonly status?: number;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'ScrapegraphAiAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/**
 * ScrapeGraphAI's public REST API. Confirmed live 2026-08-29 against the
 * account's own OpenAPI document at https://api.scrapegraphai.com/openapi.json
 * and https://docs.scrapegraphai.com/services/smartscraper — every path
 * below lives under `/v1`.
 */
const SCRAPEGRAPHAI_API_BASE = 'https://api.scrapegraphai.com';

export async function makeScrapegraphAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (!apiKey || !apiKey.trim()) {
		throw new ScrapegraphAiAPIError('ScrapeGraphAI API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: SCRAPEGRAPHAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Auth is a plain `SGAI-APIKEY` header, not a Bearer token — leaving
		// TOKEN unset keeps the shared request layer from also adding an
		// `Authorization: Bearer ...` header alongside it.
		TOKEN: undefined,
		HEADERS: {
			'SGAI-APIKEY': apiKey,
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ScrapegraphAiAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new ScrapegraphAiAPIError(error.message);
		}
		throw new ScrapegraphAiAPIError('Unknown error');
	}
}
