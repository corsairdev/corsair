import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import type { RateLimitConfig } from '../../async-core/rate-limit';
import { ApiError } from '../../async-core/ApiError';
import { request } from '../../async-core/request';

export class SpotifyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'SpotifyAPIError';
	}
}

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const SPOTIFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeSpotifyRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: SPOTIFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: SPOTIFY_RATE_LIMIT_CONFIG,
		});

		if (
			response &&
			typeof response === 'object' &&
			'error' in response &&
			response.error
		) {
			const error = response.error as { message?: string; status?: number };
			throw new SpotifyAPIError(
				error.message || 'Spotify API error',
				undefined,
				error.status,
			);
		}

		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new SpotifyAPIError(error.message, undefined, error.status);
		}
		if (error instanceof SpotifyAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new SpotifyAPIError(error.message);
		}
		throw new SpotifyAPIError('Unknown error');
	}
}
