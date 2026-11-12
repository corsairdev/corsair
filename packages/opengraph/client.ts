import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const OPENGRAPH_API_BASE = 'https://opengraph.io/api';

// A brand analysis reads several pages of the site and OpenGraph.io's docs
// tell callers to allow at least 60 seconds; proxy escalation on a slow page
// can add more.
const OPENGRAPH_TIMEOUT_MS = 90_000;

function isCode(value: unknown): value is string | number {
	return (
		(typeof value === 'string' || typeof value === 'number') && value !== ''
	);
}

// unknown: error bodies vary by endpoint until asRecord narrows them.
function readCode(body: unknown): string | number | undefined {
	const record = asRecord(body);
	const nested = asRecord(record?.error);
	return (
		(nested && isCode(nested.code) ? nested.code : undefined) ??
		(record && isCode(record.code) ? record.code : undefined)
	);
}

// unknown: same open error bodies as readCode.
function readMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const error = record?.error;
	if (typeof error === 'string' && error.length > 0) return error;
	const nested = asRecord(error);
	const read = (key: string) => {
		const value = nested?.[key] ?? record?.[key];
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};
	return read('message') ?? read('detail');
}

/**
 * OpenGraph.io error bodies come in three shapes:
 *
 * - flat: `{ error: true, message, code }` on site, scrape, screenshot and
 *   query calls, where code is a string such as `INVALID_APP_ID`
 * - nested: `{ error: { code, message } }` on oEmbed, markdown and brand,
 *   where code is a number such as -2201
 * - brand invalid options: `{ error: 'plain description' }`
 */
export class OpengraphAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code when present, e.g. `INVALID_APP_ID` or -2201. */
	readonly code?: string | number;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: a gateway between corsair/http and the API can answer with
	// HTML or plain text instead of the shapes above.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'OpengraphAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = readCode(this.body);
	}

	/** True for the 429 OpenGraph.io answers when a plan's concurrent limit is hit. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: see OpengraphAPIError.
export function describeOpengraphError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readMessage(body) ?? fallback;
	const code = readCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `OpenGraph.io ${label}: ${text}` : text;
}

export type OpengraphQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type OpengraphRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: OpengraphQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment, here always the URL-encoded target URL. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// error-handlers.ts owns retries, so the client makes one attempt. Limits are
// concurrent per plan (1 on the free plan), and OpenGraph.io documents
// exponential backoff rather than a Retry-After header; one is still honored
// when sent.
const OPENGRAPH_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

/**
 * Authentication is the documented `app_id` query parameter, not a header, so
 * it is merged into every query string here.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeOpengraphRequest(
	appId: string,
	{ method, path, query, body }: OpengraphRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: OPENGRAPH_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: OPENGRAPH_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, app_id: appId },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: OPENGRAPH_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The ApiError cause is dropped: its captured request would carry
			// the app_id, which corsair/http's redaction does not know. Every
			// field worth reading is copied onto the wrapped error instead.
			throw new OpengraphAPIError(
				describeOpengraphError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new OpengraphAPIError(error.message, { cause: error, method });
		}
		throw new OpengraphAPIError('Unknown OpenGraph.io error', { method });
	}
}
