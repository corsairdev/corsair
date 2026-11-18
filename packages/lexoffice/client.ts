import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	ApiResult,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LexofficeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LexofficeAPIError';
	}
}

export const LEXOFFICE_API_BASE = 'https://api.lexoffice.io/v1';

/**
 * Transport-level retries are disabled so Corsair's endpoint error handlers
 * own the retry policy while still extracting `Retry-After` for 429 handling.
 */
export const LEXOFFICE_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type LexofficeQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

/**
 * Drops `undefined` query parameters so omitted options are not sent as empty strings.
 */
export function compactQuery(
	query: Record<string, LexofficeQueryValue>,
): Record<string, LexofficeQueryValue> {
	const defined: Record<string, LexofficeQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return defined;
}

const SENSITIVE_FIELD_NAMES = new Set([
	'accesskeyid',
	'secretaccesskey',
	'sessiontoken',
	'privatekey',
	'clientemail',
	'projectid',
	'password',
	'authorization',
	'storageaccesskey',
	'sastoken',
	'apikey',
	'token',
	'secret',
]);

function isSensitiveField(name: string): boolean {
	const normalized = name.toLowerCase().replace(/[-_]/g, '');
	return SENSITIVE_FIELD_NAMES.has(normalized);
}

// `unknown` because untrusted JSON or object is inspected here
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because request and response bodies contain untrusted data
export function redactSensitiveData(value: unknown): unknown {
	if (typeof value === 'string') {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactSensitiveData(item));
	}
	if (isRecord(value)) {
		const out: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(value)) {
			if (isSensitiveField(key)) {
				out[key] = '[redacted]';
			} else {
				out[key] = redactSensitiveData(val);
			}
		}
		return out;
	}
	return value;
}

export function sanitizeApiError(error: ApiError): ApiError {
	const sanitizedRequest: ApiRequestOptions = {
		...error.request,
		body: error.request?.body ? redactSensitiveData(error.request.body) : undefined,
	};
	const sanitizedResponse: ApiResult = {
		status: error.status,
		statusText: error.statusText,
		url: error.url,
		ok: error.status >= 200 && error.status < 300,
		body: error.body ? redactSensitiveData(error.body) : undefined,
	};
	return new ApiError(
		sanitizedRequest,
		sanitizedResponse,
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export type LexofficeRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request bodies are verified by Zod before transmission
	body?: Record<string, unknown> | object;
	query?: Record<string, LexofficeQueryValue>;
};

export async function makeLexofficeRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: LexofficeRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('lexoffice', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: LEXOFFICE_API_BASE,
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
		query: query ? compactQuery(query) : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LEXOFFICE_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw sanitizeApiError(error);
		}
		if (error instanceof Error) {
			throw new LexofficeAPIError(error.message);
		}
		throw new LexofficeAPIError('Unknown error');
	}
}
