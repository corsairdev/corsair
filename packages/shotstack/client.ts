import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * One host serves all three APIs, each under its own path prefix and version
 * segment. The plugin always calls production (`v1`); a sandbox key needs the
 * `stage` paths, which this plugin does not expose.
 */
export const SHOTSTACK_API_BASE = 'https://api.shotstack.io';

export type ShotstackService = 'edit' | 'ingest' | 'serve';

export type ShotstackRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	service: ShotstackService;
	/** Path under the service prefix, e.g. `/render`. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	headers?: Record<string, string | undefined>;
};

export class ShotstackAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Shotstack sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/**
	 * True when the request carried an `Idempotency-Key`, which makes a
	 * generate create replay-safe on a 5xx.
	 */
	readonly hasIdempotency: boolean;
	/** True when the request never reached Shotstack (connection, DNS, abort). */
	readonly transport: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			hasIdempotency?: boolean;
			transport?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ShotstackAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.hasIdempotency = options.hasIdempotency ?? false;
		this.transport = options.transport ?? false;
	}
}

function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Message and code from Shotstack's three error bodies:
 *
 * - json:api (all services on auth and ingest/serve errors): `{ errors: [{ status, title, detail }] }`
 * - edit envelope (404 class): `{ success: false, message, response }`
 * - generate bare: `{ error, code?, available? }`
 *
 * The body is read for the message and code only and never copied onto the
 * error: bodies can echo request content, and the transport error's cause
 * carries the request.
 */
export function describeShotstackError(
	status: number | undefined,
	// unknown: error bodies are one of the three shapes above, or proxy text.
	body: unknown,
	fallback: string,
): { message: string; code?: string } {
	const record = asRecord(body);
	const firstError = asRecord(
		Array.isArray(record?.errors) ? record.errors[0] : undefined,
	);
	const detail = readString(firstError, 'detail');
	const code =
		readString(record, 'code') ?? readString(firstError, 'code') ?? undefined;
	const editMessage = readString(record, 'message');
	const generateError = readString(record, 'error');
	const parts = [status].filter((part) => part !== undefined).join(' ');
	const text =
		detail ??
		generateError ??
		editMessage ??
		readString(firstError, 'title') ??
		fallback;
	return { message: parts ? `Shotstack ${parts}: ${text}` : text, code };
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Shotstack documents a fixed 60-second
// window per key, and the 429 body carries the code `rate_limit_error`, which
// a gateway-issued 429 without that body must not depend on.
const SHOTSTACK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 429 ||
		describeShotstackError(status, body, '').code === 'rate_limit_error',
};

/**
 * A path parameter that is a full URL (`media.probe`) or a client-supplied
 * identifier, encoded for one path segment.
 */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the raw body with the endpoint's zod output schema;
// undefined for the bodyless answers: 204 on the three deletes.
export async function makeShotstackRequest(
	apiKey: string,
	{ method, service, path, query, body, headers }: ShotstackRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: SHOTSTACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: `/${service}/v1${path}`,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
		headers: headers
			? (Object.fromEntries(
					Object.entries(headers).filter(([, value]) => value !== undefined),
				) as Record<string, string>)
			: undefined,
	};

	const idempotencyKeyed = Boolean(headers?.['Idempotency-Key']);
	try {
		// unknown: the body type is each endpoint's own; the schema parses it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SHOTSTACK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { message, code } = describeShotstackError(
				error.status,
				error.body,
				error.message,
			);
			// No cause: ApiError.request keeps the x-api-key header in clear,
			// and util.inspect prints the cause.
			throw new ShotstackAPIError(message, {
				status: error.status,
				retryAfter: error.retryAfter,
				method: error.request.method,
				code,
				hasIdempotency: idempotencyKeyed,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ShotstackAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
				hasIdempotency: idempotencyKeyed,
				transport: true,
			});
		}
		throw new ShotstackAPIError('Unknown Shotstack error', {
			method,
			hasIdempotency: idempotencyKeyed,
			transport: true,
		});
	}
}

// ── json:api unwraps (ingest and serve) ────────────────────────────────────
// A present envelope with a missing resource must fail loudly, not read as
// an empty page. On the Edit API the output schemas pin `success: literal(true)`,
// so a 2xx body that still says `success: false` fails the parse.
// unknown: the unwraps run before the output schema parse, so the raw 2xx
// body has no static type yet; each function narrows it and throws on the
// shapes the json:api envelope cannot produce.

/** The `attributes` of a json:api single-resource response. */
export function attributesOf(raw: unknown): Record<string, unknown> {
	const data = asRecord(asRecord(raw)?.data);
	const attributes = asRecord(data?.attributes);
	if (!attributes) {
		throw new ShotstackAPIError(
			'Shotstack: the response has no json:api resource attributes',
		);
	}
	return attributes;
}

/** The `attributes` of each resource in a json:api list response. */
export function attributesList(raw: unknown): Record<string, unknown>[] {
	const data = asRecord(raw)?.data;
	if (!Array.isArray(data)) {
		throw new ShotstackAPIError(
			'Shotstack: the response has no json:api resource array',
		);
	}
	return data.map((item) => {
		const attributes = asRecord(asRecord(item)?.attributes);
		if (!attributes) {
			throw new ShotstackAPIError(
				'Shotstack: the response has no json:api resource attributes',
			);
		}
		return attributes;
	});
}

/** The `{ id, type }` of a queued json:api resource, which has no attributes yet. */
export function queuedResourceId(raw: unknown): Record<string, unknown> {
	const data = asRecord(asRecord(raw)?.data);
	if (!data || typeof data.id !== 'string') {
		throw new ShotstackAPIError(
			'Shotstack: the queued response has no resource id',
		);
	}
	return { id: data.id, type: data.type };
}
