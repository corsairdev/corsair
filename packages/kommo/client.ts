import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Every Kommo account is served from its own host: `acme` for
 * `acme.kommo.com`, under `/api/v4`. The subdomain is an account credential
 * because it differs per customer.
 */
export function kommoBaseUrl(subdomain: string): string {
	return `https://${subdomain}.kommo.com/api/v4`;
}

// One DNS label: letters, digits and inner hyphens. Anything else (a dot, a
// slash, an `@`) could move the request, and the bearer token, to another host.
const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export function isValidSubdomain(subdomain: string): boolean {
	return SUBDOMAIN_PATTERN.test(subdomain);
}

// Kommo documents 2 requests a second and a burst of 7, and answers 429 when
// either is exceeded. error-handlers.ts owns the retry, so the client makes one
// attempt and only reads Retry-After into the error.
const KOMMO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Kommo answers a failure with `application/problem+json`:
 *
 * ```json
 * { "type": "...", "title": "Unauthorized", "status": 401, "detail": "..." }
 * ```
 *
 * `status` repeats the HTTP status as a number, and `detail` carries the reason.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readProblem(body: unknown): {
	title?: string;
	detail?: string;
	status?: number;
} {
	const record = asRecord(body);
	const read = (key: string) => {
		const value = record?.[key];
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};
	const status = record?.status;
	return {
		title: read('title'),
		detail: read('detail'),
		status: typeof status === 'number' ? status : undefined,
	};
}

/**
 * A Kommo failure that never got an HTTP answer: a dropped connection, a
 * timeout, or a call refused before it was sent (no subdomain). An HTTP error
 * reaches the handlers as core's `ApiError`.
 */
export class KommoAPIError extends Error {
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
		this.name = 'KommoAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

/** The message Kommo sent, with the status in front. */
// unknown: an error body is untyped: a problem+json document, text/html from the
// gateway, or an empty body on a 204.
export function describeKommoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readProblem(body);
	const text = fields.detail ?? fields.title ?? fallback;
	return status === undefined ? text : `Kommo ${status}: ${text}`;
}

export type KommoQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[];

export type KommoRequest = {
	method: 'GET' | 'POST' | 'PATCH';
	path: string;
	query?: Record<string, KommoQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, which
	// is an array of entities or a single one depending on the route.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeKommoRequest(
	apiKey: string,
	subdomain: string,
	{ method, path, query, body }: KommoRequest,
): Promise<unknown> {
	if (!subdomain) {
		throw new KommoAPIError(
			'Kommo needs the account subdomain, such as acme for acme.kommo.com',
			{ method },
		);
	}
	if (!isValidSubdomain(subdomain)) {
		throw new KommoAPIError(
			'The Kommo subdomain must be one label, such as acme for acme.kommo.com',
			{ method },
		);
	}

	const config: OpenAPIConfig = {
		BASE: kommoBaseUrl(subdomain),
		VERSION: '4.0.0',
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

	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: KOMMO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError is rebuilt without anything the request or Kommo's
		// answer could echo: the request body is the submitted lead or contact,
		// with the customer's name, phone and email, and core quotes an
		// unrecognised error body in its message. Status, statusText and the
		// rate-limit fields stay, so the handlers read them as before. The
		// message is Kommo's own reason, or the status text when it sent none.
		if (error instanceof ApiError) {
			throw new ApiError(
				{ ...error.request, body: undefined, formData: undefined },
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: undefined,
				},
				describeKommoError(
					error.status,
					error.body,
					error.statusText || 'request failed',
				),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new KommoAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KommoAPIError('Unknown Kommo error', { method, transport: true });
	}
	return decodeHalBody(raw);
}

/**
 * Kommo answers success as `application/hal+json`, which `corsair/http` does
 * not treat as JSON and hands back as text. Parse that text here so the output
 * schema sees an object.
 */
// unknown: the body is an untyped HAL document until the output schema runs.
export function decodeHalBody(raw: unknown): unknown {
	if (typeof raw !== 'string') return raw;
	if (raw.trim() === '') return undefined;
	try {
		return JSON.parse(raw) as unknown;
	} catch {
		return raw;
	}
}

/**
 * Kommo takes a bracketed query key, such as `filter[statuses][0][pipeline_id]`,
 * which `corsair/http` renders for a nested object. A list is repeated for its
 * `[]` form, which Kommo reads as an array.
 */
export function definedQuery(
	query: Record<string, KommoQueryValue | undefined>,
): Record<string, KommoQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KommoQueryValue] => entry[1] !== undefined,
		),
	);
}
