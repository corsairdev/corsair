import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GosquaredAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GosquaredAPIError';
	}
}

export const GOSQUARED_API_BASE = 'https://api.gosquared.com';

const SENSITIVE_FIELD_NAMES = new Set([
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
	'sitetoken',
	'email',
	'customer',
	'person',
	'personid',
	'phone',
	'phonenumber',
	'ip',
	'ipaddress',
	'creditcard',
]);

/**
 * Scrubs credentials and personal identifiers from raw URLs and message strings.
 */
export function scrubUrl(rawUrl: string): string {
	try {
		const parsed = new URL(rawUrl);
		for (const [key] of parsed.searchParams) {
			const normalized = key.toLowerCase().replace(/[-_]/g, '');
			if (
				SENSITIVE_FIELD_NAMES.has(normalized) ||
				/key|token|secret|email|auth|credential/i.test(key)
			) {
				parsed.searchParams.set(key, '[REDACTED]');
			}
		}
		return parsed.toString();
	} catch {
		return rawUrl
			.replace(
				/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
				'[REDACTED]',
			)
			.replace(
				/([?&]|\b)(api_key|site_token|token|key|secret|email)=[^&\s]+/gi,
				'$1$2=[REDACTED]',
			);
	}
}

/**
 * Normalizes and redacts credentials from objects and error payloads.
 */
// `unknown` because response bodies and error payloads can be arbitrary JSON.
export function redactSensitiveData(value: unknown): unknown {
	if (typeof value === 'string') {
		return value
			.replace(
				/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
				'[REDACTED]',
			)
			.replace(
				/([?&]|\b)(api_key|site_token|token|key|secret|email)=[^&\s]+/gi,
				'$1$2=[REDACTED]',
			);
	}
	if (Array.isArray(value)) {
		// `unknown` because arrays can contain arbitrary nested JSON values.
		return value.map((item: unknown) => redactSensitiveData(item));
	}
	if (value !== null && typeof value === 'object') {
		// `unknown` because record values are untrusted JSON until parsed by schemas.
		const record = value as Record<string, unknown>;
		// `unknown` because sanitized values retain the original shape with sensitive fields masked.
		const redacted: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(record)) {
			const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
			if (
				SENSITIVE_FIELD_NAMES.has(normalizedKey) ||
				/key|token|secret|password|auth|credential|email/i.test(key)
			) {
				redacted[key] = '[REDACTED]';
			} else {
				redacted[key] = redactSensitiveData(val);
			}
		}
		return redacted;
	}
	return value;
}

/**
 * Sanitizes errors to prevent credential leakage in logs or propagated exceptions
 * while preserving ApiError properties (status, retryAfter).
 */
// `unknown` because an exception value can be any thrown type.
export function sanitizeError(error: unknown): Error {
	if (error instanceof ApiError) {
		const ok = error.status >= 200 && error.status < 300;
		const sanitized = new ApiError(
			{
				...error.request,
				url: error.request.url
					? scrubUrl(error.request.url)
					: error.request.url,
				query:
					error.request.query !== undefined
						? (redactSensitiveData(error.request.query) as Record<
								string,
								// `unknown` because query parameter values can be strings, numbers, or boolean values.
								unknown
							>)
						: undefined,
				body:
					error.request.body !== undefined
						? redactSensitiveData(error.request.body)
						: undefined,
			},
			{
				status: error.status,
				statusText: error.statusText,
				url: error.url ? scrubUrl(error.url) : error.url,
				ok,
				body:
					error.body !== undefined
						? redactSensitiveData(error.body)
						: undefined,
			},
			error.message ? scrubUrl(error.message) : 'ApiError',
			{
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			},
		);
		return sanitized;
	}
	if (error instanceof Error) {
		return error;
	}
	return new GosquaredAPIError('Unknown error');
}

export async function makeGosquaredRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because body is endpoint-specific JSON validated by Zod before transmission.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		siteToken?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, siteToken } = options;

	// Explicitly empty key means unconfigured credentials; fail fast.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('gosquared', 'api_key');
	}

	const queryParams: Record<string, string | number | boolean | undefined> = {
		...query,
	};
	if (apiKey) {
		queryParams.api_key = apiKey;
	}
	if (siteToken && queryParams.site_token === undefined) {
		queryParams.site_token = siteToken;
	}

	const config: OpenAPIConfig = {
		BASE: GOSQUARED_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 30_000,
		HEADERS: {
			'Content-Type': 'application/json',
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
		query: queryParams,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		throw sanitizeError(error);
	}
}
