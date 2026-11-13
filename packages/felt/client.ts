import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FELT_API_BASE = 'https://felt.com/api/v2';

export class FeltAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` because Felt error responses contain provider JSON payloads that can vary.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: {
			status?: number;
			statusText?: string;
			// `unknown` because provider error JSON is untrusted until narrowed by callers.
			body?: unknown;
			retryAfter?: number;
			cause?: Error;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'FeltAPIError';
		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

const SENSITIVE_KEY_NAMES = new Set([
	'accesskeyid',
	'apikey',
	'authorization',
	'clientemail',
	'clientid',
	'clientsecret',
	'connectionstring',
	'credential',
	'key',
	'password',
	'passphrase',
	'privatekey',
	'privatekeypassphrase',
	'projectid',
	'sastoken',
	'secret',
	'secretaccesskey',
	'secretkey',
	'serviceaccountjson',
	'sessiontoken',
	'storageaccesskey',
	'token',
]);

function normalizeKeyName(key: string): string {
	return key.toLowerCase().replace(/[-_]/g, '');
}

/**
 * Recursively redacts credentials and secrets from arbitrary objects,
 * error payloads, and request records before propagation.
 */
// `unknown` because arbitrary JSON payloads can contain any nested structure.
export function redactSensitiveData(value: unknown): unknown {
	if (value === null || value === undefined) {
		return value;
	}
	if (typeof value !== 'object') {
		return value;
	}
	if (Array.isArray(value)) {
		// `unknown` because array items are untyped JSON elements.
		return value.map((item: unknown) => redactSensitiveData(item));
	}
	// `unknown` because record values are untrusted JSON until traversed.
	const record = value as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(record)) {
		if (SENSITIVE_KEY_NAMES.has(normalizeKeyName(k))) {
			result[k] = '[REDACTED]';
		} else {
			result[k] = redactSensitiveData(v);
		}
	}
	return result;
}

/**
 * Redacts tokens, passwords, and sensitive strings from error messages.
 */
export function sanitizeErrorMessage(message: string, apiKey?: string): string {
	let sanitized = message
		.replace(/Bearer\s+[^\s"',]+/gi, 'Bearer [REDACTED]')
		.replace(
			/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
			'[REDACTED_JWT]',
		)
		.replace(
			/(["']?(?:api[_-]?key|token|secret|password|authorization|access_token|client_secret)["']?\s*[:=]\s*["']?)[^"',\s}]+/gi,
			'$1[REDACTED]',
		);

	if (apiKey && apiKey.length > 0) {
		sanitized = sanitized.split(apiKey).join('[REDACTED]');
	}

	return sanitized;
}

export async function makeFeltRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because request bodies are validated by Zod schemas before being sent.
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers = {} } = options;

	// Fail fast on empty key: throws AuthMissingError so tenant connect links work as expected.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('felt', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: FELT_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
			...headers,
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
	} catch (error: unknown) {
		// `unknown` because catch blocks in TypeScript receive an untyped rejection value.
		if (error instanceof ApiError) {
			const sanitizedBody = redactSensitiveData(error.body);
			const safeMessage = sanitizeErrorMessage(error.message, apiKey);
			throw new FeltAPIError(safeMessage, String(error.status), {
				status: error.status,
				statusText: error.statusText,
				body: sanitizedBody,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			const safeMessage = sanitizeErrorMessage(error.message, apiKey);
			throw new FeltAPIError(safeMessage);
		}
		throw new FeltAPIError('Unknown error');
	}
}
