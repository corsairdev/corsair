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
	isRateLimitError: (status: number, body: unknown) =>
		status === 403 && isHunterThrottleBody(body),
};

// Hunter also answers 403 for permanent refusals (`no_signals_access`,
// `no_opportunities_access`, `optional_ai_features_off`, ...). Only the
// throttle id `too_many_requests` is transient; a 403 whose body carries
// no error id is treated as a throttle, as before.
export function isHunterThrottleBody(body: unknown): boolean {
	const ids = hunterErrorIds(body);
	return ids.length === 0 || ids.includes('too_many_requests');
}

export function hunterErrorIds(body: unknown): string[] {
	if (body === null || typeof body !== 'object') return [];
	const errors = (body as { errors?: unknown }).errors;
	if (!Array.isArray(errors)) return [];
	return errors
		.map((entry) =>
			entry !== null && typeof entry === 'object'
				? (entry as { id?: unknown }).id
				: undefined,
		)
		.filter((id): id is string => typeof id === 'string');
}

export async function makeHunterioRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies and query parameters are endpoint-specific JSON (already validated by the zod
		// input schemas before send). Stricter typing is not feasible because makeHunterioRequest is a
		// shared transport called by 160 different endpoints with heterogeneous request shapes.
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
		// No fixed Content-Type: core adds it when a request has a body. The
		// API keys routes answer 401 to a GET that carries
		// `Content-Type: application/json` (checked 2026-11-21).
		HEADERS: {
			// Bearer works on every v2 route. X-API-KEY does not: the API keys
			// routes answer 401 "No user found for the API key supplied" to it.
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// The key travels only in the Authorization header so it never appears
		// in request URLs (and therefore in proxy/access logs). Bodies are
		// sent for every method because DELETE /sequences/{id}/recipients
		// documents a JSON body.
		body: body !== undefined ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: query ?? {},
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
