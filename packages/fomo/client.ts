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

// Event customer fields (types.ts). Fomo can echo them in an error reply; their values never go on an error (R8).
const CUSTOMER_KEY_NAMES = new Set([
	'emailaddress',
	'firstname',
	'ipaddress',
	'city',
	'province',
	'country',
	'customeventfieldsattributes',
]);

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function maskEmails(text: string): string {
	return text.replace(EMAIL_PATTERN, '[email]');
}

// `unknown` because error replies are arbitrary JSON. Customer-field values are dropped and email
// addresses in any string are masked. Inside an `errors` object the customer keys stay with their
// messages, so `errors.email_address: ['is invalid']` still names the bad field.
function redactCustomerData(
	value: unknown,
	key?: string,
	inErrors = false,
): unknown {
	if (
		key !== undefined &&
		!inErrors &&
		CUSTOMER_KEY_NAMES.has(normalizeKey(key))
	) {
		return '[REDACTED]';
	}
	if (typeof value === 'string') return maskEmails(value);
	if (Array.isArray(value))
		return value.map((item) => redactCustomerData(item));
	if (!isRecord(value)) return value;
	// `unknown` because the sanitized object preserves untrusted JSON values.
	const result: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(value)) {
		result[k] = redactCustomerData(v, k, key === 'errors');
	}
	return result;
}

function normalizeKey(key: string): string {
	return key.toLowerCase().replace(/[-_]/g, '');
}

// `unknown` because untrusted JSON objects must be narrowed at runtime before inspection.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because arbitrary JSON structures may appear in request/response payloads before sanitization.
// Values under secret-named keys are replaced; the caller's key is also removed from free-text strings.
export function redactValue(value: unknown, apiKey?: string): unknown {
	if (value === null || value === undefined) return value;
	if (typeof value === 'string') {
		return apiKey && apiKey.length > 0
			? value.replaceAll(apiKey, '[REDACTED]')
			: value;
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactValue(item, apiKey));
	}
	if (!isRecord(value)) return value;
	// `unknown` because the sanitized object preserves untrusted JSON values.
	const result: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(value)) {
		if (SENSITIVE_KEY_NAMES.has(normalizeKey(k))) {
			result[k] = '[REDACTED]';
		} else {
			result[k] = redactValue(v, apiKey);
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
		// Skip plain words so Fomo's 401 body "Token is required." stays readable.
		/(?:Token|Bearer)\s+(?!(?:is|was|has|not|required|missing|invalid|expired)\b)[A-Za-z0-9_\-.]+/gi,
		'Token [REDACTED]',
	);
	sanitized = sanitized.replace(
		/(^|[\s?&])(api_?key|token|secret|client_secret)=([^\s&#]+)/gi,
		'$1$2=[REDACTED]',
	);
	return sanitized;
}

/**
 * When Fomo's error body has no `message`, `error` or `detail`, core copies the
 * whole body into the message ("Generic Error: ... body: {...}"), customer
 * fields included. That copy is swapped for the cleaned body; if it can't be
 * found, the message keeps only the status.
 */
function fallbackMessageFromCleanBody(
	error: ApiError,
	// `unknown` because the cleaned body is still arbitrary JSON.
	cleanBody: unknown,
): string {
	if (!error.message.startsWith('Generic Error:')) return error.message;
	let rawBody: string | undefined;
	let safeBody: string | undefined;
	try {
		rawBody = JSON.stringify(error.body, null, 2);
		safeBody = JSON.stringify(cleanBody, null, 2);
	} catch {
		rawBody = undefined;
	}
	if (rawBody && safeBody && error.message.includes(rawBody)) {
		return error.message.replace(rawBody, () => safeBody ?? '');
	}
	return `Generic Error: status: ${error.status}; status text: ${error.statusText}`;
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
			// `unknown` because error response body contains arbitrary JSON that must be sanitized.
			const sanitizedResponseBody: unknown = redactCustomerData(
				redactValue(error.body, apiKey),
			);
			const sanitizedMessage = maskEmails(
				redactMessage(
					fallbackMessageFromCleanBody(error, sanitizedResponseBody),
					apiKey,
				),
			);
			// The sent body (event customer fields: email, name, IP) and the query (search values)
			// stay off the error (R8); status, retryAfter and Fomo's own reply are kept.
			const url = new URL(error.url, FOMO_API_BASE);
			url.search = '';

			const sanitizedError = new ApiError(
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
					statusText: maskEmails(redactMessage(error.statusText, apiKey)),
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
