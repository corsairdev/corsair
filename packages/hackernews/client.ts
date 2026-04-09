import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class HackerNewsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HackerNewsAPIError';
	}
}

const HACKERNEWS_FIREBASE_BASE = 'https://hacker-news.firebaseio.com/v0';
const HACKERNEWS_ALGOLIA_BASE = 'https://hn.algolia.com/api/v1';

function buildConfig(base: string): OpenAPIConfig {
	return {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// HackerNews is a public API — no auth token required
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};
}

async function makeRequest<T>(
	base: string,
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Record<string, unknown> matches the ApiRequestOptions body type used across all plugins
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

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
		const response = await request<T>(buildConfig(base), requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new HackerNewsAPIError(error.message);
		}
		throw new HackerNewsAPIError('Unknown error');
	}
}

/**
 * Makes a request to the HackerNews Firebase API (items, stories, users, updates).
 * HackerNews is a public API — no authentication is required.
 */
export async function makeHackerNewsFirebaseRequest<T>(
	endpoint: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	return makeRequest<T>(HACKERNEWS_FIREBASE_BASE, endpoint, options);
}

/**
 * Makes a request to the HackerNews Algolia search API (search, items with comments, users).
 * HackerNews is a public API — no authentication is required.
 */
export async function makeHackerNewsAlgoliaRequest<T>(
	endpoint: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	return makeRequest<T>(HACKERNEWS_ALGOLIA_BASE, endpoint, options);
}
