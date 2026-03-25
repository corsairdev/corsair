import { ApiError } from '../../async-core/ApiError';
import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';

export class YoutubeAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'YoutubeAPIError';
	}
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export async function makeYoutubeRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Values are untyped because this client sends arbitrary JSON bodies whose shape varies per endpoint
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: YOUTUBE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
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
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new YoutubeAPIError(error.message, error.status, error.retryAfter);
		}
		if (error instanceof Error) {
			throw new YoutubeAPIError(error.message);
		}
		throw new YoutubeAPIError('Unknown error');
	}
}
