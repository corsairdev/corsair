import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Ninox serves the public API from `go.ninox.com`, not `api.ninox.com`: the
 * latter answers "End-point not found" and the app host answers a Cloudflare
 * page. The docs' own Swagger instance is on `go.ninox.com/api/docs`.
 */
export const NINOX_API_BASE = 'https://go.ninox.com/api/v1';

// Retries belong to error-handlers.ts. Ninox documents no Retry-After, so the
// name is kept only so a proxy that sends one is honoured.
const NINOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Ninox sends `{ "error": { "message": "..." } }` for a JSON failure, but its
 * edge answers a bare `401 text/plain "Unauthorized"` when the key is missing,
 * so both shapes are read. A 403 is the key lacking the grant for the resource,
 * not a bad key, and a 409 is the `_expected` conflict or an ambiguous upsert.
 */
export class NinoxAPIError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NinoxAPIError';
		this.method = options.method;
	}
}

/**
 * Rebuilds Ninox's HTTP error as a core `ApiError` with a readable message, so
 * status, Retry-After and the rate-limit fields reach core (R8). The body keeps
 * only the provider's message; the sent body is dropped, because it holds the
 * caller's record values.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const message =
		readString(asRecord(asRecord(error.body)?.error), 'message') ??
		(typeof error.body === 'string' && error.body.length > 0
			? error.body.slice(0, 200)
			: undefined);
	return new ApiError(
		{ ...request, url: request.url.split('?')[0] ?? request.url },
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: message ? { error: { message } } : undefined,
		},
		describeNinoxError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// unknown: see NinoxAPIError.
export function describeNinoxError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message =
		readString(asRecord(asRecord(body)?.error), 'message') ??
		// The edge answers a bare text body for a missing key.
		(typeof body === 'string' && body.length > 0
			? body.slice(0, 200)
			: undefined) ??
		fallback;
	const label = status === undefined ? '' : `Ninox ${status}: `;
	return `${label}${message}`;
}

export type NinoxQuery = Record<string, string | number | boolean | undefined>;

export type NinoxRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** The path after the workspace id, or the whole path for a workspace read. */
	path: string;
	query?: NinoxQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeNinoxRequest(
	apiKey: string,
	{ method, path, query, body }: NinoxRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NINOX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NINOX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NinoxAPIError(error.message, { cause: error, method });
		}
		throw new NinoxAPIError('Unknown Ninox error', { method });
	}
}

/**
 * Encodes one path segment. A module or table name is user-chosen and can hold
 * spaces or an ampersand, and Ninox addresses them by name rather than by id.
 */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Builds the workspace-scoped path every resource route shares. Ninox repeats
 * the same five segments on every call, so one helper keeps them in step.
 */
export function workspacePath(workspaceId: string): string {
	return `/workspace/${segment(workspaceId)}`;
}
