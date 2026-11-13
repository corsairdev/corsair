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
	query?: Record<string, string | number | boolean | undefined>;
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
			// `unknown` because provider error bodies are untrusted JSON until inspected.
			const rawBody: unknown = error.body;
			let parsedCode: string | undefined;
			let parsedMessage: string | undefined;
			let parsedRequestId: string | undefined;
			// `unknown` because error details shape varies per error code in Folk's API.
			let parsedDetails: unknown;

			if (isRecord(rawBody) && 'error' in rawBody && isRecord(rawBody.error)) {
				const errObj = rawBody.error;
				if (typeof errObj.code === 'string') parsedCode = errObj.code;
				if (typeof errObj.message === 'string') parsedMessage = errObj.message;
				if (typeof errObj.requestId === 'string')
					parsedRequestId = errObj.requestId;
				parsedDetails = errObj.details;
			}

			const sanitizedBody = redactSensitiveData(rawBody, secrets);
			const sanitizedDetails = redactSensitiveData(parsedDetails, secrets);
			const message = parsedMessage || error.message;

			throw new FolkAPIError(message, {
				status: error.status,
				code: parsedCode,
				requestId: parsedRequestId,
				retryAfter: error.retryAfter,
				details: sanitizedDetails,
				body: sanitizedBody,
				cause: error,
			});
		}

		if (error instanceof Error) {
			const sanitized = redactSensitiveData(error.message, secrets);
			const sanitizedMessage =
				typeof sanitized === 'string' ? sanitized : error.message;
			throw new FolkAPIError(sanitizedMessage, { cause: error });
		}

		throw new FolkAPIError('Unknown Folk API error');
	}
}
