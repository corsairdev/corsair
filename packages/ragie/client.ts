import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const RAGIE_API_BASE = 'https://api.ragie.ai';

// A deep-search response can generate for well past corsair/http's 20 second
// default, and document processing create calls return only after the upload
// is accepted.
const RAGIE_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Ragie does not document the header and
// live 429 behavior is unverified (api.ragie.ai blocks non-browser clients).
const RAGIE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Error bodies are `{ detail }` on 400, 401, 402, 404, 429 and 500, and
 * FastAPI's `{ detail: [...] }` on 422. The key travels in the Authorization
 * header, which error messages never print, so the response body is safe to
 * keep on the error.
 */
export class RagieAPIError extends Error {
	readonly status?: number;
	/** True when a failed call may be sent again; drives 5xx and transport retries. */
	readonly replaySafe: boolean;
	/** Milliseconds from a Retry-After header, when Ragie sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request; set on transport failures too. */
	readonly method?: string;
	/** True when the request never got an HTTP answer (reset, DNS, abort). */
	readonly transport: boolean;
	// unknown: the body is the `{ detail }` envelope, but a proxy can answer
	// HTML or text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			replaySafe?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RagieAPIError';
		this.status = options.status;
		this.replaySafe = options.replaySafe ?? options.method === 'GET';
		this.body = options.body;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

export function describeRagieError(
	status: number | undefined,
	// unknown: the body is an untyped error body until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const detail = record?.detail;
	const text =
		typeof detail === 'string' && detail.length > 0
			? detail
			: // FastAPI's 422 validation errors answer detail as an array.
				detail !== undefined && detail !== null
				? JSON.stringify(detail)
				: fallback;
	return status === undefined ? text : `Ragie ${status}: ${text}`;
}

export type RagieQuery = Record<string, string | number | boolean | undefined>;

export type RagieRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: RagieQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Form fields for a multipart upload; strings and Blobs go over as they are, objects as JSON. */
	// unknown: multipart fields mix binary and JSON-ready values.
	formData?: Record<string, unknown>;
	/** A failed call may be sent again. GETs default to true; POST /retrievals opts in. */
	replaySafe?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless answers: 200 on documents.delete and 204-class
// empty bodies.
export async function makeRagieRequest(
	apiKey: string,
	{ method, path, query, body, formData, replaySafe }: RagieRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: RAGIE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: RAGIE_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		formData,
		mediaType:
			formData === undefined && body !== undefined
				? 'application/json'
				: undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RAGIE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause stays behind: the response body is kept on this error, and
			// ApiError's own copy adds nothing that the key-hygiene tests have not
			// pinned (the key rides in a header, which no error field prints).
			throw new RagieAPIError(
				describeRagieError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method,
					replaySafe,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RagieAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				replaySafe,
			});
		}
		throw new RagieAPIError('Unknown Ragie error', {
			method,
			transport: true,
			replaySafe,
		});
	}
}
