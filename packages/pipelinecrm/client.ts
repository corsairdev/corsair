import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Pipeline CRM rate limits tokens to 10 requests per second per user;
 * exceeding answers 429 {"error":"Rate limit exceeded"}, so 429s get
 * core's standard handling: up to three retries honouring Retry-After
 * (R8: the plugin adds no second retry layer).
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
 * body and query. Record payloads ride through the request, which core's
 * own ApiError keeps on the request.
 */
export class PipelineCrmAPIError extends ApiError {
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
			// unknown: error bodies are the documented {"error": …} envelope
			// or non-JSON from the edge.
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
		this.name = 'PipelineCrmAPIError';
		this.method = options.method;
	}
}

/**
 * Extracts the readable part of a Pipeline CRM error body. Every non-2xx
 * answers `{"error": "<message>"}` (verified live with an invalid token:
 * 401 `{"error":"Unknown api_key"}`).
 */
export function describePipelineCrmError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.error === 'string' && record.error.length > 0
			? record.error
			: undefined) ?? fallback;
	return text;
}

export type PipelineCrmQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type PipelineCrmRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: PipelineCrmQuery;
	/** JSON body, wrapped in the record name by the endpoints. */
	body?: Record<string, unknown>;
};

/**
 * Authenticated Pipeline CRM request. API tokens authenticate as an
 * Authorization Bearer header (tokens begin pcrm_live_ in production).
 * https://app.pipelinecrm.com/llms/getting-started.md
 */
export async function makePipelineCrmRequest(
	apiKey: string,
	{ method, path, query, body }: PipelineCrmRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.pipelinecrm.com',
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
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (record payloads). Core's fallback
			// message embeds the whole response body, so the text comes from
			// the provider's error or the status.
			const detail = describePipelineCrmError(
				error.body,
				error.statusText || 'request failed',
			);
			throw new PipelineCrmAPIError(`Pipeline CRM ${error.status}: ${detail}`, {
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
