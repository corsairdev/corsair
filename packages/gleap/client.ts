import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GleapAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GleapAPIError';
	}
}

export const GLEAP_API_BASE_EU = 'https://api.gleap.io/v3';
export const GLEAP_API_BASE_US = 'https://api.us.gleap.ai/v3';
export const GLEAP_API_BASE = GLEAP_API_BASE_EU;

const SENSITIVE_KEY_PATTERN =
	/(?:api[_-]?key|token|secret|password|authorization|private_key|session_token)/i;
const REDACTED = '[REDACTED]';

// unknown because values inspected for sensitive keys can be any arbitrary JSON payload
export function redactSensitiveData(value: unknown): unknown {
	if (typeof value === 'string') {
		return value.replace(
			/(?:bearer\s+)[a-zA-Z0-9_\-.]+/gi,
			`Bearer ${REDACTED}`,
		);
	}
	if (Array.isArray(value)) {
		// unknown because array elements have arbitrary schema types
		return value.map((item: unknown) => redactSensitiveData(item));
	}
	if (value !== null && typeof value === 'object') {
		// unknown because provider JSON object fields are inspected for credentials dynamically
		const result: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
			if (SENSITIVE_KEY_PATTERN.test(key)) {
				result[key] = REDACTED;
			} else {
				result[key] = redactSensitiveData(val);
			}
		}
		return result;
	}
	return value;
}

// unknown because error parameter might not be an instance of ApiError
export function sanitizeApiError(error: unknown): unknown {
	if (!(error instanceof ApiError)) return error;

	if (error.request && error.request.body !== undefined) {
		// unknown because request body may be any serialized JSON payload
		(error.request as { body?: unknown }).body = redactSensitiveData(
			error.request.body,
		);
	}

	if (error.body !== undefined) {
		// unknown because API error responses can be structured JSON or error text
		(error as { body?: unknown }).body = redactSensitiveData(error.body);
	}

	return error;
}

export async function makeGleapRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown because request body values are arbitrary JSON payload fields
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		projectId?: string;
		baseUrl?: string;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		projectId,
		baseUrl = GLEAP_API_BASE,
		headers = {},
	} = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('gleap', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	if (projectId) {
		authHeaders.project = projectId;
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '3.0.0',
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
	} catch (error) {
		const sanitized = sanitizeApiError(error);
		if (sanitized instanceof ApiError) throw sanitized;
		if (sanitized instanceof Error) {
			throw sanitized;
		}
		throw new GleapAPIError('Unknown error');
	}
}
