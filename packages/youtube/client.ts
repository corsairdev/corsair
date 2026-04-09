import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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
const YOUTUBE_UPLOAD_API_BASE = 'https://www.googleapis.com/upload/youtube/v3';

export async function makeYoutubeRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
		mediaType?: string;
		upload?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType, upload } = options;

	const config: OpenAPIConfig = {
		BASE: upload ? YOUTUBE_UPLOAD_API_BASE : YOUTUBE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Bearer ${accessToken}`,
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
		mediaType: mediaType ?? 'application/json; charset=utf-8',
		query,
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
