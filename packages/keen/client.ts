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
 * A Keen failure, with the key kept out of the message and the body dropped.
 *
 * The body is dropped rather than kept as `cause`': Keen echoes the request in
 * some validation errors, and an event body can hold anything the caller
 * recorded, so the error carries only what a handler matches on.
 */
export class KeenAPIError extends Error {
	readonly status?: number;
	/** Keen's error code, such as `InvalidApiKeyError`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Keen sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			/** Keen's `error_code`, passed in rather than read from the cause. */
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KeenAPIError';
		// The code is never read from `cause`. A response body can echo the key,
		// so the client drops the cause on a provider failure and passes only the
		// code here; a transport failure has no body at all.
		this.code = options.code;
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	get isAuthError(): boolean {
		return this.status === 401 || this.code === INVALID_KEY_CODE;
	}

	/** The query ran past Keen's five minute ceiling and was stopped. */
	get isQueryIncomplete(): boolean {
		return this.status === 504 || this.code === QUERY_INCOMPLETE_CODE;
	}

	/** The project, collection, saved query or dataset is not there. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === RESOURCE_NOT_FOUND_CODE;
	}
}

/** The message Keen sent, with its code in front and the key removed. */
// unknown: an error body is untyped: `{ message, error_code }`, or text from a
// proxy that never reached Keen.
export function describeKeenError(
	status: number | undefined,
	body: unknown,
	fallback: string,
	apiKey: string,
): string {
	const fields = errorFields(body);
	const text = redactKeenKey(fields.message ?? fallback, apiKey);
	const label = [status, fields.code]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Keen ${label}: ${text}` : text;
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KEEN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached. Keen echoes the key in the
			// 401 message, and `util.inspect` walks the cause chain, so keeping it
			// would put the key back into every log line the redaction just kept
			// it out of. Status, code and retryAfter are copied instead.
			throw new KeenAPIError(
				describeKeenError(error.status, error.body, error.message, apiKey),
				{
					status: error.status,
					code: errorFields(error.body).code,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
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
