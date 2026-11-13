import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MOTION_API_BASE = 'https://api.usemotion.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class MotionAPIError extends Error {
	readonly status?: number;
	// ApiError.body is provider-controlled JSON, so it cannot safely be narrowed before
	// Motion publishes a stable error payload schema.
	readonly body?: unknown;
	readonly retryAfter?: number;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'MotionAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

type RequestOptions = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	// Endpoint schemas accept provider-specific JSON objects with varying documented fields.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | string[] | undefined>;
};

/** Sends one documented Motion REST request with no automatic write retry. */
export async function makeMotionRequest<T>(
	endpoint: string,
	apiKey: string,
	{ method, body, query }: RequestOptions,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: MOTION_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'X-API-Key': apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: body ? 'application/json' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw error;
		if (error instanceof MotionAPIError) throw error;
		if (error instanceof Error) throw new MotionAPIError(error.message, error);
		throw new MotionAPIError('Unknown Motion API error');
	}
}
