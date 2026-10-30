import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ApiLabzAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'ApiLabzAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/** Live API Labz hub — `api.apilabz.com` does not resolve. */
const APILABZ_API_BASE = 'https://hub.apilabz.com';

const APILABZ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

type ApiLabzMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Authenticated request against hub.apilabz.com.
 * Auth is Bearer only — `x-api-key` alone returns 401.
 */
export async function makeApiLabzRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: ApiLabzMethod;
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: APILABZ_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: APILABZ_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ApiLabzAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new ApiLabzAPIError(error.message, undefined, { cause: error });
		}
		throw new ApiLabzAPIError('Unknown API Labz error');
	}
}
