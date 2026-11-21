import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Pilvio documents no rate limits, so 429s get core's standard handling:
 * up to three retries honouring Retry-After (R8: the plugin adds no second
 * retry layer).
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A failed call throws this: core's `ApiError` (R8: core and the handlers
 * read `status` and `retryAfter` from it), rebuilt without the request
 * body and query. Resource names and credentials ride through the request,
 * which core's own ApiError keeps on the request.
 */
export class PilvioAPIError extends ApiError {
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method: string;

	constructor(
		message: string,
		options: {
			method: string;
			/** Request path, without query. */
			path: string;
			status: number;
			statusText?: string;
			// unknown: error bodies can be the {"message": …} envelope, the
			// {"errors": {"Error": …}} business envelope, or non-JSON from
			// the edge.
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(
			{
				method: options.method as ApiRequestOptions['method'],
				url: options.path,
			},
			{
				url: options.path,
				ok: false,
				status: options.status,
				statusText: options.statusText ?? '',
				body: options.body,
			},
			message,
			{ retryAfter: options.retryAfter },
		);
		this.name = 'PilvioAPIError';
		this.method = options.method;
	}
}

/**
 * Extracts the readable part of a Pilvio error body. Authentication
 * failures answer 403 `{"message":"Invalid authentication credentials"}`,
 * unknown routes 404 `{"message":"no route and no API found with those
 * values"}`, and business errors `{"errors":{"Error":"…"}}` (all three
 * verified live or per the docs, 2026-11-21).
 */
export function describePilvioError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const errors = record?.errors;
	const businessMessage =
		(typeof errors === 'object' && errors !== null
			? (errors as Record<string, unknown>)['Error']
			: undefined) ?? errors;
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof businessMessage === 'string' && businessMessage.length > 0
			? businessMessage
			: undefined) ??
		fallback;
	return text;
}

export type PilvioQuery = Record<string, string | number | boolean | undefined>;

export type PilvioRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: PilvioQuery;
	/** Form-encoded body (default) or JSON body per the endpoint docs. */
	body?: Record<string, unknown>;
	/** Send the body as JSON instead of the form encoding most writes use. */
	json?: boolean;
};

/**
 * Authenticated Pilvio request. API tokens authenticate as the raw
 * `apikey` header, created in the Pilvio user interface. Most write
 * endpoints take form-encoded bodies; SSH keys and firewalls take JSON.
 * https://api.pilvio.com (Slate docs portal)
 */
export async function makePilvioRequest(
	apiKey: string,
	{ method, path, query, body, json }: PilvioRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.pilvio.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			apikey: apiKey,
		},
	};

	const hasBody = body !== undefined && (method !== 'GET' || json === true);
	const headers = hasBody
		? {
				'Content-Type':
					json === true
						? 'application/json'
						: 'application/x-www-form-urlencoded',
			}
		: undefined;

	// JSON bodies pass through as objects: core serializes them per the
	// JSON media type. Form bodies are encoded here because core would
	// stringify the object instead.
	const encodedBody = hasBody
		? json === true
			? body
			: new URLSearchParams(
					Object.entries(body as Record<string, string>).filter(
						([, value]) => value !== undefined,
					) as [string, string][],
				).toString()
		: undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: encodedBody,
		mediaType:
			json === true ? 'application/json' : 'application/x-www-form-urlencoded',
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(
			config,
			{ ...requestOptions, ...(headers === undefined ? {} : { headers }) },
			{ rateLimitConfig: RATE_LIMIT_CONFIG },
		);
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (credentials and passwords). Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status.
			const detail = describePilvioError(
				error.body,
				error.statusText || 'request failed',
			);
			throw new PilvioAPIError(`Pilvio ${error.status}: ${detail}`, {
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
