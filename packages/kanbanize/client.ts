import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Businessmap is Kanbanize's current name, and every account is served from its
 * own subdomain, so the base URL is built per account.
 */
export function kanbanizeBaseUrl(subdomain: string): string {
	// The subdomain becomes part of the host that receives the API key, so it
	// must be one DNS label: `acme`, never `attacker.example/` or `a@b`.
	if (!SUBDOMAIN_LABEL.test(subdomain)) {
		throw new KanbanizeAPIError(
			'The Businessmap subdomain must be a single label, such as acme for acme.kanbanize.com',
		);
	}
	return `https://${subdomain}.kanbanize.com/api/v2`;
}

const SUBDOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

/** The codes Businessmap sends when a limit is hit, on either window. */
const RATE_LIMIT_CODES = new Set(['RL01', 'RL02']);
/** The code it sends when the key is wrong or revoked. */
const INVALID_KEY_CODE = 'A001';
const LOGIN_REQUIRED_CODE = 'A002';

// unknown: the body is an untyped error body until asRecord narrows it.
function errorObject(body: unknown): {
	code?: string;
	message?: string;
	reference?: string;
	retryAfter?: number;
} {
	const error = asRecord(asRecord(body)?.error);
	// `details` is where the rate-limit body carries its own countdown, in
	// seconds: `{ limit, requests, retry_after }`.
	const details = asRecord(error?.details);
	const read = (record: Record<string, unknown> | null, key: string) => {
		const value = record?.[key];
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};
	const retryAfter = details?.retry_after;
	return {
		code: read(error, 'code'),
		message: read(error, 'message'),
		reference: read(error, 'reference'),
		retryAfter: typeof retryAfter === 'number' ? retryAfter : undefined,
	};
}

// The API publishes two windows and answers 429 for either; a 429 without a
// body code still means a rate limit, so both forms reach the same handler.
const KANBANIZE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) => {
		const code = errorObject(body).code;
		return status === 429 || (code !== undefined && RATE_LIMIT_CODES.has(code));
	},
};

/**
 * Businessmap wraps every failure in `{ error: { code, message, reference,
 * details } }`. `code` is a four-character identifier, and `details` names the
 * values that caused it.
 *
 * An HTTP error stays core's `ApiError` (see `sanitizeApiError`), so its status,
 * Retry-After and rate-limit fields reach core and the error handlers.
 * `KanbanizeAPIError` covers only failures that got no answer: a reset, DNS
 * failure, abort or timeout, and a subdomain that cannot be a host.
 */
export class KanbanizeAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			/** A transport failure (timeout, DNS). It carries no request or response body. */
			cause?: Error;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KanbanizeAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

/** Businessmap's four-character code on an HTTP error, such as `B001` or `RL02`. */
export function kanbanizeErrorCode(error: unknown): string | undefined {
	return error instanceof ApiError ? errorObject(error.body).code : undefined;
}

/** True for a 429 or a body carrying RL01 or RL02. */
export function isKanbanizeRateLimit(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	const code = kanbanizeErrorCode(error);
	return (
		error.status === 429 || (code !== undefined && RATE_LIMIT_CODES.has(code))
	);
}

/** A key that Businessmap rejected: the wrong key, or one since regenerated. */
export function isKanbanizeAuthError(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	const code = kanbanizeErrorCode(error);
	return (
		error.status === 401 ||
		code === INVALID_KEY_CODE ||
		code === LOGIN_REQUIRED_CODE
	);
}

/**
 * Core's `ApiError` keeps the request body (a card description, say), and
 * Businessmap's `details` echoes a card create's request back. The error is
 * rebuilt as an `ApiError` with the same status and rate-limit fields, the
 * body cut down to `{ error: { code, message, reference } }`, the sent body
 * and query dropped, and the body's `retry_after` seconds used when no header gave one.
 */
function sanitizeApiError(error: ApiError): ApiError {
	// The query can carry caller text too (cards.delete's exceeding_reason), so
	// it goes along with the body, and the URL keeps only its path.
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const fields = errorObject(error.body);
	return new ApiError(
		request,
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: {
				error: {
					code: fields.code,
					message: fields.message,
					reference: fields.reference,
				},
			},
		},
		describeKanbanizeError(
			error.status,
			error.body,
			'Businessmap request failed',
		),
		{
			retryAfter:
				error.retryAfter ??
				(fields.retryAfter !== undefined
					? fields.retryAfter * 1000
					: undefined),
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** The message Businessmap wrapped, with the status and code in front. */
// unknown: an error body is untyped: `{ error: { code, message } }`, or text
// from a proxy that never reached Businessmap.
export function describeKanbanizeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = errorObject(body);
	const text = fields.message ?? fallback;
	const label = [status, fields.code]
		.filter((part) => part !== undefined)
		.join(' ');
	const summary = label ? `Businessmap ${label}: ${text}` : text;
	return fields.reference
		? `${summary} (reference ${fields.reference})`
		: summary;
}

export type KanbanizeQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[];
export type KanbanizeRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, KanbanizeQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// Businessmap takes a different body shape on each resource.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204, which is how every delete on the API answers.
export async function makeKanbanizeRequest(
	apiKey: string,
	subdomain: string,
	{ method, path, query, body }: KanbanizeRequest,
): Promise<unknown> {
	if (!subdomain) {
		throw new KanbanizeAPIError(
			'Businessmap needs the account subdomain, such as acme for acme.kanbanize.com',
			{ method },
		);
	}

	const config: OpenAPIConfig = {
		BASE: kanbanizeBaseUrl(subdomain),
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', apikey: apiKey },
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
			rateLimitConfig: KANBANIZE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new KanbanizeAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KanbanizeAPIError('Unknown Businessmap error', {
			method,
			transport: true,
		});
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KanbanizeQueryValue | undefined>,
): Record<string, KanbanizeQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KanbanizeQueryValue] => entry[1] !== undefined,
		),
	);
}

/**
 * Businessmap documents `explode: false` on every list parameter, so a list
 * travels as one comma-separated value. `corsair/http` repeats a key for each
 * element of an array, which the API reads as a single unknown ID and answers
 * with nothing, so arrays are joined here instead.
 */
export function queryFor(
	query: Record<string, KanbanizeQueryValue | undefined>,
): Record<string, string | number | boolean> {
	const joined: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		joined[key] = Array.isArray(value)
			? value.join(',')
			: (value as string | number | boolean);
	}
	return joined;
}

/**
 * Businessmap returns only the fields a caller names, and every list output
 * needs each record's ID, so the ID field is always added to a `fields` list.
 */
export function withIdField(
	fields: readonly string[] | undefined,
	idField: string,
): string[] | undefined {
	if (!fields) return undefined;
	return fields.includes(idField) ? [...fields] : [idField, ...fields];
}
