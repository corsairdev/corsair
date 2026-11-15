import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const POSTGRID_API_BASE = 'https://api.postgrid.com/print-mail/v1';

/**
 * The rate limits are per resource type and per verb: 1000/min for a create,
 * 50/min for a single read and 10/min for a list. PostGrid sends no Retry-After,
 * so handlers own the retries and the fallback waits a minute-boundary second.
 */
const POSTGRID_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * PostGrid answers an error as `{ object: "error", error: { type, message,
 * details? } }`, where `type` is a stable machine-readable code such as
 * `invalid_api_key_error`. A route that does not exist answers a different
 * shape, `{ status: "error", message }`, which is handled separately.
 */
export class PostgridAPIError extends Error {
	readonly status?: number;
	/** The stable error code, such as `invalid_api_key_error`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when PostGrid sent one. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached PostGrid (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when PostGrid rejected the key rather than the request. */
	readonly credentialsRejected: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			credentialsRejected?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PostgridAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
	}
}

/** Unparsed bodies: an error body before a guard narrows it, and a response
 * body before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

function asRecord(value: Untyped): Record<string, Untyped> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, Untyped>)
		: undefined;
}

function readString(
	record: Record<string, Untyped> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** The nested `error` object, which carries `type` and `message`. */
export function readErrorObject(
	body: Untyped,
): Record<string, Untyped> | undefined {
	return asRecord(asRecord(body)?.error);
}

/**
 * The stable error code. PostGrid nests it under `error.type`; a missing route
 * carries no code at all, so the top-level `status` is the fallback.
 */
export function readErrorCode(body: Untyped): string | undefined {
	return (
		readString(readErrorObject(body), 'type') ??
		readString(asRecord(body), 'status')
	);
}

/**
 * The human message. PostGrid's `error.message` is the documented one; the
 * missing-route shape puts it at the top level instead.
 */
export function readErrorMessage(body: Untyped): string | undefined {
	return (
		readString(readErrorObject(body), 'message') ??
		readString(asRecord(body), 'message')
	);
}

const CREDENTIAL_CODES = new Set([
	'missing_auth_error',
	'invalid_api_key_error',
	'invalid_oauth_token_error',
]);

/**
 * A 401 always means the credential, and PostGrid names which way in `type`.
 * The bare missing-auth case carries no useful message, so the status alone is
 * enough to classify it.
 */
export function isCredentialRejection(
	status: number | undefined,
	body: Untyped,
): boolean {
	if (status !== 401 && status !== 403) return false;
	const code = readString(readErrorObject(body), 'type');
	return code === undefined || CREDENTIAL_CODES.has(code);
}

/**
 * Builds the message from the code and PostGrid's own message, and removes any
 * copy of the submitted API key from it first. PostGrid can echo the key it was
 * given in an invalid-key message, and this text reaches `error.message` and
 * `error.stack`, which MCP returns to the agent. `JSON.stringify` omits both, so
 * removing the key here is what keeps it out.
 */
export function describePostgridError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
	apiKey?: string,
): string {
	// The same code `readErrorCode` reports, so the label and the field agree
	// for both the usual `error.type` shape and the missing-route one.
	const code = readErrorCode(body);
	const raw = readErrorMessage(body) ?? fallback;
	const message = apiKey ? redactSecret(raw, apiKey) : raw;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `PostGrid ${label}: ${message}` : message;
}

/** Replaces every copy of a secret in a string. */
function redactSecret(text: string, secret: string): string {
	if (secret.length === 0) return text;
	return text.split(secret).join('[REDACTED]');
}

/**
 * Replaces every copy of a secret anywhere in a JSON value. PostGrid's error
 * body can repeat the key inside `error.message`, and the body travels on the
 * error object, so the whole body is walked rather than just its message.
 */
function redactSecretIn(value: Untyped, secret: string): Untyped {
	// unknown: the error body is arbitrary JSON, walked without narrowing it.
	if (typeof value === 'string') return redactSecret(value, secret);
	if (Array.isArray(value)) {
		return value.map((item: Untyped) => redactSecretIn(item, secret));
	}
	const record = asRecord(value);
	if (record === undefined) return value;
	const redacted: Record<string, Untyped> = {};
	for (const [key, item] of Object.entries(record)) {
		redacted[key] = redactSecretIn(item, secret);
	}
	return redacted;
}

/** A query value; a list is sent as the repeated `key[]` form PostGrid expects. */
export type PostgridQueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| undefined;

export type PostgridQuery = Record<string, PostgridQueryValue>;

export type PostgridRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: PostgridQuery;
	// unknown: each endpoint's input schema has already validated the body.
	body?: Untyped;
	/** Sent as `Idempotency-Key`, which order creation supports. */
	idempotencyKey?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Rewrites a query so a list becomes the `key[]=a&key[]=b` form PostGrid
 * documents, while a scalar stays `key=a`. `corsair/http` repeats a bare array
 * under the same key, which PostGrid reads as the last value only.
 */
export function buildQuery(
	query: PostgridQuery,
): Record<string, string | number | boolean | string[]> {
	const result: Record<string, string | number | boolean | string[]> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			// The `key[]` form is what PostGrid reads as a list.
			result[`${key}[]`] = value.map((item) => String(item));
		} else {
			result[key] = value as string | number | boolean;
		}
	}
	return result;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makePostgridRequest(
	apiKey: string,
	{ method, path, query, body, idempotencyKey }: PostgridRequest,
): Promise<Untyped> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('postgrid', 'api_key');
	}
	if (/[\r\n]/.test(apiKey)) {
		throw new PostgridAPIError('The API key must not contain newlines');
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'x-api-key': apiKey,
	};
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	if (idempotencyKey !== undefined) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	const config: OpenAPIConfig = {
		BASE: POSTGRID_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: query === undefined ? undefined : buildQuery(query),
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the caller's output schema parses the body returned here.
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: POSTGRID_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through (R8) so status, retryAfter and
		// isRateLimitError() keep working. PostGrid can echo the submitted key in
		// an invalid-key message, and that message lands on `error.message` and
		// `error.stack`, so the error is rebuilt with the key removed. Everything
		// else core set is carried over unchanged.
		if (error instanceof ApiError) {
			throw new ApiError(
				error.request,
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: redactSecretIn(error.body, apiKey),
				},
				describePostgridError(
					error.status,
					error.body,
					error.statusText,
					apiKey,
				),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PostgridAPIError(redactSecret(error.message, apiKey), {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PostgridAPIError('Unknown PostGrid error', {
			method,
			transport: true,
		});
	}
}
