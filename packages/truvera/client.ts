import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TRUVERA_API_BASE = 'https://api.truvera.io';
/** The sandbox host; test-mode API keys only work here. */
export const TRUVERA_SANDBOX_API_BASE = 'https://api-testnet.truvera.io';

// Core's request() retries a 429 three times and honours Retry-After, so the
// 429 handler in error-handlers.ts does not retry again. The object has to be
// complete: request.ts replaces its defaults wholesale, so a partial one either
// skips the rate-limit block or throws reading `headerNames`.
const TRUVERA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Truvera answers an error as `{ status, type, message, errors: [{ path,
 * message }] }`. The `type` is `ServerError` for most failures, so the status is
 * what distinguishes them and `errors` says which field was wrong. HTTP
 * failures stay core's ApiError; `truveraErrorDetails` and
 * `describeTruveraError` read this body.
 */
export type TruveraErrorDetails = {
	type?: string;
	errors: { path?: string; message?: string }[];
};

/** Reads Truvera's error body from core's ApiError, or undefined otherwise. */
export function truveraErrorDetails(
	// unknown: any thrown value; only core's ApiError has a body to read.
	error: unknown,
): TruveraErrorDetails | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body = asRecord(error.body);
	return {
		type: typeof body?.type === 'string' ? body.type : undefined,
		errors: readErrors(error.body) ?? [],
	};
}

const REDACTED = '[REDACTED]';

/** Masks the key and whatever token Truvera quotes after "JWT:". */
function scrubText(text: string, secret: string): string {
	const masked = secret.length > 0 ? text.split(secret).join(REDACTED) : text;
	return masked.replace(/(JWT:\s*)\S+/g, `$1${REDACTED}`);
}

// unknown: any JSON value from the error body; strings are scrubbed in place.
function scrub(value: unknown, secret: string): unknown {
	if (typeof value === 'string') return scrubText(value, secret);
	if (Array.isArray(value)) return value.map((entry) => scrub(entry, secret));
	const record = asRecord(value);
	if (!record) return value;
	return Object.fromEntries(
		Object.entries(record).map(([key, entry]) => [key, scrub(entry, secret)]),
	);
}

/**
 * Core's ApiError keeps the request it failed on, body included, and a
 * credential or wallet body carries subject data, emails and passwords.
 * Truvera's 401 can also echo the API key back in its message. This rebuilds
 * the same ApiError without the request body and with the key masked in the
 * response body and message. Status and retryAfter stay as they were.
 */
function withoutRequestData(error: ApiError, apiKey: string): ApiError {
	const echoed =
		JSON.stringify(scrub(error.body ?? null, apiKey)) !==
			JSON.stringify(error.body ?? null) ||
		scrubText(error.message, apiKey) !== error.message;
	if (error.request.body === undefined && !echoed) return error;
	const stripped = new ApiError(
		{ ...error.request, body: undefined },
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: echoed ? scrub(error.body, apiKey) : error.body,
		},
		echoed ? scrubText(error.message, apiKey) : error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	stripped.stack = error.stack;
	return stripped;
}

// unknown: the error body is untyped until `errors` is read as an array.
function readErrors(
	body: unknown,
): { path?: string; message?: string }[] | undefined {
	const errors = asRecord(body)?.errors;
	if (!Array.isArray(errors)) return undefined;
	return errors.flatMap((entry) => {
		const record = asRecord(entry);
		if (!record) return [];
		return [
			{
				path: typeof record.path === 'string' ? record.path : undefined,
				message:
					typeof record.message === 'string' ? record.message : undefined,
			},
		];
	});
}

export function describeTruveraError(
	status: number | undefined,
	// unknown: the error body is the documented envelope or a proxy page.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message =
		(typeof record?.message === 'string' && record.message) || fallback;
	const errors = readErrors(body) ?? [];
	const detail = errors
		.map((entry) =>
			entry.path === undefined
				? entry.message
				: `${entry.path}: ${entry.message}`,
		)
		.filter((entry): entry is string => entry !== undefined)
		.join('; ');
	const summary =
		status === undefined ? message : `Truvera ${status}: ${message}`;
	return detail ? `${summary} (${detail})` : summary;
}

export type TruveraQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TruveraRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: TruveraQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeTruveraRequest(
	apiKey: string,
	{ method, path, query, body }: TruveraRequest,
	options: { sandbox?: boolean } = {},
	// unknown: response shapes vary by operation; callers validate them with
	// their own output schemas.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: options.sandbox ? TRUVERA_SANDBOX_API_BASE : TRUVERA_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: see the return type above.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TRUVERA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through as an ApiError (plugin rules R8), only
		// without the request data it carried.
		if (error instanceof ApiError) throw withoutRequestData(error, apiKey);
		throw error;
	}
}
