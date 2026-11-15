import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GODIAL_API_BASE = 'https://enterprise.godial.cc';

// Core retries a 429 up to three times and honours Retry-After; GoDial sends
// no x-ratelimit-* headers, so only Retry-After is read.
const GODIAL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

const REDACTED = '[REDACTED]';

// Request fields that carry no personal data; everything else in a contact body
// (phones, email, name, address, notes, custom field values) is scrubbed.
const NON_PERSONAL_FIELDS = new Set(['listId', 'assignmentMode', 'accountsId']);

export type GoDialRequestOptions = {
	method: 'GET' | 'POST';
	apiKey: string;
	// unknown because contact fields include a JSON array (customFields) and an object (source_marketing).
	body?: Record<string, unknown>;
};

// unknown because contact bodies mix strings, arrays and objects.
function collectStrings(value: unknown, out: Set<string>): void {
	if (typeof value === 'string') {
		if (value.length > 0) out.add(value);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) collectStrings(item, out);
		return;
	}
	if (value !== null && typeof value === 'object') {
		for (const item of Object.values(value)) collectStrings(item, out);
	}
}

function scrubString(text: string, secrets: Set<string>): string {
	let result = text;
	for (const secret of secrets) result = result.split(secret).join(REDACTED);
	return result;
}

// unknown because the provider's error body is untrusted JSON of any shape.
function scrubValue(value: unknown, secrets: Set<string>): unknown {
	if (typeof value === 'string') return scrubString(value, secrets);
	if (Array.isArray(value))
		return value.map((item) => scrubValue(item, secrets));
	if (value !== null && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [
				scrubString(key, secrets),
				scrubValue(item, secrets),
			]),
		);
	}
	return value;
}

// GoDial answers a missing or unknown access_token with HTTP 500 and this
// TypeError instead of a 401.
function isInvalidTokenError(error: ApiError): boolean {
	return (
		error.status === 500 &&
		/reading 'companyId'/.test(JSON.stringify(error.body ?? ''))
	);
}

/**
 * Rebuilds a transport error so that contact details sent in the request body
 * (phone numbers, emails, names) and the access token never reach error
 * messages, error bodies or logs. Status and rate-limit fields are kept.
 */
function sanitizeError(
	error: ApiError,
	options: GoDialRequestOptions,
): ApiError {
	const secrets = new Set<string>();
	for (const [key, value] of Object.entries(options.body ?? {})) {
		if (!NON_PERSONAL_FIELDS.has(key)) collectStrings(value, secrets);
	}
	collectStrings(options.apiKey, secrets);
	const invalidToken = isInvalidTokenError(error);
	// A value under three characters (a two-letter name) can't be replaced
	// safely inside other text, so the provider's message and body are dropped
	// and only the status is reported.
	const hasShortValue = [...secrets].some((secret) => secret.length < 3);
	const { body: _requestBody, ...requestWithoutBody } = error.request;
	return new ApiError(
		{
			...requestWithoutBody,
			...(options.body ? { body: REDACTED } : {}),
		},
		{
			url: error.url,
			ok: false,
			status: invalidToken ? 401 : error.status,
			statusText: invalidToken ? 'Unauthorized' : error.statusText,
			body: hasShortValue ? undefined : scrubValue(error.body, secrets),
		},
		invalidToken
			? 'GoDial rejected the access token (missing, invalid or revoked)'
			: hasShortValue
				? `GoDial request failed with HTTP ${error.status}`
				: scrubString(error.message, secrets),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** GoDial requires access_token in the query string on every API request. */
// unknown because the reference documents every response as an empty example object.
export async function makeGoDialRequest(
	path: string,
	options: GoDialRequestOptions,
): Promise<unknown> {
	if (options.apiKey.length === 0) {
		throw new AuthMissingError('godial', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: GODIAL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// GoDial uses a query token, not an Authorization header.
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: { access_token: options.apiKey },
		body: options.body,
		mediaType: options.body ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		// unknown because the shared transport returns untrusted provider JSON before endpoint validation.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GODIAL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeError(error, options);
		throw error;
	}
}
