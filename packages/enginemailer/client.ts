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
 * The REST API labels its JSON `application/octet-stream`, so the shared HTTP
 * client hands the body back as text. Parse it here, and raise anything that
 * is not JSON instead of returning a string the output schemas reject.
 */
export function parseEnginemailerBody(body: unknown): unknown {
	// `body` is whatever the transport returned: parsed JSON or raw text.
	if (typeof body !== 'string') return body;
	const text = body.replace(/^\uFEFF/, '').trim();
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		throw new EnginemailerAPIError(
			`Enginemailer returned a response that is not JSON: ${text.slice(0, 200)}`,
		);
	}
}

/**
 * Wraps an HTTP-level failure, keeping the provider's own message when the
 * body has one: the N8N API answers 500 with `{ "status": "failed",
 * "message": "Email not exists." }`, which ApiError reports only as
 * "Internal Server Error".
 */
export function toEnginemailerAPIError(error: ApiError): EnginemailerAPIError {
	let detail: unknown;
	try {
		detail = parseEnginemailerBody(error.body);
	} catch {
		detail = undefined;
	}
	const record =
		detail && typeof detail === 'object'
			? (detail as Record<string, unknown>)
			: undefined;
	const result =
		record?.Result && typeof record.Result === 'object'
			? (record.Result as Record<string, unknown>)
			: undefined;
	const providerMessage =
		typeof record?.message === 'string'
			? record.message
			: typeof result?.ErrorMessage === 'string'
				? result.ErrorMessage
				: undefined;
	return new EnginemailerAPIError(
		providerMessage || error.message,
		error.status,
		typeof record?.status === 'string' ? record.status : undefined,
		error.retryAfter,
	);
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

	let response: unknown;
	try {
		response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: ENGINEMAILER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw toEnginemailerAPIError(error);
		throw error;
	}
	const parsed = parseEnginemailerBody(response);
	assertEnginemailerSuccess(parsed);
	// T is the caller's declared shape; the endpoint output schema checks it.
	return parsed as T;
}
