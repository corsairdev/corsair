import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FOLK_API_BASE = 'https://api.folk.app/v1';

const SENSITIVE_KEY_NAMES = new Set([
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

const REDACTED = '[REDACTED]';

// Folk echoes contact email addresses in validation messages; R8 keeps them out of errors.
const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// `unknown` because error bodies are untrusted JSON of any shape.
function maskEmails(value: unknown): unknown {
	if (typeof value === 'string') return value.replace(EMAIL_PATTERN, '[email]');
	if (Array.isArray(value)) return value.map(maskEmails);
	if (value !== null && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, val]) => [key, maskEmails(val)]),
		);
	}
	return value;
}

/**
 * Recursively redacts sensitive field names and occurrences of explicit secrets.
 *
 * @param value The value to sanitize.
 * @param secrets Optional explicit secret strings to replace inside text values.
 */
// `unknown` because credential redaction traverses arbitrary JSON data structures before schema validation.
export function redactSensitiveData(
	value: unknown,
	secrets: string[] = [],
): unknown {
	if (value === null || value === undefined) {
		return value;
	}

	if (typeof value === 'string') {
		return secrets.reduce(
			(text, secret) => (secret ? text.split(secret).join(REDACTED) : text),
			value,
		);
	}

	if (Array.isArray(value)) {
		return value.map((item) => redactSensitiveData(item, secrets));
	}

	if (typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(value)) {
			const normalized = key.toLowerCase().replace(/[_-]/g, '');
			if (SENSITIVE_KEY_NAMES.has(normalized)) {
				result[key] = REDACTED;
			} else {
				result[key] = redactSensitiveData(val, secrets);
			}
		}
		return result;
	}

	return value;
}

/**
 * Flattens a nested filter record into Folk API query format (e.g. `filter[attribute][operator]=value`).
 *
 * @param filter The filter record to flatten.
 * @param prefix Prefix for query keys, defaults to 'filter'.
 */
// `unknown` because filter values can be nested objects or primitive filter values.
export function flattenFilter(
	filter: Record<string, unknown>,
	prefix = 'filter',
): Record<string, FolkQueryValue> {
	const result: Record<string, FolkQueryValue> = {};
	for (const [key, value] of Object.entries(filter)) {
		if (value === null || value === undefined) continue;
		if (typeof value === 'object' && !Array.isArray(value)) {
			// `unknown` because nested filter objects are untyped records.
			Object.assign(
				result,
				flattenFilter(value as Record<string, unknown>, `${prefix}[${key}]`),
			);
		} else if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			result[`${prefix}[${key}]`] = value;
		} else if (Array.isArray(value)) {
			// Core sends an array as repeated keys, e.g. filter[groups][all][id]=a&filter[groups][all][id]=b.
			const items = value.filter(
				(item): item is string | number | boolean =>
					typeof item === 'string' ||
					typeof item === 'number' ||
					typeof item === 'boolean',
			);
			if (items.length > 0) result[`${prefix}[${key}]`] = items;
		}
	}
	return result;
}

export type FolkQueryValue =
	| string
	| number
	| boolean
	| Array<string | number | boolean>;

// `unknown` because response JSON or error payload is an untrusted arbitrary object until inspected.
function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Normalized API error thrown when a Folk API operation fails.
 */
export class FolkAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly requestId?: string;
	readonly retryAfter?: number;
	// `unknown` because provider error responses can contain arbitrary detail objects.
	readonly details?: unknown;
	// `unknown` because provider error responses can be any JSON or text payload.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			requestId?: string;
			retryAfter?: number;
			// `unknown` because provider error responses can contain arbitrary detail objects.
			details?: unknown;
			// `unknown` because provider error responses can be any JSON or text payload.
			body?: unknown;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'FolkAPIError';
		this.status = options.status;
		this.code = options.code;
		this.requestId = options.requestId;
		this.retryAfter = options.retryAfter;
		this.details = options.details;
		this.body = options.body;
	}
}

export type FolkRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request bodies vary per endpoint schema before JSON serialization.
	body?: Record<string, unknown>;
	query?: Record<string, FolkQueryValue | undefined>;
	headers?: Record<string, string>;
};

/**
 * Makes an authenticated request to the Folk API.
 */
export async function makeFolkRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: FolkRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers = {} } = options;

	// Fail fast when API key is missing or explicitly empty.
	if (!apiKey || apiKey.trim().length === 0) {
		throw new AuthMissingError('folk', 'api_key');
	}

	const secrets = [apiKey];

	const config: OpenAPIConfig = {
		BASE: FOLK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
	} catch (error) {
		if (error instanceof ApiError) {
			// Core's ApiError goes through (R8) so status, retryAfter and isRateLimitError()
			// keep working. It is rebuilt without the sent body and query, which carry contact
			// names and emails, with the API key and secret-named fields redacted and email
			// addresses masked in Folk's message and body. folkErrorInfo() reads the code,
			// requestId and details back out.
			// `unknown` because provider error bodies are untrusted JSON until inspected.
			const safeBody: unknown = maskEmails(
				redactSensitiveData(error.body, secrets),
			);
			const folkMessage =
				isRecord(safeBody) &&
				isRecord(safeBody.error) &&
				typeof safeBody.error.message === 'string'
					? safeBody.error.message
					: undefined;
			const safeMessage =
				folkMessage ??
				(maskEmails(redactSensitiveData(error.message, secrets)) as string);
			const url = new URL(error.url, FOLK_API_BASE);
			url.search = '';
			throw new ApiError(
				{ ...error.request, body: undefined, query: undefined },
				{
					url: url.toString(),
					ok: false,
					status: error.status,
					statusText: maskEmails(
						redactSensitiveData(error.statusText, secrets),
					) as string,
					body: safeBody,
				},
				safeMessage,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}

		if (error instanceof Error) {
			const sanitized = redactSensitiveData(error.message, secrets);
			const sanitizedMessage =
				typeof sanitized === 'string' ? sanitized : error.message;
			throw new FolkAPIError(sanitizedMessage, {
				cause: new Error(sanitizedMessage),
			});
		}

		throw new FolkAPIError('Unknown Folk API error');
	}
}

/**
 * Folk's error code, request id and details from a thrown ApiError body
 * (`{ error: { code, message, requestId, details } }`).
 */
export function folkErrorInfo(error: ApiError): {
	code?: string;
	requestId?: string;
	// `unknown` because Folk's details shape varies per error code.
	details?: unknown;
} {
	const body = error.body;
	if (!isRecord(body) || !isRecord(body.error)) return {};
	const { code, requestId, details } = body.error;
	return {
		...(typeof code === 'string' ? { code } : {}),
		...(typeof requestId === 'string' ? { requestId } : {}),
		...(details !== undefined ? { details } : {}),
	};
}
