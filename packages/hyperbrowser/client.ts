import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const HYPERBROWSER_API_BASE = 'https://api.hyperbrowser.ai';

const SENSITIVE_KEY_NAMES = new Set([
	'apikey',
	'xapikey',
	'key',
	'token',
	'password',
	'secret',
	'proxyserverpassword',
	'proxyserverusername',
	'authorization',
]);

function isSensitiveKey(key: string): boolean {
	return SENSITIVE_KEY_NAMES.has(key.toLowerCase().replace(/[-_]/g, ''));
}

// `unknown` because payload data can be any arbitrary JSON structure before schema validation.
export function redactCredentials(value: unknown, apiKey?: string): unknown {
	if (typeof value === 'string') {
		if (apiKey && apiKey.length > 0 && value.includes(apiKey)) {
			return value.split(apiKey).join('[redacted]');
		}
		return value;
	}
	if (Array.isArray(value)) {
		// `unknown` because array elements are untyped runtime items.
		return value.map((item: unknown) => redactCredentials(item, apiKey));
	}
	if (value !== null && typeof value === 'object') {
		// `unknown` because object values are untyped JSON records.
		const record = value as Record<string, unknown>;
		const copy: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(record)) {
			if (isSensitiveKey(k)) {
				copy[k] = '[redacted]';
			} else {
				copy[k] = redactCredentials(v, apiKey);
			}
		}
		return copy;
	}
	return value;
}

export function redactApiErrorInPlace(
	error: ApiError,
	apiKey?: string,
): ApiError {
	if (apiKey && apiKey.length > 0 && error.message.includes(apiKey)) {
		error.message = error.message.split(apiKey).join('[redacted]');
	}
	if (error.body !== undefined) {
		// `unknown` because ApiError body holds untyped error JSON that is mutated in-place.
		(error as { body: unknown }).body = redactCredentials(error.body, apiKey);
	}
	if (error.request?.body !== undefined) {
		// `unknown` because request body holds untyped payload JSON that is mutated in-place.
		(error.request as { body: unknown }).body = redactCredentials(
			error.request.body,
			apiKey,
		);
	}
	return error;
}

export async function makeHyperbrowserRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because request body is validated per-endpoint by Zod before passing to the generic transport.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Fail fast when an explicitly empty API key is provided.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('hyperbrowser', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { 'x-api-key': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: HYPERBROWSER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
		TIMEOUT: 60000,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			redactApiErrorInPlace(error, apiKey);
			throw error;
		}
		if (error instanceof Error) {
			if (apiKey && apiKey.length > 0 && error.message.includes(apiKey)) {
				error.message = error.message.split(apiKey).join('[redacted]');
			}
			throw error;
		}
		// `unknown` because rejection values can be non-Error primitives.
		throw error;
	}
}
