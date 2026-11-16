import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LaunchDarklyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LaunchDarklyAPIError';
	}
}

export const LAUNCHDARKLY_API_BASE = 'https://app.launchdarkly.com';
export const LAUNCHDARKLY_API_VERSION = '20240415';

export const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export const PUBLIC_ENDPOINTS = new Set(['root.get']);

// `unknown` because provider JSON is untrusted until runtime-checked here.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
	'mobilekey',
	'email',
	'invalidemails',
	'message',
	'detail',
	'error',
]);

// `unknown` because request bodies can be arbitrary JSON structures.
export function redactSensitiveFields(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(redactSensitiveFields);
	}
	if (isRecord(value)) {
		const sanitized: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) {
			const normalized = k.toLowerCase().replace(/[-_]/g, '');
			if (normalized.endsWith('email') || SENSITIVE_KEY_NAMES.has(normalized)) {
				sanitized[k] = '[REDACTED]';
			} else {
				sanitized[k] = redactSensitiveFields(v);
			}
		}
		return sanitized;
	}
	return value;
}

// `unknown` because provider error JSON is untrusted and may contain customer data.
function safeErrorDetails(value: unknown): Record<string, string> | undefined {
	if (!isRecord(value)) return undefined;
	const details: Record<string, string> = {};
	if (typeof value.code === 'string') details.code = value.code;
	if (typeof value.id === 'string') details.id = value.id;
	return Object.keys(details).length > 0 ? details : undefined;
}

export function compactQuery(
	query?: Record<string, string | number | boolean | string[] | undefined>,
): Record<string, string | number | boolean | string[]> | undefined {
	if (!query) return undefined;
	const compact: Record<string, string | number | boolean | string[]> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			compact[key] = value;
		}
	}
	return Object.keys(compact).length > 0 ? compact : undefined;
}

export type LaunchDarklyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because each endpoint payload is parsed by its own Zod input schema.
	body?: unknown;
	query?: Record<string, string | number | boolean | string[] | undefined>;
	headers?: Record<string, string>;
	mediaType?: string;
};

export async function makeLaunchDarklyRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: LaunchDarklyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('launchdarkly', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: LAUNCHDARKLY_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'LD-API-Version': LAUNCHDARKLY_API_VERSION,
			...authHeaders,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'GET' || (method === 'DELETE' && body === undefined)
				? undefined
				: body,
		mediaType: mediaType ?? 'application/json; charset=utf-8',
		query: compactQuery(query),
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const sanitizedRequestHeaders = Object.fromEntries(
				Object.entries(error.request?.headers ?? {}).map(([key, value]) => [
					key,
					key.toLowerCase() === 'authorization' ? '[REDACTED]' : String(value),
				]),
			);
			throw new ApiError(
				{
					...error.request,
					url: '/api/v2',
					headers: sanitizedRequestHeaders,
					query: undefined,
					body: undefined,
				},
				{
					url: LAUNCHDARKLY_API_BASE,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: safeErrorDetails(error.body),
				},
				safeErrorDetails(error.body)?.code
					? `LaunchDarkly API request failed with status ${error.status} (${safeErrorDetails(error.body)?.code})`
					: `LaunchDarkly API request failed with status ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		if (error instanceof Error) {
			// Header validation (a key with a newline, say) throws a TypeError whose message quotes
			// the header value, so the key is masked and the original stack and cause are dropped.
			if (apiKey && error.message.includes(apiKey)) {
				throw new LaunchDarklyAPIError(
					error.message.split(apiKey).join('[REDACTED]'),
					error.name,
				);
			}
			throw error;
		}
		throw new LaunchDarklyAPIError('Unknown error');
	}
}
