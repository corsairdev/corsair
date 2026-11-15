import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HubPlannerAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HubPlannerAPIError';
	}
}

export const HUBPLANNER_API_BASE = 'https://api.hubplanner.com/v1';

/**
 * Core's default 429 handling, minus the `x-ratelimit-reset` header. Hub Planner sends that header on
 * every response as the epoch second its daily quota (6000 calls) resets, so the default config would
 * sleep until the next day on a quota 429. Burst 429s carry `Retry-After`, which is still honoured.
 */
export const HUBPLANNER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

// `unknown` because provider error bodies are arbitrary JSON (or text).
function redactValue(value: unknown, apiKey: string): unknown {
	if (typeof value === 'string') return value.split(apiKey).join('[REDACTED]');
	if (Array.isArray(value))
		return value.map((item) => redactValue(item, apiKey));
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([k, v]) => [k, redactValue(v, apiKey)]),
		);
	}
	return value;
}

/**
 * Redacts API credentials in-place without replacing the ApiError instance.
 * Mutates headers and error message/body in-place so the original error type, HTTP status,
 * and retry headers remain intact for downstream retry logic and handlers.
 */
// `unknown` because catch blocks and untrusted error sources can produce any thrown value.
export function redactInPlace(error: unknown, apiKey?: string): void {
	// The submitted body (names, emails, notes) stays out of the error; status and headers stay.
	if (error instanceof ApiError && error.request && 'body' in error.request) {
		const { body: _submitted, ...requestWithoutBody } = error.request;
		Object.defineProperty(error, 'request', {
			value: requestWithoutBody,
			configurable: true,
			writable: true,
		});
	}
	if (!apiKey) return;

	if (error instanceof ApiError) {
		if (error.request?.headers) {
			if ('Authorization' in error.request.headers) {
				error.request.headers.Authorization = '[REDACTED]';
			}
			if ('authorization' in error.request.headers) {
				error.request.headers.authorization = '[REDACTED]';
			}
		}
		if (typeof error.message === 'string') {
			error.message = error.message.split(apiKey).join('[REDACTED]');
		}
		// Hub Planner echoes a rejected key in its JSON 401 body (`message` and
		// `properties.additionalInformation.authHeaders`), so objects are redacted as well as strings.
		if (error.body !== undefined && error.body !== null) {
			Object.defineProperty(error, 'body', {
				value: redactValue(error.body, apiKey),
				configurable: true,
				writable: true,
			});
		}
	} else if (error instanceof Error) {
		if (typeof error.message === 'string') {
			error.message = error.message.split(apiKey).join('[REDACTED]');
		}
	}
}

export async function makeHubPlannerRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because body payloads vary across endpoints and are validated by Zod before transmission.
		body?: Record<string, unknown> | Array<unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = HUBPLANNER_API_BASE,
	} = options;

	// Fail fast on explicitly empty key to avoid unauthenticated network calls
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('hubplanner', 'api_key');
	}

	// Hub Planner authentication: Authorization header with raw API key without 'Bearer' prefix
	const authHeaders: Record<string, string> = apiKey
		? { Authorization: apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			(method === 'DELETE' && body !== undefined)
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: HUBPLANNER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		redactInPlace(error, apiKey);
		if (error instanceof Error) {
			throw error;
		}
		throw new HubPlannerAPIError('Unknown error');
	}
}
