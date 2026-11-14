import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HandwryttenAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HandwryttenAPIError';
	}
}

export const HANDWRYTTEN_API_BASE = 'https://api.handwrytten.com/v1';

const SENSITIVE_FIELD_NAMES = new Set([
	'authorization',
	'apikey',
	'token',
	'secret',
	'password',
	'login',
	'uid',
	'accesskeyid',
	'secretaccesskey',
	'sessiontoken',
	'privatekey',
	'clientemail',
	'projectid',
	'creditcardid',
	'couponcode',
]);

// `unknown` because request payloads can be arbitrary JSON primitives, arrays, or objects.
function redactValue(value: unknown): unknown {
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		value === null ||
		value === undefined
	) {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map(redactValue);
	}
	if (typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			const normalized = k.toLowerCase().replace(/[-_]/g, '');
			if (SENSITIVE_FIELD_NAMES.has(normalized)) {
				result[k] = '[REDACTED]';
			} else {
				result[k] = redactValue(v);
			}
		}
		return result;
	}
	return value;
}

export async function makeHandwryttenRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic
		// over a JSON record instead of a closed per-endpoint union.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = HANDWRYTTEN_API_BASE,
	} = options;

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Public callers pass undefined
	// instead, so only keyed endpoints hit this gate — they fail fast with
	// Corsair's missing-auth error instead of sending a keyless request.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('handwrytten', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: baseUrl,
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
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Redact sensitive credentials in-place without replacing ApiError, preserving status, retryAfter, etc.
		if (error instanceof ApiError) {
			if (error.request && error.request.body) {
				// `unknown` because request.body contains untrusted request JSON.
				(error.request as { body: unknown }).body = redactValue(
					error.request.body,
				);
			}
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new HandwryttenAPIError('Unknown error');
	}
}
