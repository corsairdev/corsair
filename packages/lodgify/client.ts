import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LodgifyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LodgifyAPIError';
	}
}

export const LODGIFY_API_BASE = 'https://api.lodgify.com';

// Let Corsair's endpoint error handler own 429 retries.
// Keep header extraction enabled with zero transport retries so the handler
// still receives Lodgify's Retry-After value instead of a fixed delay.
export const LODGIFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

const SENSITIVE_FIELD_NAMES = new Set([
	'apikey',
	'api_key',
	'key',
	'token',
	'secret',
	'password',
	'authorization',
	'xapikey',
	'x-apikey',
]);

function isSensitiveField(field: string): boolean {
	const normalized = field.toLowerCase().replace(/[-_]/g, '');
	return SENSITIVE_FIELD_NAMES.has(normalized);
}

// `unknown` because request and response payloads are arbitrary JSON values traversed recursively
function sanitizeValue(value: unknown, secrets: string[]): unknown {
	if (typeof value === 'string') {
		let result = value;
		for (const secret of secrets) {
			if (secret.length >= 4) {
				result = result.split(secret).join('[REDACTED]');
			}
		}
		return result;
	}
	if (Array.isArray(value)) {
		// `unknown` because array elements may be of any JSON value
		return value.map((item: unknown) => sanitizeValue(item, secrets));
	}
	if (value !== null && typeof value === 'object') {
		// `unknown` because record values need recursive sanitization
		const record = value as Record<string, unknown>;
		const sanitized: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(record)) {
			if (isSensitiveField(k)) {
				sanitized[k] = '[REDACTED]';
			} else {
				sanitized[k] = sanitizeValue(v, secrets);
			}
		}
		return sanitized;
	}
	return value;
}

export function sanitizeApiError(error: ApiError, apiKey?: string): ApiError {
	const secrets: string[] = [];
	if (apiKey && apiKey.length >= 4) {
		secrets.push(apiKey);
	}

	const { body: _body, headers: _headers, ...cleanRequest } = error.request;

	// `unknown` because the sanitized body maintains the structure of the provider error body
	const sanitizedBody: unknown = sanitizeValue(error.body, secrets);

	const sanitizedError = new ApiError(
		{
			...cleanRequest,
			url: error.request.url.split('?')[0] ?? error.request.url,
		},
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: error.status >= 200 && error.status < 300,
			status: error.status,
			statusText: error.statusText,
			body: sanitizedBody,
		},
		typeof error.message === 'string'
			? (sanitizeValue(error.message, secrets) as string)
			: error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);

	if (error.stack) {
		sanitizedError.stack = sanitizeValue(error.stack, secrets) as string;
	}

	return sanitizedError;
}

export async function makeLodgifyRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because endpoint request body is validated by input schemas before send
		body?: Record<string, unknown> | unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Public callers pass undefined
	// instead, so only keyed endpoints hit this gate.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('lodgify', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { 'X-ApiKey': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: LODGIFY_API_BASE,
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
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LODGIFY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error, apiKey);
		if (error instanceof Error) {
			throw new LodgifyAPIError(error.message);
		}
		throw new LodgifyAPIError('Unknown Lodgify error');
	}
}
