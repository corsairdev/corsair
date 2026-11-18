import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ListennotesAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ListennotesAPIError';
	}
}

/**
 * Base URL for Listen Notes API v2.
 * Official docs: https://www.listennotes.com/api/docs/
 */
export const LISTENNOTES_API_BASE = 'https://listen-api.listennotes.com/api/v2';

/**
 * Handler owns rate-limit retries; transport retries are set to 0 while
 * preserving Retry-After extraction.
 */
export const LISTENNOTES_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type ListennotesQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

export type ListennotesRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	// unknown because request bodies are validated by endpoint input schemas before invocation.
	body?: Record<string, unknown>;
	query?: Record<string, ListennotesQueryValue>;
};

/**
 * Drops `undefined` query parameters so empty values are not serialized.
 */
export function compactQuery(
	query: Record<string, ListennotesQueryValue>,
): Record<string, ListennotesQueryValue> {
	const defined: Record<string, ListennotesQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return defined;
}

const SENSITIVE_KEYS = new Set([
	'x-listenapi-key',
	'authorization',
	'apikey',
	'api_key',
	'token',
	'secret',
	'password',
]);

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[-_]/g, '');
	return (
		SENSITIVE_KEYS.has(key.toLowerCase()) ||
		normalized.includes('apikey') ||
		normalized.includes('token') ||
		normalized.includes('secret')
	);
}

// unknown because provider error responses are untrusted and unvalidated until inspected.
function redactSensitiveData(value: unknown): unknown {
	if (typeof value === 'string') {
		return value;
	}
	if (Array.isArray(value)) {
		// unknown because array elements inside arbitrary JSON structures have unknown shapes.
		return value.map((entry: unknown) => redactSensitiveData(entry));
	}
	if (typeof value === 'object' && value !== null) {
		// unknown because nested object property values are untyped until recursively inspected.
		const redacted: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) {
			if (isSensitiveKey(k)) {
				redacted[k] = '[REDACTED]';
			} else {
				redacted[k] = redactSensitiveData(v);
			}
		}
		return redacted;
	}
	return value;
}

// unknown because error rejections have no static type before runtime inspection.
export function sanitizeApiError(error: unknown): unknown {
	if (!(error instanceof ApiError)) return error;

	const headers = error.request.headers
		? Object.fromEntries(
				Object.entries(error.request.headers).map(([k, v]) => [
					k,
					isSensitiveKey(k) ? '[REDACTED]' : v,
				]),
			)
		: undefined;

	const query = error.request.query
		? Object.fromEntries(
				Object.entries(error.request.query).map(([k, v]) => [
					k,
					isSensitiveKey(k) ? '[REDACTED]' : v,
				]),
			)
		: undefined;

	const sanitizedRequest: ApiRequestOptions = {
		...error.request,
		headers,
		query,
		// unknown because body is an untyped error payload that must be recursively redacted.
		body: redactSensitiveData(error.request.body) as
			| Record<string, unknown>
			| undefined,
	};

	const sanitized = new ApiError(
		sanitizedRequest,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: redactSensitiveData(error.body),
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	sanitized.stack = error.stack;
	return sanitized;
}

export async function makeListennotesRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: ListennotesRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('listennotes', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { 'X-ListenAPI-Key': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: LISTENNOTES_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: query ? compactQuery(query) : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LISTENNOTES_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw sanitizeApiError(error);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new ListennotesAPIError('Unknown Listen Notes error');
	}
}
