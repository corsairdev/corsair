import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KADOA_API_BASE = 'https://api.kadoa.com';

// A workflow run is accepted at once, but reading its data streams the result
// set and the docs allow a five minute response timeout, so the 20 second
// default in corsair/http is too short for workflows.data.
const KADOA_TIMEOUT_MS = 60_000;

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(body: unknown): string | undefined {
	const record = asRecord(body);
	const value = record?.error;
	if (typeof value === 'string' && value.length > 0) return value;
	const message = record?.message;
	return typeof message === 'string' && message.length > 0
		? message
		: undefined;
}

// unknown: same untyped body as readString.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const reason = record?.reason;
	if (typeof reason === 'string' && reason.length > 0) return reason;
	return undefined;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Kadoa documents no rate limit headers; the
// contract is a 429 with a `reason` of PIPELINE_CROWDED or USER_RATE_LIMIT.
const KADOA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Kadoa error bodies come in three shapes:
 *
 * - `{ error: boolean, message, details? }` on most routes
 * - `{ error: string }` on the workflow run route
 * - `{ error: string, reason, recoveryHint?, existingState? }` on a 409 or 429
 *   from the run route
 *
 * The body is dropped rather than kept on the error, because Kadoa echoes
 * nothing secret but the run body carries `variables`, which may hold values
 * the caller should not see in a log line.
 */
export class KadoaAPIError extends Error {
	readonly status?: number;
	/** Machine-readable reason, e.g. `PIPELINE_CROWDED`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Kadoa sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the request never reached Kadoa: a reset, DNS failure or abort. */
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KadoaAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = readCode(cause?.body);
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** True for a 5xx that Kadoa answered, as opposed to a dropped connection. */
	get isServerError(): boolean {
		return (this.status ?? 0) >= 500;
	}
}

/**
 * The message Kadoa put in an error body, with the status and reason in front
 * when both are known.
 */
// unknown: an error body is untyped: `{ error, message, details }`, `{ error }`,
// or text from a proxy that never reached Kadoa.
export function describeKadoaError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readString(body) ?? fallback;
	const code = readCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Kadoa ${label}: ${text}` : text;
}

export type KadoaQueryValue = string | number | boolean | string[] | undefined;

// An array value is sent as a repeated parameter, which Kadoa documents for
// `tags`, `statusFilters`, `userId`, `channelId` and `templateId`.
export type KadoaQuery = Record<string, KadoaQueryValue>;

export type KadoaRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: KadoaQuery;
	// unknown: the endpoint's input schema has already validated the body, and
	// Kadoa takes four different body shapes across its routes.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// a string on the routes Kadoa documents as text/plain (pause, schedule and
// workflow delete).
export async function makeKadoaRequest(
	apiKey: string,
	{ method, path, query, body }: KadoaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KADOA_API_BASE,
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KADOA_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
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
			rateLimitConfig: KADOA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new KadoaAPIError(
				describeKadoaError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new KadoaAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KadoaAPIError('Unknown Kadoa error', { method, transport: true });
	}
}

/**
 * Pause, schedule and workflow delete answer a plain-text message. A JSON body
 * with a `message` is accepted too, because a gateway in front of Kadoa may
 * answer JSON; anything else throws, so a delete is never reported as done on
 * an empty body.
 */
// unknown: the raw body is either that text or an untyped JSON object.
export function messageResult(
	raw: unknown,
	operation: string,
): {
	message: string;
} {
	// "[object Object]" is what an empty body becomes when someone stringifies
	// it; it never means the operation succeeded.
	if (typeof raw === 'string' && raw.length > 0 && raw !== '[object Object]') {
		return { message: raw };
	}
	const message = asRecord(raw)?.message;
	if (typeof message === 'string' && message.length > 0) return { message };
	throw new Error(`Kadoa returned no message for ${operation}`);
}
