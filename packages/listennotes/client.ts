import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ListennotesAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ListennotesAPIError';
	}
}

/**
 * Base URL for Listen Notes API v2.
 * Official docs: https://www.listennotes.com/api/docs/
 */
export const LISTENNOTES_API_BASE = 'https://listen-api.listennotes.com/api/v2';

/**
 * Automatic 429 retries are disabled because Listen Notes uses 429 for both
 * throttling and exhausted quotas; Retry-After extraction remains enabled.
 */
export const LISTENNOTES_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type ListennotesQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

export type ListennotesRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	// unknown because request bodies are validated by endpoint input schemas before invocation.
	body?: Record<string, unknown> | string;
	query?: Record<string, ListennotesQueryValue>;
	mediaType?: string;
};

export function serializeFormBody(
	values: Record<string, string | number | undefined>,
): string {
	const body = new URLSearchParams();
	for (const [key, value] of Object.entries(values)) {
		if (value !== undefined) body.set(key, String(value));
	}
	return body.toString();
}

/**
 * Drops `undefined` query parameters so empty values are not serialized.
 */
export function compactQuery(
	query: Record<string, ListennotesQueryValue>,
): Record<string, ListennotesQueryValue> {
	const defined: Record<string, ListennotesQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return defined;
}

const SENSITIVE_KEYS = new Set([
	'xlistenapikey',
	'authorization',
	'apikey',
	'token',
	'secret',
	'password',
	'q',
	'email',
	'rss',
	'rsses',
	'domainname',
	'reason',
	'name',
	'description',
	'notes',
]);

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[-_]/g, '');
	return (
		SENSITIVE_KEYS.has(normalized) ||
		normalized.includes('apikey') ||
		normalized.includes('token') ||
		normalized.includes('secret')
	);
}

// unknown because provider error responses are untrusted and unvalidated until inspected.
function redactSensitiveData(
	value: unknown,
	sensitiveValues: readonly string[] = [],
): unknown {
	if (typeof value === 'string') {
		return sensitiveValues.reduce(
			(redacted, sensitiveValue) =>
				redacted.split(sensitiveValue).join('[REDACTED]'),
			value,
		);
	}
	if (Array.isArray(value)) {
		// unknown because array elements inside arbitrary JSON structures have unknown shapes.
		return value.map((entry: unknown) =>
			redactSensitiveData(entry, sensitiveValues),
		);
	}
	if (typeof value === 'object' && value !== null) {
		// unknown because nested object property values are untyped until recursively inspected.
		const redacted: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) {
			if (isSensitiveKey(k)) {
				redacted[k] = '[REDACTED]';
			} else {
				redacted[k] = redactSensitiveData(v, sensitiveValues);
			}
		}
		return redacted;
	}
	return value;
}

// unknown because request values can contain untyped nested query and form fields.
function collectSensitiveValues(value: unknown, key = ''): string[] {
	if (typeof value === 'string') {
		return isSensitiveKey(key) && value.length >= 4 ? [value] : [];
	}
	if (Array.isArray(value)) {
		// unknown because nested request arrays are untyped until their entries are inspected.
		return value.flatMap((entry: unknown) =>
			collectSensitiveValues(entry, key),
		);
	}
	if (typeof value === 'object' && value !== null) {
		return Object.entries(value).flatMap(([property, entry]) =>
			collectSensitiveValues(entry, property),
		);
	}
	return [];
}

// unknown because request bodies may be JSON objects or encoded form strings.
function collectRequestBodySensitiveValues(value: unknown): string[] {
	if (typeof value !== 'string') return collectSensitiveValues(value);
	return [...new URLSearchParams(value).entries()].flatMap(([key, entry]) =>
		collectSensitiveValues(entry, key),
	);
}

function redactDiagnosticUrl(value: string): string {
	try {
		const hasProtocol = /^[a-z]+:\/\//i.test(value);
		const url = new URL(value, 'https://listen-api.listennotes.com');
		for (const key of [...url.searchParams.keys()]) {
			if (isSensitiveKey(key)) url.searchParams.set(key, '[REDACTED]');
		}
		const segments = url.pathname.split('/');
		const domainSegment = segments.indexOf('domains') + 1;
		if (domainSegment > 0 && segments[domainSegment]) {
			segments[domainSegment] = '[REDACTED]';
			url.pathname = segments.join('/');
		}
		return hasProtocol
			? url.toString()
			: `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return value;
	}
}

function collectSensitivePathValue(value: string): string[] {
	const marker = '/podcasts/domains/';
	const start = value.indexOf(marker);
	if (start < 0) return [];
	const rawValue = value.slice(start + marker.length).split(/[/?#]/, 1)[0];
	if (!rawValue) return [];
	try {
		const decodedValue = decodeURIComponent(rawValue);
		return decodedValue.length >= 4 ? [decodedValue] : [];
	} catch {
		return rawValue.length >= 4 ? [rawValue] : [];
	}
}

// unknown because error rejections have no static type before runtime inspection.
export function sanitizeApiError(error: unknown): unknown {
	if (!(error instanceof ApiError)) return error;

	const request = error.request;
	const sensitiveValues = [
		...collectSensitiveValues(request.query),
		...collectRequestBodySensitiveValues(request.body),
		...collectSensitivePathValue(request.url),
	];
	if (request.headers) {
		for (const key of Object.keys(request.headers)) {
			if (isSensitiveKey(key)) request.headers[key] = '[REDACTED]';
		}
	}
	if (request.query) {
		for (const key of Object.keys(request.query)) {
			if (isSensitiveKey(key)) request.query[key] = '[REDACTED]';
		}
	}
	if (request.body !== undefined) {
		Object.defineProperty(request, 'body', {
			configurable: true,
			enumerable: true,
			value: '[REDACTED]',
			writable: true,
		});
	}
	Object.defineProperty(request, 'url', {
		configurable: true,
		enumerable: true,
		value: redactDiagnosticUrl(request.url),
		writable: true,
	});
	if (error.body !== undefined) {
		// unknown because response bodies can be arbitrary provider JSON or text.
		Object.defineProperty(error, 'body', {
			configurable: true,
			enumerable: true,
			value: redactSensitiveData(error.body, sensitiveValues),
			writable: true,
		});
	}
	Object.defineProperty(error, 'url', {
		configurable: true,
		enumerable: true,
		value: redactDiagnosticUrl(error.url),
		writable: true,
	});
	for (const sensitiveValue of sensitiveValues) {
		error.message = error.message.split(sensitiveValue).join('[REDACTED]');
	}

	return error;
}

export async function makeListennotesRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: ListennotesRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('listennotes', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { 'X-ListenAPI-Key': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: LISTENNOTES_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: options.mediaType ?? 'application/json; charset=utf-8',
		query: query ? compactQuery(query) : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LISTENNOTES_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw sanitizeApiError(error);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new ListennotesAPIError('Unknown Listen Notes error');
	}
}
