import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KEEN_API_BASE = 'https://api.keen.io';

// Keen runs a query for up to five minutes before it stops it and answers 504
// `QueryIncompleteError`, so the client waits a little past that: a shorter
// timeout would abandon queries Keen is still going to answer.
const KEEN_TIMEOUT_MS = 310_000;

// Keen answers every JSON error with `{ message, error_code }`. The codes carry
// the meaning: `InvalidApiKeyError` is a bad key, and `QueryIncompleteError` is
// the five minute timeout, which is a 504.
const INVALID_KEY_CODE = 'InvalidApiKeyError';
const QUERY_INCOMPLETE_CODE = 'QueryIncompleteError';
const RESOURCE_NOT_FOUND_CODE = 'ResourceNotFoundError';

/**
 * Keen needs three credentials, and they are not interchangeable:
 *
 * - the **project ID**, which is part of the path of every call,
 * - the **API key**, which authenticates the call, and
 * - the key's **kind**, because a write key cannot read and a read key cannot
 *   write. Which kind arrived is not visible from the key itself.
 *
 * The three are account-level fields. An `api_key` account may declare extra
 * account fields, but `get_integration_credentials` is only installed for
 * `oauth_2`, so reading them through that would throw at runtime.
 */
export type KeenCredentials = {
	apiKey: string;
	projectId: string;
};

// unknown: the body is an untyped error body until asRecord narrows it.
function errorFields(body: unknown): {
	message?: string;
	code?: string;
} {
	const record = asRecord(body);
	const message = record?.message;
	const code = record?.error_code;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'string' && code.length > 0 ? code : undefined,
	};
}

/**
 * Keen puts the offending key in its 401 message: `Specified API Key is
 * invalid. API Key: 'abc123'.` Copying that message into an error would write
 * the key into every log line that prints it, so the key is replaced before the
 * message leaves this module.
 */
export function redactKeenKey(text: string, apiKey: string): string {
	if (!apiKey) return text;
	return text.split(apiKey).join('[REDACTED]');
}

// Keen documents a 429 per endpoint category and a block that lifts when the
// rate drops; it sends no Retry-After, so the handler's own backoff is the only
// delay available.
const KEEN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Keen failure that got no answer: a reset, DNS failure, abort or timeout, or
 * a request with no project ID. An HTTP error from Keen stays core's `ApiError`
 * (see `sanitizeApiError`), so its status and rate-limit fields reach core and
 * the error handlers.
 */
export class KeenAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KeenAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

/** Keen's `error_code` on an HTTP error, such as `InvalidApiKeyError`. */
// unknown: error handlers receive whatever was thrown and narrow it to ApiError here.
export function keenErrorCode(error: unknown): string | undefined {
	return error instanceof ApiError ? errorFields(error.body).code : undefined;
}

// unknown: any thrown value; only an ApiError has a status.
function keenStatus(error: unknown): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// unknown: error handlers pass the raw thrown value.
export function isKeenRateLimit(error: unknown): boolean {
	return keenStatus(error) === 429;
}

// unknown: error handlers pass the raw thrown value.
export function isKeenAuthError(error: unknown): boolean {
	return keenStatus(error) === 401 || keenErrorCode(error) === INVALID_KEY_CODE;
}

/** The query ran past Keen's five minute ceiling and was stopped. */
export function isKeenQueryIncomplete(error: unknown): boolean {
	return (
		keenStatus(error) === 504 || keenErrorCode(error) === QUERY_INCOMPLETE_CODE
	);
}

/** The project, collection, saved query or dataset is not there. */
export function isKeenNotFound(error: unknown): boolean {
	return (
		keenStatus(error) === 404 ||
		keenErrorCode(error) === RESOURCE_NOT_FOUND_CODE
	);
}

/**
 * The status and Keen's code, without Keen's message text. A 401 message
 * quotes the key, and a 400 can echo a property or value the caller sent.
 */
// unknown: an error body is untyped: `{ message, error_code }`, or text from a
// proxy that never reached Keen.
export function describeKeenError(
	status: number | undefined,
	body: unknown,
): string {
	const code = errorFields(body).code;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Keen ${label}: request failed` : 'Keen request failed';
}

/**
 * Core's `ApiError` keeps the request body (an event can hold anything the
 * caller recorded) and the response body (whose message can quote the key or
 * echo input). The error is rebuilt as an `ApiError` with the same status and
 * rate-limit fields, the body cut to `{ error_code }`, and the sent body and
 * query dropped: a dataset read's `index_by` can be a customer value, so the
 * URL keeps only its path.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const code = errorFields(error.body).code;
	return new ApiError(
		request,
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: code === undefined ? {} : { error_code: code },
		},
		describeKeenError(error.status, error.body),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export type KeenQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[];

export type KeenRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: Record<string, KeenQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// a query body is an analysis document with a shape per analysis type.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Keen takes the key in an `Authorization` header, with no scheme in front:
 * `Authorization: MASTER_KEY`, not `Bearer ...`. Because `corsair/http`'s
 * `TOKEN` renders `Bearer`, the header is set literally instead.
 */
// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204, which is how a saved query or dataset delete answers.
export async function makeKeenRequest(
	{ apiKey, projectId }: KeenCredentials,
	{ method, path, query, body }: KeenRequest,
): Promise<unknown> {
	if (!projectId) {
		throw new KeenAPIError(
			'Keen needs the project ID, which is part of every request path',
			{ method },
		);
	}

	const config: OpenAPIConfig = {
		BASE: KEEN_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KEEN_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', Authorization: apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: `/3.0/projects/${segment(projectId)}${path}`,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the endpoint's zod output schema parses the body.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KEEN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe
			// to keep: it is the only thing that says why the connection dropped.
			throw new KeenAPIError(redactKeenKey(error.message, apiKey), {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KeenAPIError('Unknown Keen error', { method, transport: true });
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KeenQueryValue | undefined>,
): Record<string, KeenQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KeenQueryValue] => entry[1] !== undefined,
		),
	);
}
