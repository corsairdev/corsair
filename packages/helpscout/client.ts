import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HelpScoutAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HelpScoutAPIError';
	}
}

export const HELPSCOUT_API_BASE = 'https://api.helpscout.net/v2';

const SENSITIVE_KEY_NAMES = new Set([
	'authorization',
	'apikey',
	'token',
	'accesstoken',
	'secret',
	'clientsecret',
	'password',
	'auth',
]);

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[-_]/g, '');
	for (const sensitive of SENSITIVE_KEY_NAMES) {
		if (normalized.includes(sensitive)) return true;
	}
	return false;
}

function redactString(text: string, secrets: string[]): string {
	let result = text;
	for (const secret of secrets) {
		if (secret && secret.length > 0) {
			result = result.split(secret).join('[redacted]');
		}
	}
	result = result.replace(
		/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
		'Bearer [redacted]',
	);
	return result;
}

// `unknown` because payload bodies and provider error payloads have arbitrary JSON structures.
export function redactValue(value: unknown, secrets: string[]): unknown {
	if (typeof value === 'string') {
		return redactString(value, secrets);
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactValue(item, secrets));
	}
	if (value && typeof value === 'object') {
		// `unknown` because object values are untrusted JSON until traversed.
		const obj = value as Record<string, unknown>;
		const sanitized: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(obj)) {
			if (isSensitiveKey(k)) {
				sanitized[k] = '[redacted]';
			} else {
				sanitized[k] = redactValue(v, secrets);
			}
		}
		return sanitized;
	}
	return value;
}

/**
 * Redacts credentials in-place on the caught `ApiError` without replacing the instance,
 * ensuring `error instanceof ApiError` and its status/retryAfter properties survive.
 */
export function redactApiErrorInPlace(error: ApiError, apiKey?: string): void {
	const secrets = apiKey ? [apiKey] : [];
	if (error.message) {
		error.message = redactString(error.message, secrets);
	}
	if (error.body !== undefined) {
		// `unknown` because provider response bodies are untrusted JSON.
		const redactedBody: unknown = redactValue(error.body, secrets);
		// Mutate in-place so status/retryAfter and identity are preserved.
		(error as { body: unknown }).body = redactedBody;
	}
	if (error.request) {
		const mutableRequest = error.request as {
			headers?: Record<string, string>;
			// `unknown` because request bodies can be arbitrary JSON.
			body?: unknown;
		};
		if (error.request.headers) {
			const headers = { ...error.request.headers };
			for (const h of Object.keys(headers)) {
				if (isSensitiveKey(h)) {
					headers[h] = '[redacted]';
				}
			}
			mutableRequest.headers = headers;
		}
		if (error.request.body !== undefined) {
			// `unknown` because request bodies can be arbitrary records or strings.
			const redactedReqBody: unknown = redactValue(error.request.body, secrets);
			mutableRequest.body = redactedReqBody;
		}
	}
}

export async function makeHelpscoutRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic.
		// `unknown` because request bodies can be arbitrary JSON objects or arrays.
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Fail fast on an explicitly empty key; public or keyless callers pass undefined.
	if (apiKey !== undefined && apiKey.trim().length === 0) {
		throw new AuthMissingError('helpscout', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: HELPSCOUT_API_BASE,
		VERSION: '2.0',
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
		const res = await request<T>(config, requestOptions);
		if (typeof res === 'string') {
			try {
				return JSON.parse(res) as T;
			} catch {
				return res as T;
			}
		}
		return res;
	} catch (error) {
		if (error instanceof ApiError) {
			redactApiErrorInPlace(error, apiKey);
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new HelpScoutAPIError('Unknown Help Scout error');
	}
}
