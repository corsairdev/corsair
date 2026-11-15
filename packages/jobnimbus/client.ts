import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class JobNimbusAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'JobNimbusAPIError';
	}
}

/**
 * Base URL for JobNimbus API v1 endpoints.
 * Documented at https://documenter.getpostman.com/view/3919598/S11PpG4x
 */
export const JOBNIMBUS_API_BASE = 'https://app.jobnimbus.com/api1';

// Corsair's endpoint error handlers own retry policy; keep the HTTP transport
// to one attempt while still parsing Retry-After for the 429 handler.
export const JOBNIMBUS_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

/** A query value the transport can serialise (arrays become repeated params). */
export type JobNimbusQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

export type JobNimbusRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT';
	body?: object;
	query?: Record<string, JobNimbusQueryValue>;
	baseUrl?: string;
};

/**
 * Drops `undefined` values so an omitted optional parameter is never sent as
 * an empty query string entry.
 */
export function compactQuery(
	query: Record<string, JobNimbusQueryValue>,
): Record<string, JobNimbusQueryValue> {
	const defined: Record<string, JobNimbusQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return defined;
}

// Credential names that may appear in an echoed request body: API tokens, passwords, keys.
const SENSITIVE_REQUEST_FIELDS = new Set([
	'accesskeyid',
	'authorization',
	'clientemail',
	'password',
	'privatekey',
	'projectid',
	'sastoken',
	'secretaccesskey',
	'sessiontoken',
	'storageaccesskey',
	'apikey',
	'token',
	'secret',
]);

function normalizedFieldName(field: string): string {
	return field.replace(/[_-]/g, '').toLowerCase();
}

// `unknown` because provider/request JSON is untrusted until runtime-checked.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because request bodies contain arbitrary nested JSON; this helper
// walks and narrows values recursively without assuming a concrete shape.
export function redactCredentialFields(value: unknown): {
	value: unknown;
	changed: boolean;
} {
	if (Array.isArray(value)) {
		const items = value.map(redactCredentialFields);
		if (!items.some((item) => item.changed)) return { value, changed: false };
		return { value: items.map((item) => item.value), changed: true };
	}
	if (!isRecord(value)) return { value, changed: false };

	let changed = false;
	const entries = Object.entries(value).map(([field, fieldValue]) => {
		if (SENSITIVE_REQUEST_FIELDS.has(normalizedFieldName(field))) {
			changed = true;
			return [field, '[REDACTED]'] as const;
		}
		const redacted = redactCredentialFields(fieldValue);
		changed ||= redacted.changed;
		return [field, redacted.value] as const;
	});
	return changed
		? { value: Object.fromEntries(entries), changed }
		: { value, changed };
}

export async function makeJobNimbusRequest<T>(
	endpoint: string,
	apiKey: string,
	options: JobNimbusRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl } = options;

	// Fail fast on missing/empty key
	if (apiKey === undefined || apiKey.length === 0) {
		throw new AuthMissingError('jobnimbus', 'api_key');
	}

	let resolvedBase = baseUrl ?? JOBNIMBUS_API_BASE;
	let resolvedPath = endpoint;

	if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
		const parsedUrl = new URL(endpoint);
		resolvedBase = parsedUrl.origin;
		resolvedPath = parsedUrl.pathname;
	}

	const authHeader = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

	const config: OpenAPIConfig = {
		BASE: resolvedBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: authHeader,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: resolvedPath,
		body: method !== 'GET' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: JOBNIMBUS_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const requestBody = redactCredentialFields(error.request.body);
			if (requestBody.changed) {
				const sanitizedError = new ApiError(
					{ ...error.request, body: requestBody.value },
					{
						url: error.url,
						ok: false,
						status: error.status,
						statusText: error.statusText,
						body: error.body,
					},
					error.message,
					{
						retryAfter: error.retryAfter,
						rateLimitReset: error.rateLimitReset,
						rateLimitRemaining: error.rateLimitRemaining,
						rateLimitLimit: error.rateLimitLimit,
					},
				);
				sanitizedError.stack = error.stack;
				throw sanitizedError;
			}
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new JobNimbusAPIError('Unknown error');
	}
}
