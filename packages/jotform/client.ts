import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class JotformAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'JotformAPIError';
	}
}

export const JOTFORM_API_BASE = 'https://api.jotform.com';
export const JOTFORM_EU_API_BASE = 'https://eu-api.jotform.com';
export const JOTFORM_HIPAA_API_BASE = 'https://hipaa-api.jotform.com';

// Jotform documents daily and per-minute rate limits. Rate limit responses return
// status 429 with Retry-After header. Rate limit retries are owned by the plugin
// error-handler, so transport-level retries are disabled (maxRetries: 0) while
// Retry-After extraction remains enabled.
export const JOTFORM_RATE_LIMIT_CONFIG: RateLimitConfig = {
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
};

export type JotformRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	baseUrl?: string;
	// unknown because request body payloads vary by endpoint (JSON or urlencoded form)
	body?: unknown;
	// unknown because multipart fields accept endpoint-specific payload values.
	formData?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	contentType?: string;
};

export const FORM_URLENCODED = 'application/x-www-form-urlencoded';

/**
 * Jotform's POST endpoints read PHP-style form fields, not JSON:
 * `{ submission: { 3: 'Ann', 4: { first: 'Ann' } } }` becomes
 * `submission[3]=Ann&submission[4][first]=Ann`, and arrays use indexes
 * (`questions[0][type]=control_textbox`). A `3_first` key inside a
 * submission becomes `[3][first]`, as the official SDKs send it.
 */
// unknown because each endpoint's fields were already validated by its input schema.
export function toJotformFormBody(fields: Record<string, unknown>): string {
	const params = new URLSearchParams();
	// unknown because field values nest arbitrarily (question settings, answers).
	const add = (key: string, value: unknown) => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			value.forEach((item, index) => add(`${key}[${index}]`, item));
			return;
		}
		if (typeof value === 'object') {
			for (const [childKey, child] of Object.entries(value)) {
				add(`${key}[${childKey}]`, child);
			}
			return;
		}
		params.append(key, String(value));
	};
	for (const [key, value] of Object.entries(fields)) add(key, value);
	return params.toString();
}

/** Splits `3_first` answer keys into `{ 3: { first } }`, matching the official SDKs. */
// unknown because answers are keyed by question ID with dynamic values.
export function nestSubmissionKeys(
	submission: Record<string, unknown>,
): Record<string, unknown> {
	// unknown because answers are keyed by question ID with dynamic values.
	const nested: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(submission)) {
		const match = /^(\d+)_(.+)$/.exec(key);
		if (!match) {
			nested[key] = value;
			continue;
		}
		const [, qid, sub] = match as unknown as [string, string, string];
		const existing = nested[qid];
		// unknown because the parent answer holds the other sub-fields of this question.
		const group: Record<string, unknown> =
			typeof existing === 'object' &&
			existing !== null &&
			!Array.isArray(existing)
				? (existing as Record<string, unknown>)
				: {};
		group[sub] = value;
		nested[qid] = group;
	}
	return nested;
}

// unknown because endpoint responses remain untrusted until their output schema validates them.
export function makeJotformEndpointRequest(
	context: { options: { baseUrl?: string } },
	endpoint: string,
	apiKey: string | undefined,
	options: JotformRequestOptions,
): Promise<unknown> {
	const baseUrl = context.options.baseUrl;
	return makeJotformRequest(
		endpoint,
		apiKey,
		baseUrl === undefined ? options : { ...options, baseUrl },
	);
}

// Jotform's error envelope fields that carry no request data. Everything else
// in an error body (echoed answers, emails, keys) is dropped.
const SAFE_ERROR_FIELDS = new Set([
	'responseCode',
	'message',
	'error',
	'content',
	'duration',
	'info',
	'limit-left',
]);

// unknown because provider error JSON can be any value and must be narrowed before traversal.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// unknown because the error body is untrusted JSON; only scalar envelope fields survive.
function safeErrorBody(data: unknown): unknown {
	if (typeof data === 'string') return data;
	if (!isRecord(data)) return undefined;
	// unknown because each kept value is a scalar of any JSON type.
	const kept: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data)) {
		if (!SAFE_ERROR_FIELDS.has(key)) continue;
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean' ||
			value === null
		) {
			kept[key] = value;
		}
	}
	return kept;
}

/** Core puts the whole JSON body into the message for unmapped statuses; keep only status and text. */
function safeErrorMessage(error: ApiError): string {
	if (!error.message.startsWith('Generic Error:')) return error.message;
	return `Generic Error: status: ${error.status}; status text: ${error.statusText}`;
}

export function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...requestOpts
	} = error.request;

	// unknown because the error response body can be any JSON structure returned by Jotform.
	const sanitizedBody: unknown = safeErrorBody(error.body);

	return new ApiError(
		{
			...requestOpts,
			url: requestOpts.url.split('?')[0] ?? requestOpts.url,
		},
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: sanitizedBody,
		},
		safeErrorMessage(error),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeJotformRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: JotformRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		baseUrl = JOTFORM_API_BASE,
		body,
		formData,
		query,
		contentType = 'application/json; charset=utf-8',
	} = options;

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Public callers pass undefined
	// instead, so only keyed endpoints hit this gate — they fail fast with
	// Corsair's missing-auth error instead of sending a keyless request.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('jotform', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey ? { APIKEY: apiKey } : {};

	const headers: Record<string, string> = {
		...authHeaders,
	};
	if (contentType) {
		headers['Content-Type'] = contentType;
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 30_000,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		formData,
		mediaType: contentType,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: JOTFORM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw sanitizeApiError(error);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new JotformAPIError('Unknown error occurred');
	}
}
