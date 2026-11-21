import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Passcreator documents no rate-limit retry contract, so 429s get core's
 * standard handling: up to three retries honouring Retry-After (R8: the
 * plugin adds no second retry layer). A 429 is refused before the call
 * runs, so a retry is safe for the writes too.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A failed call throws core's `ApiError` (R8: core and the handlers read
 * `status` and `retryAfter` from it, and management maps errors named
 * ApiError to a provider error with its status), rebuilt without the request
 * body and query. A path segment holding an email (passes.sendEmail puts the
 * recipient in the path) is masked.
 */
export function buildPasscreatorApiError(
	message: string,
	options: {
		method: string;
		/** Request path, without query. */
		path: string;
		status: number;
		statusText?: string;
		// unknown: error bodies are { ErrorMessage } or non-JSON from a proxy.
		body?: unknown;
		retryAfter?: number;
	},
): ApiError {
	const url = options.path
		.split('/')
		.map((part) =>
			part.includes('@') || part.toLowerCase().includes('%40')
				? '[email]'
				: part,
		)
		.join('/');
	return new ApiError(
		{ method: options.method as ApiRequestOptions['method'], url },
		{
			url,
			ok: false,
			status: options.status,
			statusText: options.statusText ?? '',
			body: options.body,
		},
		message,
		{ retryAfter: options.retryAfter },
	);
}

/**
 * Extracts the readable part of a Passcreator error body. Writes use the
 * `{ success, description, errors, statusCode }` envelope; reads and auth
 * failures answer plain text or a JSON message.
 */
export function describePasscreatorError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.description === 'string' && record.description.length > 0
			? record.description
			: undefined) ??
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof record?.detail === 'string' && record.detail.length > 0
			? record.detail
			: undefined) ??
		fallback;
	return text;
}

export type PasscreatorQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PasscreatorRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: PasscreatorQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST/PUT shapes.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Passcreator request. API keys authenticate with the raw key
 * in the Authorization header — no scheme word.
 * https://developer.passcreator.com/en (Authentication)
 */
export async function makePasscreatorRequest(
	apiKey: string,
	{ method, path, query, body }: PasscreatorRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://app.passcreator.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType:
			method === 'POST' || method === 'PUT' ? 'application/json' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (pass properties carry personal
			// data). Core's fallback message embeds the whole response body,
			// so the text comes from the provider's error or the status.
			// A short plain-text body (the gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describePasscreatorError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw buildPasscreatorApiError(`Passcreator ${error.status}: ${detail}`, {
				method,
				path,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
				retryAfter: error.retryAfter,
			});
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
