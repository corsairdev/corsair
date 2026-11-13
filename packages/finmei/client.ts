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

// `unknown` because untrusted value requires runtime type narrowing before record inspection.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because untrusted error payload or JSON data must be deeply sanitized before inspection.
export function redactSensitiveData(data: unknown): unknown {
	if (data === null || data === undefined) return data;
	if (typeof data === 'string') return data;
	if (typeof data === 'number' || typeof data === 'boolean') return data;
	if (Array.isArray(data)) {
		return data.map((item) => redactSensitiveData(item));
	}
	if (isRecord(data)) {
		const sanitized: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(data)) {
			if (isSensitiveKey(key)) {
				sanitized[key] = '[REDACTED]';
			} else {
				sanitized[key] = redactSensitiveData(val);
			}
		}
		return sanitized;
	}
	return data;
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

// `unknown` because caught exceptions in JavaScript have no static type.
function wrapError(error: unknown): FinmeiAPIError {
	if (error instanceof FinmeiAPIError) return error;
	if (error instanceof ApiError) {
		// `unknown` because response body on ApiError is untrusted and can be any JSON or text.
		const rawBody: unknown = error.body;
		const safeDetails = redactSensitiveData(rawBody);
		return new FinmeiAPIError(
			error.message,
			error.status,
			typeof error.status === 'number' ? `HTTP_${error.status}` : undefined,
			error.retryAfter,
			safeDetails,
		);
	}
	if (error instanceof Error) {
		return new FinmeiAPIError(error.message);
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
		throw wrapError(error);
	}
}

/**
 * Downloads a binary document (e.g. invoice PDF or expense attachment) from Finmei.
 */
export async function makeFinmeiBinaryRequest(
	endpoint: string,
	apiKey?: string,
	query?: Record<string, string | number | boolean | undefined>,
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

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 30000);

	try {
		const response = await fetch(urlStr, {
			method: 'GET',
			headers,
			signal: controller.signal,
		});

		if (!response.ok) {
			let retryAfter: number | undefined;
			const retryHeader = response.headers.get('retry-after');
			if (retryHeader) {
				const parsed = Number.parseInt(retryHeader, 10);
				if (!Number.isNaN(parsed)) {
					retryAfter = parsed * 1000;
				}
			}

			// `unknown` because error payload from non-OK response is untrusted raw text or JSON.
			let rawError: unknown;
			try {
				rawError = await response.json();
			} catch {
				rawError = await response.text().catch(() => '');
			}
			await response.body?.cancel().catch(() => undefined);
			const safeError = redactSensitiveData(rawError);
			throw new FinmeiAPIError(
				`Failed to download binary file: HTTP ${response.status}`,
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
		throw wrapError(error);
	} finally {
		clearTimeout(timeoutId);
	}
}
