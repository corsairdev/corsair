import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class HunterioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HunterioAPIError';
	}
}

export const HUNTERIO_API_BASE = 'https://api.hunter.io/v2';

// Hunter throttles with 403 (not 429) and sets Retry-After; 429 signals an
// exhausted plan quota and cannot succeed on retry. Transport-level retries
// are therefore disabled (maxRetries 0) while 403 stays classified so the
// Retry-After value is parsed onto the ApiError for the plugin handler.
export const HUNTERIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
	isRateLimitError: (status: number) => status === 403,
};

export async function makeHunterioRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic
		// over a JSON record instead of a closed per-endpoint union.
		body?: Record<string, unknown>;
		query?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Every Hunter endpoint requires
	// the key, so fail fast with Corsair's missing-auth error instead of
	// sending a request that the provider answers with 401.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('hunterio', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: HUNTERIO_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Email finder (max_duration up to 20s) and multi-domain search can
		// exceed the shared 20s default.
		TIMEOUT: 30_000,
		HEADERS: {
			'Content-Type': 'application/json',
			...(apiKey ? { 'X-API-KEY': apiKey } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// Hunter accepts the key as the api_key query parameter; the same
		// key travels in the X-API-KEY header. Bodies are sent for every
		// method because DELETE /sequences/{id}/recipients documents a JSON
		// body.
		body: body !== undefined ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: {
			...(query ?? {}),
			...(apiKey ? { api_key: apiKey } : {}),
		},
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: HUNTERIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new HunterioAPIError('Unknown error');
	}
}
