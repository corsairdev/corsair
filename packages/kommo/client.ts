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
 * A Kommo failure.
 *
 * The body is dropped rather than kept as `cause`: a lead or contact create
 * echoes the submitted entity back in `detail` on a validation failure, and that
 * entity carries the customer's name, phone and email.
 */
export class KommoAPIError extends Error {
	readonly status?: number;
	/** The message Kommo put in `detail`, or its `title` when detail is absent. */
	readonly detail?: string;
	/** Milliseconds from a Retry-After header, when Kommo sent one. */
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
			detail?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KommoAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** A missing or expired token. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The token works but the user lacks the right for this entity. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** Kommo refused the payload, usually a custom field it does not accept. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
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

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KOMMO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = readProblem(error.body);
			throw new KommoAPIError(
				describeKommoError(error.status, error.body, error.message),
				{
					status: error.status,
					detail: fields.detail ?? fields.title,
					retryAfter: error.retryAfter,
					method,
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
