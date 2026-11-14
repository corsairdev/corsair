import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { FinmeiBinaryResponse } from './endpoints/types';

export const FINMEI_API_BASE = 'https://app.finmei.com/api';

/**
 * Credentials and sensitive token field names to redact from propagated errors.
 */
const SENSITIVE_KEY_SUBSTRINGS = [
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
	'bearer',
];

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[-_]/g, '');
	return SENSITIVE_KEY_SUBSTRINGS.some((sub) => normalized.includes(sub));
}

// `unknown` because provider error details are untrusted JSON with dynamic nesting.
function collectSensitiveValues(
	data: unknown,
	values = new Set<string>(),
): string[] {
	if (Array.isArray(data)) {
		for (const item of data) collectSensitiveValues(item, values);
	} else if (isRecord(data)) {
		for (const [key, value] of Object.entries(data)) {
			if (
				isSensitiveKey(key) &&
				typeof value === 'string' &&
				value.length > 0
			) {
				values.add(value);
			} else {
				collectSensitiveValues(value, values);
			}
		}
	}
	return [...values].sort((a, b) => b.length - a.length);
}

// `unknown` because untrusted value requires runtime type narrowing before record inspection.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because untrusted error payload or JSON data must be deeply sanitized before inspection.
export function redactSensitiveData(
	data: unknown,
	knownCredentials: readonly string[] = [],
): unknown {
	if (data === null || data === undefined) return data;
	if (typeof data === 'string') {
		return redactKnownCredentialValues(data, knownCredentials);
	}
	if (typeof data === 'number' || typeof data === 'boolean') return data;
	if (Array.isArray(data)) {
		return data.map((item) => redactSensitiveData(item, knownCredentials));
	}
	if (isRecord(data)) {
		const sanitized: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(data)) {
			if (isSensitiveKey(key)) {
				sanitized[key] = '[REDACTED]';
			} else {
				sanitized[key] = redactSensitiveData(val, knownCredentials);
			}
		}
		return sanitized;
	}
	return data;
}

function redactKnownCredentialValues(
	text: string,
	knownCredentials: readonly string[],
): string {
	let sanitized = text;
	for (const credential of [...new Set(knownCredentials)].sort(
		(a, b) => b.length - a.length,
	)) {
		if (credential.length > 0) {
			sanitized = sanitized.split(credential).join('[REDACTED]');
		}
	}
	return sanitized;
}

export class FinmeiAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
		// `unknown` because provider error details are unstructured untrusted JSON.
		public readonly details?: unknown,
	) {
		super(message);
		this.name = 'FinmeiAPIError';
	}
}

export const FINMEI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type FinmeiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request bodies vary across endpoints and are validated by Zod prior to transport.
	body?: unknown;
	formData?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function buildConfig(apiKey?: string): OpenAPIConfig {
	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	return {
		BASE: FINMEI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			...authHeaders,
		},
	};
}

export const BINARY_MAX_RETRIES = 2;
export const BINARY_INITIAL_RETRY_DELAY_MS = 1000;

export function parseRetryAfterMs(
	headersOrResponse: Response | Headers | { get(name: string): string | null },
): number | undefined {
	const raw =
		'headers' in headersOrResponse
			? headersOrResponse.headers.get('retry-after')
			: 'get' in headersOrResponse
				? headersOrResponse.get('retry-after')
				: undefined;
	if (!raw) return undefined;
	const seconds = Number.parseInt(raw, 10);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return seconds * 1000;
}

/**
 * Redacts tokens, passwords, and sensitive strings from error messages.
 */
export function sanitizeErrorMessage(
	message: string,
	apiKey?: string,
	knownCredentials: readonly string[] = [],
): string {
	let sanitized = message
		.replace(/Bearer\s+[^\s"',]+/gi, 'Bearer [REDACTED]')
		.replace(
			/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
			'[REDACTED_JWT]',
		)
		.replace(
			/(["']?(?:api[_-]?key|token|secret|password|authorization|access_token|client_secret)["']?\s*[:=]\s*["']?)[^"',\s}]+/gi,
			'$1[REDACTED]',
		);

	const credentials = [...knownCredentials, ...(apiKey ? [apiKey] : [])];
	sanitized = redactKnownCredentialValues(sanitized, credentials);

	return sanitized;
}

// `unknown` because caught exceptions in JavaScript have no static type.
function wrapError(error: unknown, apiKey?: string): Error {
	if (error instanceof FinmeiAPIError) {
		const knownCredentials = collectSensitiveValues(error.details);
		if (apiKey) knownCredentials.push(apiKey);
		const safeMessage = sanitizeErrorMessage(
			error.message,
			apiKey,
			knownCredentials,
		);
		const safeDetails = redactSensitiveData(error.details, knownCredentials);
		if (safeMessage === error.message && safeDetails === error.details) {
			return error;
		}
		return new FinmeiAPIError(
			safeMessage,
			error.status,
			error.code,
			error.retryAfter,
			safeDetails,
		);
	}
	if (error instanceof ApiError) {
		// `unknown` because response body on ApiError is untrusted and can be any JSON or text.
		const rawBody: unknown = error.body;
		const knownCredentials = collectSensitiveValues(rawBody);
		const safeDetails = redactSensitiveData(rawBody, [
			...knownCredentials,
			...(apiKey ? [apiKey] : []),
		]);
		const safeMessage = sanitizeErrorMessage(
			error.message,
			apiKey,
			knownCredentials,
		);
		// Core's ApiError goes through (R8) so status, retryAfter and isRateLimitError()
		// keep working. It is rebuilt without the sent body, form data and query, which
		// carry buyers' names, emails and addresses, and with credentials cut from the
		// message and Finmei's body.
		const url = new URL(error.url, FINMEI_API_BASE);
		url.search = '';
		return new ApiError(
			{
				...error.request,
				body: undefined,
				formData: undefined,
				query: undefined,
			},
			{
				url: url.toString(),
				ok: false,
				status: error.status,
				statusText: sanitizeErrorMessage(
					error.statusText,
					apiKey,
					knownCredentials,
				),
				body: safeDetails,
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
		return new FinmeiAPIError(sanitizeErrorMessage(error.message, apiKey));
	}
	return new FinmeiAPIError('Unknown Finmei error');
}

/**
 * Executes a typed request against the Finmei REST API.
 */
export async function makeFinmeiRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: FinmeiRequestOptions = {},
): Promise<T> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('finmei', 'api_key');
	}

	const { method = 'GET', body, formData, query } = options;

	const requestOptions: ApiRequestOptions = formData
		? { method, url: endpoint, formData, query }
		: {
				method,
				url: endpoint,
				body: method === 'GET' || method === 'DELETE' ? undefined : body,
				mediaType: 'application/json',
				query,
			};

	try {
		return await request<T>(buildConfig(apiKey), requestOptions, {
			rateLimitConfig: FINMEI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw wrapError(error, apiKey);
	}
}

export type FinmeiBinaryRetryConfig = {
	maxRetries?: number;
	initialDelayMs?: number;
};

/**
 * Downloads a binary document (e.g. invoice PDF or expense attachment) from Finmei.
 */
export async function makeFinmeiBinaryRequest(
	endpoint: string,
	apiKey?: string,
	query?: Record<string, string | number | boolean | undefined>,
	retryConfig?: FinmeiBinaryRetryConfig,
): Promise<FinmeiBinaryResponse> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('finmei', 'api_key');
	}

	let urlStr = `${FINMEI_API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
	if (query && Object.keys(query).length > 0) {
		const searchParams = new URLSearchParams();
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined) {
				searchParams.append(k, String(v));
			}
		}
		const qs = searchParams.toString();
		if (qs) {
			urlStr += `?${qs}`;
		}
	}

	const headers: Record<string, string> = {
		Accept: '*/*',
	};
	if (apiKey) {
		headers.Authorization = `Bearer ${apiKey}`;
	}

	const maxRetries = retryConfig?.maxRetries ?? BINARY_MAX_RETRIES;
	const initialDelayMs =
		retryConfig?.initialDelayMs ?? BINARY_INITIAL_RETRY_DELAY_MS;

	let attempt = 0;
	while (true) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000);

		try {
			const response = await fetch(urlStr, {
				method: 'GET',
				headers,
				signal: controller.signal,
			});

			if (response.status === 429 && attempt < maxRetries) {
				const retryAfterMs = parseRetryAfterMs(response);
				const delayMs = retryAfterMs ?? initialDelayMs * 2 ** attempt;
				await response.body?.cancel().catch(() => undefined);
				clearTimeout(timeoutId);
				await new Promise((resolve) => setTimeout(resolve, delayMs));
				attempt += 1;
				continue;
			}

			if (!response.ok) {
				const retryAfter = parseRetryAfterMs(response);

				// `unknown` because error payload from non-OK response is untrusted raw text or JSON.
				let rawError: unknown;
				try {
					const text = await response.text();
					try {
						rawError = JSON.parse(text);
					} catch {
						rawError = text;
					}
				} catch {
					rawError = '';
				}
				await response.body?.cancel().catch(() => undefined);
				// Collect named secrets before redacting, so a copy elsewhere in the body goes too.
				const knownCredentials = collectSensitiveValues(rawError);
				if (apiKey) knownCredentials.push(apiKey);
				const safeError = redactSensitiveData(rawError, knownCredentials);
				throw new FinmeiAPIError(
					sanitizeErrorMessage(
						`Failed to download binary file: HTTP ${response.status}`,
						apiKey,
					),
					response.status,
					`HTTP_${response.status}`,
					retryAfter,
					safeError,
				);
			}

			const contentType =
				response.headers.get('content-type') || 'application/octet-stream';
			const arrayBuffer = await response.arrayBuffer();
			const base64 = Buffer.from(arrayBuffer).toString('base64');

			return {
				kind: 'binary',
				contentType,
				base64,
				size: arrayBuffer.byteLength,
			};
		} catch (error) {
			throw wrapError(error, apiKey);
		} finally {
			clearTimeout(timeoutId);
		}
	}
}
