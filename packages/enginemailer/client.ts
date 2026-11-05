import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class EnginemailerAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'EnginemailerAPIError';
	}
}

export const ENGINEMAILER_API_BASE = 'https://api.enginemailer.com';

/**
 * The REST API answers HTTP 200 even when a call fails: the outcome is in
 * `Result.StatusCode` ("200", "201", "500"...) with `Result.ErrorMessage`.
 * batchUpdateStatus returns the same fields without the `Result` wrapper.
 * Anything outside 2xx is raised so callers never mistake a failure (for
 * example "API Key Not Found!") for a success.
 * @see https://enginemailer.zendesk.com/hc/en-us/articles/360000859651-Errors-for-Subscribers-API
 */
export function assertEnginemailerSuccess(response: unknown): void {
	// `response` is the raw JSON body; only its status fields are inspected.
	if (!response || typeof response !== 'object') return;
	const body = response as Record<string, unknown>;
	const outcome =
		body.Result && typeof body.Result === 'object'
			? (body.Result as Record<string, unknown>)
			: body;
	if (outcome.StatusCode === undefined || outcome.StatusCode === null) return;
	const code = Number(outcome.StatusCode);
	if (!Number.isFinite(code) || (code >= 200 && code < 300)) return;
	const status =
		typeof outcome.Status === 'string' ? outcome.Status : undefined;
	const message =
		typeof outcome.ErrorMessage === 'string' && outcome.ErrorMessage
			? outcome.ErrorMessage
			: (status ?? `Enginemailer request failed with status ${code}`);
	throw new EnginemailerAPIError(message, code, status);
}

/**
 * Transport-level retries stay off for both APIs: RATE_LIMIT_ERROR in
 * error-handlers.ts owns the retry budget (five tries, honouring Retry-After),
 * so a persistent 429 is not multiplied by a second retry loop here.
 */
export const ENGINEMAILER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeEnginemailerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Enginemailer exposes provider-defined JSON objects and arrays across
		// separate legacy and N8N APIs; endpoint schemas validate each body.
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | string[] | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ENGINEMAILER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			APIKey: apiKey,
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
		// activateSubscriber is a POST that reads `email` from the query string.
		query,
	};

	let response: T;
	try {
		response = await request<T>(config, requestOptions, {
			rateLimitConfig: ENGINEMAILER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new EnginemailerAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
	assertEnginemailerSuccess(response);
	return response;
}
