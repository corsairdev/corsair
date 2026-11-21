import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LemlistAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LemlistAPIError';
	}
}

/**
 * Official Lemlist API base URL.
 * Reference: https://developer.lemlist.com/
 */
export const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

/**
 * Rate limit configuration for the HTTP transport.
 * Handler owns rate limit retries (extracting Retry-After); transport retries are 0.
 */
export const LEMLIST_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Lemlist uses HTTP Basic authentication with an empty username and the API key as the password.
 * Format: `Basic base64(:apiKey)`.
 */
export function basicAuthHeader(apiKey: string): string {
	const trimmed = apiKey.trim();
	const creds = trimmed.startsWith(':') ? trimmed : `:${trimmed}`;
	return `Basic ${Buffer.from(creds).toString('base64')}`;
}

export type LemlistQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

/**
 * Drops `undefined` query parameters so empty keys are not included in request URLs.
 */
export function compactQuery(
	query?: Record<string, LemlistQueryValue>,
):
	| Record<string, string | number | boolean | readonly (string | number)[]>
	| undefined {
	if (!query) return undefined;
	const defined: Record<
		string,
		string | number | boolean | readonly (string | number)[]
	> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return Object.keys(defined).length > 0 ? defined : undefined;
}

const SENSITIVE_ERROR_FIELDS = new Set(
	[
		'apiKey',
		'xApiKey',
		'authorization',
		'accessToken',
		'refreshToken',
		'token',
		'clientSecret',
		'password',
		'secret',
		'email',
		'phone',
		'leadEmail',
		'contactEmail',
		'firstName',
		'lastName',
		'companyName',
		'linkedinUrl',
		'companyDomain',
		'value',
		'values',
		'variables',
	].map((field) => field.toLowerCase().replace(/[-_]/g, '')),
);

function sanitizeErrorText(
	value: string,
	apiKey?: string,
	requestValues: readonly string[] = [],
): string {
	let sanitized = value;
	if (apiKey) {
		const credentials = `:${apiKey}`;
		for (const secret of [
			apiKey,
			credentials,
			Buffer.from(credentials).toString('base64'),
			basicAuthHeader(apiKey),
		]) {
			sanitized = sanitized.replaceAll(secret, '[REDACTED]');
		}
	}
	for (const requestValue of requestValues) {
		sanitized = sanitized.replaceAll(requestValue, '[REDACTED]');
	}
	return sanitized
		.replace(/Basic\s+[A-Za-z0-9+/=]+/gi, 'Basic [REDACTED]')
		.replace(
			/([?&](?:api[_-]?key|token|secret|password|signature)=)[^&\s]+/gi,
			'$1[REDACTED]',
		)
		.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
		.replace(/\+?\d[\d ().-]{6,}\d/g, '[REDACTED_PHONE]');
}

function sanitizePathSegment(segment: string): string {
	let decoded = segment;
	try {
		decoded = decodeURIComponent(segment);
	} catch {
		// Keep the original encoded segment if it is malformed.
	}
	if (
		/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(decoded) ||
		/^https?:\/\//i.test(decoded) ||
		/linkedin\.com\//i.test(decoded) ||
		/\+?\d[\d ().-]{6,}\d/.test(decoded) ||
		/^[A-Z]{2,6}_[A-Z0-9-]{2,}$/i.test(decoded)
	) {
		return '[REDACTED]';
	}
	return segment;
}

function sanitizeErrorUrl(value: string, apiKey?: string): string {
	const sanitized = sanitizeErrorText(value, apiKey);
	try {
		const isAbsoluteUrl = /^[a-z]+:\/\//i.test(sanitized);
		const url = new URL(sanitized, LEMLIST_API_BASE);
		url.pathname = url.pathname.split('/').map(sanitizePathSegment).join('/');
		url.search = '';
		url.hash = '';
		return isAbsoluteUrl ? url.toString() : `${url.pathname}`;
	} catch {
		return sanitized.split(/[?#]/, 1)[0] ?? sanitized;
	}
}

// `unknown` because parsed provider JSON can be any shape before this guard.
function isObjectRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because request values may be nested JSON; only values are collected for echo redaction.
function collectRequestValues(
	value: unknown,
	values: Set<string> = new Set(),
): Set<string> {
	if (typeof value === 'string') {
		if (value.length >= 3) values.add(value);
		try {
			const decoded = decodeURIComponent(value);
			if (decoded.length >= 3) values.add(decoded);
		} catch {
			// Keep malformed input only in its original form.
		}
	} else if (Array.isArray(value)) {
		for (const item of value) collectRequestValues(item, values);
	} else if (isObjectRecord(value)) {
		for (const item of Object.values(value)) collectRequestValues(item, values);
	}
	return values;
}

// `unknown` because provider error bodies are untrusted JSON and fields need runtime redaction.
function sanitizeProviderData(
	value: unknown,
	apiKey?: string,
	requestValues: readonly string[] = [],
): unknown {
	if (typeof value === 'string') {
		return sanitizeErrorText(value, apiKey, requestValues);
	}
	if (Array.isArray(value)) {
		return value.map((item) =>
			sanitizeProviderData(item, apiKey, requestValues),
		);
	}
	if (!isObjectRecord(value)) return value;

	const sanitized: Record<string, unknown> = {};
	for (const key of Object.keys(value)) {
		const normalized = key.toLowerCase().replace(/[-_]/g, '');
		// Keys can carry customer data too (e.g. `{ rejected: { "a@b.co": "invalid" } }`).
		const safeKey = sanitizeErrorText(key, apiKey, requestValues);
		sanitized[safeKey] = SENSITIVE_ERROR_FIELDS.has(normalized)
			? '[REDACTED]'
			: sanitizeProviderData(value[key], apiKey, requestValues);
	}
	return sanitized;
}

/** Preserve the original ApiError and its useful details while redacting customer data. */
export function sanitizeApiError(error: ApiError, apiKey?: string): ApiError {
	const requestValues = [
		...collectRequestValues(error.request.body),
		...collectRequestValues(error.request.query),
	].sort((a, b) => b.length - a.length);
	const request: ApiRequestOptions = {
		method: error.request.method,
		url: sanitizeErrorUrl(error.request.url, apiKey),
	};
	Object.defineProperties(error, {
		message: {
			value: sanitizeErrorText(error.message, apiKey, requestValues),
			configurable: true,
			writable: true,
		},
		statusText: {
			value: sanitizeErrorText(error.statusText, apiKey, requestValues),
			configurable: true,
			writable: true,
		},
		url: {
			value: sanitizeErrorUrl(error.url, apiKey),
			configurable: true,
			writable: true,
		},
		body: {
			value: sanitizeProviderData(error.body, apiKey, requestValues),
			configurable: true,
			writable: true,
		},
		request: {
			value: request,
			configurable: true,
			writable: true,
		},
	});
	return error;
}

export type LemlistRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request bodies vary per endpoint; zod schemas validate inputs before transmission.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, LemlistQueryValue>;
	timeout?: number;
	/**
	 * Some Lemlist writes answer plain text (`Variable subscribed`) under an
	 * `application/json` content type, which core cannot parse. Read the body as
	 * bytes and return parsed JSON when it is JSON, else the text.
	 */
	text?: boolean;
};

const textDecoder = new TextDecoder();

// `unknown` because the decoded body may be JSON of any shape or plain text.
function decodeTextResponse(value: unknown): unknown {
	if (
		typeof value !== 'object' ||
		value === null ||
		!('bytes' in value) ||
		!(value.bytes instanceof Uint8Array)
	) {
		return value;
	}
	const text = textDecoder.decode(value.bytes).trim();
	if (text.length === 0) return '';
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

/**
 * Issues an authenticated request to the Lemlist API.
 */
export async function makeLemlistRequest<T>(
	endpoint: string,
	apiKey: string,
	options: LemlistRequestOptions = {},
): Promise<T> {
	if (apiKey !== undefined && apiKey.trim().length === 0) {
		throw new AuthMissingError('lemlist', 'api_key');
	}

	// Ids are encoded with encodeURIComponent, which leaves `.` and `..` intact;
	// fetch would collapse them into a different route.
	if (
		endpoint
			.split(/[?#]/, 1)[0]
			?.split('/')
			.some((segment) => segment === '.' || segment === '..')
	) {
		throw new LemlistAPIError(
			'Lemlist path identifiers cannot be "." or ".."',
			'INVALID_PATH',
		);
	}

	const { method = 'GET', body, query, timeout = 20000, text } = options;

	const config: OpenAPIConfig = {
		BASE: LEMLIST_API_BASE,
		VERSION: '2.0.0',
		TIMEOUT: timeout,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: basicAuthHeader(apiKey),
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
		query: compactQuery(query),
		...(text ? { responseType: 'binary' as const } : {}),
	};

	try {
		const result = await request<T>(config, requestOptions, {
			rateLimitConfig: LEMLIST_RATE_LIMIT_CONFIG,
		});
		return text ? (decodeTextResponse(result) as T) : result;
	} catch (error: unknown) {
		// `unknown` because caught errors in TypeScript have no static type.
		if (error instanceof ApiError) {
			throw sanitizeApiError(error, apiKey);
		}
		throw new LemlistAPIError('Lemlist API transport failed');
	}
}
