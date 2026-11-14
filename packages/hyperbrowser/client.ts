import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const HYPERBROWSER_API_BASE = 'https://api.hyperbrowser.ai';

const SENSITIVE_KEY_NAMES = new Set([
	'apikey',
	'xapikey',
	'key',
	'token',
	'password',
	'secret',
	'proxypassword',
	'proxyserverpassword',
	'proxyserverusername',
	'authorization',
]);

function isSensitiveKey(key: string): boolean {
	return SENSITIVE_KEY_NAMES.has(key.toLowerCase().replace(/[-_]/g, ''));
}

// `unknown` because traversing arbitrary JSON structures.
function extractSensitiveValues(value: unknown): string[] {
	const secrets: string[] = [];
	// `unknown` because traversing nested runtime JSON values.
	function traverse(val: unknown) {
		if (val !== null && typeof val === 'object') {
			if (Array.isArray(val)) {
				// `unknown` because array elements are untyped runtime items.
				for (const item of val as unknown[]) traverse(item);
			} else {
				for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
					if (isSensitiveKey(k) && typeof v === 'string' && v.length > 0) {
						secrets.push(v);
					}
					traverse(v);
				}
			}
		}
	}
	traverse(value);
	return secrets;
}

function redactSecretsInString(text: string, secrets: string[]): string {
	let result = text;
	for (const secret of secrets) {
		if (secret.length > 0) {
			result = result.split(secret).join('[redacted]');
		}
	}
	result = result.replace(
		/(?:password|proxyserverpassword|proxypassword|secret|token|apikey|api_key|authorization)["']?\s*[:=]\s*["']?([^"',\s}{\]]+)/gi,
		(match, val) => match.replace(val, '[redacted]'),
	);
	return result;
}

// `unknown` because payload data can be any arbitrary JSON structure before schema validation.
export function redactCredentials(
	value: unknown,
	secretsOrKey?: string | string[],
): unknown {
	const secrets = Array.isArray(secretsOrKey)
		? secretsOrKey
		: secretsOrKey
			? [secretsOrKey]
			: [];

	if (typeof value === 'string') {
		return redactSecretsInString(value, secrets);
	}
	if (Array.isArray(value)) {
		// `unknown` because array elements are untyped runtime items.
		return value.map((item: unknown) => redactCredentials(item, secrets));
	}
	if (value !== null && typeof value === 'object') {
		// `unknown` because object values are untyped JSON records.
		const record = value as Record<string, unknown>;
		const copy: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(record)) {
			if (isSensitiveKey(k)) {
				copy[k] = '[redacted]';
			} else {
				copy[k] = redactCredentials(v, secrets);
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
	const secrets: string[] = [];
	if (apiKey && apiKey.length > 0) {
		secrets.push(apiKey);
	}
	if (error.request?.body !== undefined) {
		secrets.push(...extractSensitiveValues(error.request.body));
	}
	if (error.body !== undefined) {
		secrets.push(...extractSensitiveValues(error.body));
	}

	if (error.message) {
		error.message = redactSecretsInString(error.message, secrets);
	}
	if (error.statusText) {
		error.statusText = redactSecretsInString(error.statusText, secrets);
	}
	if (error.body !== undefined) {
		// `unknown` because ApiError body holds untyped error JSON that is mutated in-place.
		(error as { body: unknown }).body = redactCredentials(error.body, secrets);
	}
	if (error.request?.body !== undefined) {
		// `unknown` because request body holds untyped payload JSON that is mutated in-place.
		(error.request as { body: unknown }).body = redactCredentials(
			error.request.body,
			secrets,
		);
	}
	return error;
}

export const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			redactApiErrorInPlace(error, apiKey);
			throw error;
		}
		if (error instanceof Error) {
			const secrets: string[] = [];
			if (apiKey && apiKey.length > 0) secrets.push(apiKey);
			if (requestOptions.body) {
				secrets.push(...extractSensitiveValues(requestOptions.body));
			}
			error.message = redactSecretsInString(error.message, secrets);
			throw error;
		}
		// `unknown` because rejection values can be non-Error primitives.
		throw error;
	}
}
