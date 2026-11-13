import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FomoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'FomoAPIError';
	}
}

export const FOMO_API_BASE = 'https://api.fomo.com/api/v1';

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
	'clientsecret',
	'clientid',
	'authtoken',
]);

function normalizeKey(key: string): string {
	return key.toLowerCase().replace(/[-_]/g, '');
}

// `unknown` because untrusted JSON objects must be narrowed at runtime before inspection.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because arbitrary JSON structures may appear in request/response payloads before sanitization.
export function redactValue(value: unknown): unknown {
	if (value === null || value === undefined) return value;
	if (Array.isArray(value)) {
		return value.map((item) => redactValue(item));
	}
	if (!isRecord(value)) return value;
	// `unknown` because the sanitized object preserves untrusted JSON values.
	const result: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(value)) {
		if (SENSITIVE_KEY_NAMES.has(normalizeKey(k))) {
			result[k] = '[REDACTED]';
		} else {
			result[k] = redactValue(v);
		}
	}
	return result;
}

export function redactMessage(message: string, apiKey?: string): string {
	let sanitized = message;
	if (apiKey && apiKey.length > 0) {
		sanitized = sanitized.replaceAll(apiKey, '[REDACTED]');
	}
	sanitized = sanitized.replace(
		/(?:Token|Bearer)\s+[A-Za-z0-9_\-.]+/gi,
		'Token [REDACTED]',
	);
	sanitized = sanitized.replace(
		/(^|[\s?&])(api_?key|token|secret|client_secret)=([^\s&#]+)/gi,
		'$1$2=[REDACTED]',
	);
	return sanitized;
}

export async function makeFomoRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because request bodies vary per endpoint and are assembled from validated schemas.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Fail fast when key is explicitly empty string. Public calls pass undefined.
	if (apiKey !== undefined && apiKey.trim().length === 0) {
		throw new AuthMissingError('fomo', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Token ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: FOMO_API_BASE,
		VERSION: '1.0.0',
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const sanitizedMessage = redactMessage(error.message, apiKey);
			// `unknown` because request body contains arbitrary JSON that must be sanitized.
			const sanitizedRequestBody: unknown = isRecord(error.request?.body)
				? redactValue(error.request.body)
				: error.request?.body;
			// `unknown` because error response body contains arbitrary JSON that must be sanitized.
			const sanitizedResponseBody: unknown = isRecord(error.body)
				? redactValue(error.body)
				: error.body;

			const sanitizedError = new ApiError(
				{
					...error.request,
					body: sanitizedRequestBody,
				},
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: redactMessage(error.statusText, apiKey),
					body: sanitizedResponseBody,
				},
				sanitizedMessage,
				error.retryAfter !== undefined ||
					error.rateLimitReset !== undefined ||
					error.rateLimitRemaining !== undefined ||
					error.rateLimitLimit !== undefined
					? {
							retryAfter: error.retryAfter,
							rateLimitReset: error.rateLimitReset,
							rateLimitRemaining: error.rateLimitRemaining,
							rateLimitLimit: error.rateLimitLimit,
						}
					: undefined,
			);
			throw sanitizedError;
		}
		if (error instanceof Error) {
			error.message = redactMessage(error.message, apiKey);
			throw error;
		}
		throw new FomoAPIError('Unknown error');
	}
}
