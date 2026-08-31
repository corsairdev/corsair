import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class NewsApiError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: unknown,
		/** Milliseconds to wait before retrying, from the provider's Retry-After header. */
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'NewsApiError';
	}
}

const NEWS_API_BASE = 'https://newsapi.org';

export async function makeNewsApiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: NEWS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-Api-Key': apiKey,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		mediaType: 'application/json; charset=utf-8',
		query: options.query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const body = error.body as
				| { code?: string; message?: string }
				| undefined;
			throw new NewsApiError(
				body?.message ?? error.message,
				body?.code,
				error.status,
				error.body,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new NewsApiError(error.message);
		}
		throw new NewsApiError('Unknown error');
	}
}
