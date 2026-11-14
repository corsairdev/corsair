import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HoneyHiveAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HoneyHiveAPIError';
	}
}

export const HONEYHIVE_API_BASE = 'https://api.honeyhive.ai';
export const HONEYHIVE_DEFAULT_TIMEOUT = 20000;

const SENSITIVE_KEY_NAMES = new Set([
	'accesskeyid',
	'secretaccesskey',
	'sessiontoken',
	'privatekey',
	'clientemail',
	'password',
	'authorization',
	'storageaccesskey',
	'sastoken',
	'apikey',
	'token',
	'secret',
]);

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[_-]/g, '');
	return SENSITIVE_KEY_NAMES.has(normalized);
}

// `unknown` because payload data is arbitrary JSON that must be inspected and sanitized recursively.
export function redactSensitiveData(value: unknown, apiKey?: string): unknown {
	if (value === null || value === undefined) return value;
	if (typeof value === 'string') {
		if (apiKey && apiKey.length > 0 && value.includes(apiKey)) {
			return value.split(apiKey).join('[REDACTED]');
		}
		return value;
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactSensitiveData(item, apiKey));
	}
	if (typeof value === 'object') {
		// `unknown` because record properties are untyped incoming JSON.
		const record = value as Record<string, unknown>;
		const sanitized: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(record)) {
			if (isSensitiveKey(k)) {
				sanitized[k] = '[REDACTED]';
			} else {
				sanitized[k] = redactSensitiveData(v, apiKey);
			}
		}
		return sanitized;
	}
	return value;
}

export function redactApiErrorInPlace(
	error: ApiError,
	apiKey?: string,
): ApiError {
	// In-place credential redaction preserves the original ApiError instance and prototype.
	if (error.body !== undefined && error.body !== null) {
		// `unknown` because error.body has an unconstrained shape that is mutated in-place here.
		const mutableError = error as unknown as { body: unknown };
		mutableError.body = redactSensitiveData(error.body, apiKey);
	}
	if (error.request?.body !== undefined && error.request?.body !== null) {
		// `unknown` because error.request.body has an unconstrained shape that is mutated in-place here.
		const mutableRequest = error.request as unknown as { body: unknown };
		mutableRequest.body = redactSensitiveData(error.request.body, apiKey);
	}
	if (apiKey && apiKey.length > 0 && error.message.includes(apiKey)) {
		// `unknown` because error.message is read-only on the class declaration and mutated here.
		const mutableError = error as unknown as { message: string };
		mutableError.message = error.message.split(apiKey).join('[REDACTED]');
	}
	return error;
}

export type HoneyHiveRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	baseUrl?: string;
	// `unknown` because bodies are endpoint-specific payloads validated before transport.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
	timeout?: number;
};

export async function makeHoneyHiveRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: HoneyHiveRequestOptions = {},
): Promise<T> {
	const { method = 'GET', baseUrl, body, query, timeout } = options;

	// Fail fast when an empty string key is provided on authenticated endpoints.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('honeyhive', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? HONEYHIVE_API_BASE,
		VERSION: '1.17.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeout ?? HONEYHIVE_DEFAULT_TIMEOUT,
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// `unknown` cast because ApiRequestOptions.body accepts arbitrary serializable payload.
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? (body as Record<string, unknown>)
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
		// `unknown` because a caught rejection value has no static type; runtime checks narrow it below.
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			throw redactApiErrorInPlace(error, apiKey);
		}
		if (error instanceof Error) {
			throw error;
		}
		// `unknown` because a non-Error caught value has no static type.
		throw new HoneyHiveAPIError('Unknown error');
	}
}
