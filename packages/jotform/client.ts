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

const SENSITIVE_KEY_PATTERNS = [
	'apikey',
	'api_key',
	'key',
	'password',
	'token',
	'secret',
	'authorization',
];

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[_-]/g, '');
	return SENSITIVE_KEY_PATTERNS.some((pattern) =>
		normalized.includes(pattern.replace(/[_-]/g, '')),
	);
}

// unknown because provider error JSON can be any value and must be narrowed before traversal.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// unknown because arbitrary JSON values from provider errors must be inspected and sanitized recursively.
function redactSensitiveData(data: unknown): unknown {
	if (data === null || data === undefined) return data;
	if (typeof data === 'string') {
		// Avoid leaking secrets embedded in error messages
		return data;
	}
	if (Array.isArray(data)) {
		return data.map((item) => redactSensitiveData(item));
	}
	if (isRecord(data)) {
		const result: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(data)) {
			if (isSensitiveKey(k)) {
				result[k] = '[REDACTED]';
			} else {
				result[k] = redactSensitiveData(v);
			}
		}
		return result;
	}
	return data;
}

export function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...requestOpts
	} = error.request;

	// unknown because the error response body can be any JSON structure returned by Jotform.
	const sanitizedBody: unknown = redactSensitiveData(error.body);

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
		error.message,
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
