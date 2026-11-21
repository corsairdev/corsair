import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Paystack documents no per-request rate-limit retry contract, so 429s get
 * core's standard handling: up to three retries honouring Retry-After (R8:
 * the plugin adds no second retry layer). A 429 is refused before the call
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
 * body and query. Customer emails and amounts ride through the request,
 * which core's own ApiError keeps; a path segment holding an email
 * (customers.get by email) is masked too.
 */
export function buildPaystackApiError(
	message: string,
	options: {
		method: string;
		/** Request path, without query. */
		path: string;
		status: number;
		statusText?: string;
		// unknown: error bodies are Paystack's { status, message, ... }
		// envelope or non-JSON from a proxy.
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
 * Extracts the readable part of a Paystack error body. Errors are
 * `{"status":false,"message":"Invalid key","type":"validation_error","code":"invalid_Key"}`
 * (verified live with an invalid key). Paystack answers some 400s with
 * HTTP 200 and status false in the body, so callers treat those as
 * failures too (see assertOk below).
 */
export function describePaystackError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ?? fallback;
	return text;
}

export type PaystackQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PaystackRequest = {
	method: 'GET' | 'POST' | 'PUT';
	path: string;
	query?: PaystackQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST/PUT shapes.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Paystack request. Secret keys authenticate with an
 * Authorization Bearer header.
 * https://paystack.com/docs/api/
 */
export async function makePaystackRequest(
	apiKey: string,
	{ method, path, query, body }: PaystackRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.paystack.co',
		VERSION: '1.0.0',
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
		query: method === 'GET' ? query : undefined,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType:
			method === 'POST' || method === 'PUT' ? 'application/json' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		const result = await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
		return assertOk(result, method, path);
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (customer emails, amounts). Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status.
			const detail = describePaystackError(
				error.body,
				error.statusText || 'request failed',
			);
			throw buildPaystackApiError(`Paystack ${error.status}: ${detail}`, {
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

/**
 * Paystack answers some validation failures with HTTP 200 and
 * `status: false` in the body. A 200 that says status false is a failure
 * the caller must see, not data.
 */
// unknown: the raw result is the untouched response body; only the status
// flag is inspected before the endpoint's schema parses it.
export function assertOk(
	// unknown: the parsed response body, any shape until checked here.
	result: unknown,
	method = 'GET',
	path = '',
): unknown {
	const record = asRecord(result);
	if (record && record.status === false) {
		throw buildPaystackApiError(
			`Paystack 200: ${describePaystackError(record, 'request returned status false')}`,
			{
				method,
				path,
				status: 200,
				body: record,
			},
		);
	}
	return result;
}
