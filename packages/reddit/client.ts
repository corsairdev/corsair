import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class RedditAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'RedditAPIError';
	}
}

const REDDIT_BASE = 'https://www.reddit.com';
const USER_AGENT = 'corsair-reddit';

export async function makeRedditRequest<T>(
	endpoint: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', query } = options;

	const config: OpenAPIConfig = {
		BASE: REDDIT_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'User-Agent': USER_AGENT,
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: method === 'GET' ? query : undefined,
		mediaType: 'application/json',
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new RedditAPIError(error.message);
		}
		throw new RedditAPIError('Unknown error');
	}
}
