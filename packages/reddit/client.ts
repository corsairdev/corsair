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
const USER_AGENT = `corsair-reddit`;

function buildConfig(): OpenAPIConfig {
	return {
		BASE: REDDIT_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'User-Agent': USER_AGENT,
			Accept: 'application/json',
		},
	};
}

async function makeRequest<T>(
	endpoint: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: method === 'GET' ? query : undefined,
		mediaType: 'application/json',
	};

	try {
		const response = await request<T>(buildConfig(), requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new RedditAPIError(error.message);
		}
		throw new RedditAPIError('Unknown error');
	}
}

/**
 * Makes a request to a subreddit endpoint.
 */
export async function makeRedditSubredditRequest<T>(
	subreddit: string,
	path: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	return makeRequest<T>(`/r/${subreddit}/${path}.json`, options);
}

/**
 * Makes a request to a user endpoint.
 */
export async function makeRedditUserRequest<T>(
	username: string,
	path: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	return makeRequest<T>(`/user/${username}/${path}.json`, options);
}

/**
 * Makes a request to a post/comment endpoint.
 */
export async function makeRedditPostRequest<T>(
	postId: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	return makeRequest<T>(`/comments/${postId}.json`, options);
}

/**
 * Makes a request to a global Reddit endpoint (search, feeds, subreddit listings, by_id, etc.).
 */
export async function makeRedditGlobalRequest<T>(
	endpoint: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	return makeRequest<T>(endpoint, options);
}
