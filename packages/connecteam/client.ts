import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ConnecteamAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ConnecteamAPIError';
	}
}

const CONNECTEAM_API_BASE = 'https://api.connecteam.com';

/**
 * Plan limits are per account (SBP 5/min, Expert 100/min, Enterprise 200/min).
 * Docs: https://developer.connecteam.com/docs/rate-limiting-1
 */
const CONNECTEAM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		resetTime: 'x-ratelimit-minute-reset',
		remaining: 'x-ratelimit-minute-remaining',
		limit: 'x-ratelimit-minute-limit',
	},
};

export type ConnecteamRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<
		string,
		string | number | boolean | number[] | string[] | undefined
	>;
};

export async function makeConnecteamRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ConnecteamRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CONNECTEAM_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'X-API-KEY': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: CONNECTEAM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ConnecteamAPIError(error.message);
		}
		throw new ConnecteamAPIError('Unknown error');
	}
}
