import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AppointoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'AppointoAPIError';
	}
}

const APPOINTO_API_BASE = 'https://app.appointo.me/api';

// ponytail: transport retries off; error-handlers.ts owns 429 retries
const APPOINTO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {},
};

export async function makeAppointoRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: object;
		query?: Record<
			string,
			string | number | boolean | string[] | number[] | undefined
		>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: APPOINTO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'APPOINTO-TOKEN': apiKey,
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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: APPOINTO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new AppointoAPIError(error.message);
		}
		throw new AppointoAPIError('Unknown error');
	}
}
