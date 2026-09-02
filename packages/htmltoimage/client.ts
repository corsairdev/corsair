import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HtmlToImageAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;

	constructor(
		message: string,
		options: { status?: number; retryAfter?: number } = {},
	) {
		super(message);
		this.name = 'HtmlToImageAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
	}
}

const HTMLTOIMAGE_API_BASE = 'https://app.html2img.com';

export async function makeHtmlToImageRequest<T>(
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
		BASE: HTMLTOIMAGE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-API-Key': apiKey,
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
			throw error;
		}
		if (error instanceof HtmlToImageAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new HtmlToImageAPIError(error.message);
		}
		throw new HtmlToImageAPIError('Unknown error');
	}
}
