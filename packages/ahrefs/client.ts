import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AhrefsAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Using unknown because Ahrefs API error response bodies vary by endpoint
	// and error type, making a strict type infeasible without per-endpoint handling.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AhrefsAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

const AHREFS_API_BASE = 'https://api.ahrefs.com/v3';

const AHREFS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'X-RateLimit-Limit',
		remaining: 'X-RateLimit-Remaining',
		resetTime: 'X-RateLimit-Reset',
	},
};

export type AhrefsQueryValue = string | number | boolean | undefined;

export async function makeAhrefsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, AhrefsQueryValue>;
	} = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: AHREFS_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: options.query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: AHREFS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AhrefsAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new AhrefsAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new AhrefsAPIError('Unknown Ahrefs API error');
	}
}
