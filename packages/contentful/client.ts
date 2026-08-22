import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class ContentfulAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ContentfulAPIError';
	}
}

const CONTENTFUL_API_BASE = 'https://api.contentful.com';

export async function makeContentfulRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers = {} } = options;

	const config: OpenAPIConfig = {
		BASE: CONTENTFUL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/vnd.contentful.management.v1+json',
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/vnd.contentful.management.v1+json',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			'status' in error &&
			typeof error.status === 'number'
		) {
			const retryAfter =
				'retryAfter' in error && typeof error.retryAfter === 'number'
					? error.retryAfter
					: undefined;
			throw new ContentfulAPIError(
				error instanceof Error ? error.message : 'Contentful API error',
				error.status,
				retryAfter,
			);
		}
		throw new ContentfulAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}
