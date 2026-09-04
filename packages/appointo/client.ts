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
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'AppointoAPIError';
	}
}

const APPOINTO_API_BASE = 'https://app.appointo.me/api';

const APPOINTO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeAppointoRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
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
		TOKEN: apiKey,
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
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: APPOINTO_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			const msg =
				typeof error.body === 'object' && error.body && 'message' in error.body
					? String((error.body as Record<string, unknown>).message)
					: error.message;
			throw new AppointoAPIError(
				msg || error.message,
				(error.body as Record<string, unknown>)?.code as string | undefined,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new AppointoAPIError(error.message);
		}
		throw new AppointoAPIError('Unknown error');
	}
}
