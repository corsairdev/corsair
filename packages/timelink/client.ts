import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TimelinkAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;
	public readonly body?: unknown;

	constructor(message: string, cause?: ApiError) {
		super(message);
		this.name = 'TimelinkAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.retryAfter = cause.retryAfter;
			this.body = cause.body;
		}
	}
}

export const TIMELINK_API_BASE = 'https://api.timelink.io/api/v1';

// deletePerson is a non-idempotent DELETE; a transport-level retry on 429
// could replay the request after the provider already processed it. Disable
// nested retries entirely (matching the abuseipdb/byteforms convention); the
// error-handlers.ts handler classifies rate-limit responses instead.
const TIMELINK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeTimelinkRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TIMELINK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: TIMELINK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new TimelinkAPIError(error.message, error);
		}
		if (error instanceof Error) {
			throw new TimelinkAPIError(error.message);
		}
		throw new TimelinkAPIError('Unknown error');
	}
}
