import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

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
 * FastAPI's `{ detail: [...] }` on 422. Core's ApiError passes through
 * unchanged (PLUGIN_PR_RULES R8); `describeRagieError` reads its body.
 */
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

export type RagieQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type RagieRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: RagieQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Form fields for a multipart upload; strings and Blobs go over as they are, objects as JSON. */
	// unknown: multipart fields mix binary and JSON-ready values.
	formData?: Record<string, unknown>;
	/**
	 * Ragie reads the partition from a `partition` header on reads, deletes
	 * and updates (a `partition` query parameter is ignored). Creates take it
	 * in the body instead.
	 */
	partition?: string;
	/** `binary` returns `{ bytes, contentType }` (document source, chunk media). */
	responseType?: 'binary';
};

/** POST routes that only read: a failed call may be sent again. */
export const RAGIE_REPLAY_SAFE_POSTS = new Set(['/retrievals']);

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless answers: 200 on documents.delete and 204-class
// empty bodies.
export async function makeRagieRequest(
	apiKey: string,
	{
		method,
		path,
		query,
		body,
		formData,
		partition,
		responseType,
	}: RagieRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: RAGIE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: RAGIE_TIMEOUT_MS,
		HEADERS: {
			Accept: responseType === 'binary' ? '*/*' : 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...(partition !== undefined ? { partition } : {}),
		},
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
		...(responseType ? { responseType } : {}),
	};

	return await request<unknown>(config, requestOptions, {
		rateLimitConfig: RAGIE_RATE_LIMIT_CONFIG,
	});
}
