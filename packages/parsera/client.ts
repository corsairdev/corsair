import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Parsera documents no rate-limit retry contract, so 429s get core's
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
 * `status` and `retryAfter` from it), rebuilt with only the method and the
 * path so request bodies and queries stay out of it.
 */
/**
 * A 422 lists each invalid field with the whole request body in `input`
 * (page content, prompts, cookies). The rebuilt error keeps the field
 * locations and messages only.
 */
// unknown: the provider's error body, narrowed here before it is kept.
function withoutEchoedInput(body: unknown): unknown {
	if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
	const record = body as Record<string, unknown>;
	if (!Array.isArray(record.detail)) return body;
	return {
		...record,
		detail: record.detail.map((entry) => {
			if (!entry || typeof entry !== 'object') return entry;
			const { input: _input, ...rest } = entry as Record<string, unknown>;
			return rest;
		}),
	};
}

function strippedApiError(
	error: ApiError,
	method: ApiRequestOptions['method'],
	path: string,
	message: string,
): ApiError {
	return new ApiError(
		{ method, url: path },
		{
			url: path,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: withoutEchoedInput(error.body),
		},
		message,
		{ retryAfter: error.retryAfter },
	);
}

/**
 * Extracts the readable part of a Parsera error body. Errors are
 * `{"detail":"Invalid API key"}` (verified live with an invalid key on every
 * documented route).
 */
export function describeParseraError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.detail === 'string' && record.detail.length > 0
			? record.detail
			: undefined) ??
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		fallback;
	return text;
}

export type ParseraRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST shapes.
	body?: unknown;
	/**
	 * Request timeout in ms; core's default is 20 s. Synchronous scraper
	 * runs wait up to five minutes before Parsera answers a run_id.
	 */
	timeoutMs?: number;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Parsera request. API keys authenticate in the X-API-KEY
 * header. https://parsera.org/docs/api
 */
export async function makeParseraRequest(
	apiKey: string,
	{ method, path, body, timeoutMs }: ParseraRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.parsera.org',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		...(timeoutMs === undefined ? {} : { TIMEOUT: timeoutMs }),
		HEADERS: {
			Accept: 'application/json',
			'X-API-KEY': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (prompts and page content). Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status. A short
			// plain-text body (the gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describeParseraError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw strippedApiError(
				error,
				method,
				path,
				`Parsera ${error.status}: ${detail}`,
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
