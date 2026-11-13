import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GIGASHEET_API_BASE = 'https://api.gigasheet.com';

const SENSITIVE_KEY_NAMES = new Set([
	'accesskeyid',
	'apikey',
	'authorization',
	'clientemail',
	'password',
	'privatekey',
	'projectid',
	'sastoken',
	'secret',
	'secretaccesskey',
	'sessiontoken',
	'storageaccesskey',
	'token',
	'xgigasheettoken',
]);

function normalizeKeyName(key: string): string {
	return key.toLowerCase().replace(/[-_]/g, '');
}

/**
 * Deeply redacts sensitive keys from objects and error payloads.
 */
// `unknown` because provider response bodies or request payloads can be arbitrary JSON values.
export function redactSensitiveData(data: unknown): unknown {
	if (data === null || data === undefined) return data;
	if (typeof data !== 'object') return data;
	if (Array.isArray(data)) {
		// `unknown` because array elements may be arbitrary untrusted JSON structures.
		return data.map((item: unknown) => redactSensitiveData(item));
	}
	// `unknown` because record values are untrusted and need recursive checking.
	const record = data as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(record)) {
		if (SENSITIVE_KEY_NAMES.has(normalizeKeyName(key))) {
			result[key] = '[REDACTED]';
		} else {
			result[key] = redactSensitiveData(value);
		}
	}
	return result;
}

export class GigasheetAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;
	// `unknown` because error payload from provider can take varying shapes.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			status?: number;
			retryAfter?: number;
			// `unknown` because error response payload from provider is untyped until inspected.
			body?: unknown;
		} = {},
	) {
		super(message);
		this.name = 'GigasheetAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.body = options.body;
	}
}

export async function makeGigasheetRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because request bodies are validated by Zod per-endpoint before reaching transport.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Fail fast when an explicitly empty key is provided for authenticated requests
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('gigasheet', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { 'X-GIGASHEET-TOKEN': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: GIGASHEET_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method !== 'GET' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			// Redact sensitive credentials in-place from the original error
			// to preserve the original error instance, stack, status, and retryAfter per R8.
			(error as { body: unknown }).body = redactSensitiveData(error.body);
			if (error.request) {
				(error.request as { body?: unknown }).body = body
					? redactSensitiveData(body)
					: undefined;
			}
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new GigasheetAPIError('Unknown error occurred');
	}
}
