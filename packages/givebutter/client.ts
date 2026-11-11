import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GIVEBUTTER_API_BASE = 'https://api.givebutter.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class GivebutterAPIError extends Error {
	readonly status?: number;
	readonly body?: unknown;
	readonly retryAfter?: number;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'GivebutterAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

type RequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

/** Sends one documented Givebutter REST request with no automatic write retry. */
export async function makeGivebutterRequest<T>(
	endpoint: string,
	apiKey: string,
	{ method, body, query }: RequestOptions,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: GIVEBUTTER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		if (error instanceof GivebutterAPIError) throw error;
		if (error instanceof Error)
			throw new GivebutterAPIError(error.message, error);
		throw new GivebutterAPIError('Unknown Givebutter API error');
	}
}
