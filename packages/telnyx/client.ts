import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TELNYX_API_BASE = 'https://api.telnyx.com/v2';

/**
 * Telnyx answers failures as `{ errors: [{ code, title, detail, meta }] }`,
 * where `code` is a string such as "10005" and `title` names the problem. The
 * first entry carries the useful text; the whole list stays on the error.
 * https://developers.telnyx.com/docs/overview/errors/error-codes
 */
export class TelnyxAPIError extends Error {
	readonly status?: number;
	/** Telnyx's machine code from the first error entry, e.g. "10005". */
	readonly code?: string;
	/** Every error entry, each with its code, title and detail. */
	readonly errors: Array<{
		code?: string;
		title?: string;
		detail?: string;
	}>;
	/** Milliseconds from a Retry-After header, when Telnyx sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			errors?: Array<{ code?: string; title?: string; detail?: string }>;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TelnyxAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code;
		this.errors = options.errors ?? [];
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Telnyx publishes the remaining quota in
// x-ratelimit-* headers rather than a Retry-After.
const TELNYX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

type TelnyxErrorDetails = {
	errors: Array<{ code?: string; title?: string; detail?: string }>;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of Telnyx's JSON envelope.
function readErrorDetails(body: unknown): TelnyxErrorDetails {
	const record = asRecord(body);
	const list = record?.errors;
	const errors: Array<{ code?: string; title?: string; detail?: string }> = [];
	if (Array.isArray(list)) {
		for (const entry of list) {
			const item = asRecord(entry);
			if (!item) continue;
			const code = item.code;
			const title = item.title;
			const detail = item.detail;
			errors.push({
				code: typeof code === 'string' ? code : undefined,
				title: typeof title === 'string' ? title : undefined,
				detail: typeof detail === 'string' ? detail : undefined,
			});
		}
	}
	return { errors };
}

// unknown: same open error body as readErrorDetails.
export function describeTelnyxError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const details = readErrorDetails(body);
	const first = details.errors[0];
	const text = first?.title ?? first?.detail ?? fallback;
	const label = [status, first?.code].filter((p) => p !== undefined).join(' ');
	return label ? `Telnyx ${label}: ${text}` : text;
}

export type TelnyxQuery = Record<string, string | number | boolean | undefined>;

export type TelnyxRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: TelnyxQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTelnyxRequest(
	apiKey: string,
	{ method, path, query, body }: TelnyxRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TELNYX_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Telnyx reads the key from a bearer header.
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the response shape is the endpoint's concern; the caller
		// parses it with its zod output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TELNYX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const details = readErrorDetails(error.body);
			throw new TelnyxAPIError(
				describeTelnyxError(error.status, error.body, error.message),
				{
					cause: error,
					code: details.errors[0]?.code,
					errors: details.errors,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TelnyxAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TelnyxAPIError('Unknown Telnyx error', { method });
	}
}
