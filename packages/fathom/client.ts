import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FathomAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		// `unknown` because the raw error body from the provider is untrusted JSON.
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'FathomAPIError';
	}
}

export const FATHOM_API_BASE = 'https://api.usefathom.com/v1';

const SENSITIVE_KEY_PATTERNS = [
	'accesskeyid',
	'secretaccesskey',
	'sessiontoken',
	'privatekey',
	'clientemail',
	'projectid',
	'password',
	'sharepassword',
	'authorization',
	'storageaccesskey',
	'sastoken',
	'apikey',
	'token',
	'secret',
];

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[-_]/g, '');
	return SENSITIVE_KEY_PATTERNS.some((pattern) => normalized.includes(pattern));
}

// `unknown` because provider JSON structures and error payloads are arbitrary untrusted values.
export function redactSensitiveData(
	data: unknown,
	secretToRedact?: string,
): unknown {
	if (typeof data === 'string') {
		if (secretToRedact && secretToRedact.length > 0) {
			return data.split(secretToRedact).join('[redacted]');
		}
		return data;
	}
	if (Array.isArray(data)) {
		// `unknown` because elements of an untrusted JSON array can have any type.
		return data.map((item: unknown) =>
			redactSensitiveData(item, secretToRedact),
		);
	}
	if (data !== null && typeof data === 'object') {
		// `unknown` because record properties contain untrusted nested values.
		const record = data as Record<string, unknown>;
		// `unknown` because the sanitized record preserves dynamic JSON properties.
		const redactedRecord: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(record)) {
			if (isSensitiveKey(key)) {
				redactedRecord[key] = '[redacted]';
			} else {
				redactedRecord[key] = redactSensitiveData(val, secretToRedact);
			}
		}
		return redactedRecord;
	}
	return data;
}

function sanitizeApiError(error: ApiError, apiKey?: string): ApiError {
	// `unknown` because response body payload is untrusted.
	const sanitizedBody: unknown = redactSensitiveData(error.body, apiKey);
	// `unknown` because request body payload is untrusted.
	const sanitizedRequestBody: unknown = redactSensitiveData(
		error.request?.body,
		apiKey,
	);

	const sanitizedRequest: ApiRequestOptions = {
		...error.request,
		body: sanitizedRequestBody,
	};

	const sanitizedResponse: ApiResult = {
		url: error.url,
		ok: false,
		status: error.status,
		statusText: error.statusText,
		body: sanitizedBody,
	};

	const sanitizedMessage =
		typeof error.message === 'string' && apiKey
			? error.message.split(apiKey).join('[redacted]')
			: error.message;

	return new ApiError(sanitizedRequest, sanitizedResponse, sanitizedMessage, {
		retryAfter: error.retryAfter,
		rateLimitReset: error.rateLimitReset,
		rateLimitRemaining: error.rateLimitRemaining,
		rateLimitLimit: error.rateLimitLimit,
	});
}

export async function makeFathomRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because request bodies vary per endpoint and are already validated by Zod schemas.
		body?: Record<string, unknown>;
		// `unknown` because query values may be strings, numbers, booleans, or complex filter structures.
		query?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('fathom', 'api_key');
	}

	if (!apiKey) {
		throw new AuthMissingError('fathom', 'api_key');
	}

	const authHeaders: Record<string, string> = {
		Authorization: `Bearer ${apiKey}`,
	};

	const config: OpenAPIConfig = {
		BASE: FATHOM_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...authHeaders,
		},
	};

	// Convert any complex query parameters (such as `filters`) into JSON strings
	const serializedQuery:
		| Record<string, string | number | boolean | undefined>
		| undefined = query
		? Object.fromEntries(
				Object.entries(query)
					.filter(([, v]) => v !== undefined)
					.map(([k, v]) => [
						k,
						typeof v === 'object' && v !== null
							? JSON.stringify(v)
							: (v as string | number | boolean),
					]),
			)
		: undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: serializedQuery,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw sanitizeApiError(error, apiKey);
		}
		if (error instanceof Error) {
			const sanitizedMessage =
				apiKey && apiKey.length > 0
					? error.message.split(apiKey).join('[redacted]')
					: error.message;
			throw new FathomAPIError(sanitizedMessage);
		}
		throw new FathomAPIError('Unknown error occurred');
	}
}
