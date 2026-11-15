import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TELTEL_API_BASE = 'https://api.teltel.io/v2';

/**
 * TelTEL answers failures as `{ errors: [{ code, title, detail }] }`, and the
 * two statuses mean different things:
 *
 * - **401** means no credential was sent at all.
 * - **403** means a credential was sent and refused, or the key's role does not
 *   cover the route.
 *
 * The error keeps both readings so a handler can tell a missing key from a
 * rejected one without re-deriving it.
 * https://apidoc.teltel.io
 */
export class TeltelAPIError extends Error {
	readonly status?: number;
	/** TelTEL's code from the first error entry, e.g. "40300". */
	readonly code?: string;
	/** Every error entry, each with its code, title and detail. */
	readonly errors: Array<{ code?: string; title?: string; detail?: string }>;
	/** Milliseconds from a Retry-After header, when TelTEL sent one. */
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
		this.name = 'TeltelAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code;
		this.errors = options.errors ?? [];
	}

	/** True when no credential reached the API at all. */
	get isMissingKey(): boolean {
		return this.status === 401;
	}

	/** True when a credential was sent and refused, or the role is too small. */
	get isRefusedKey(): boolean {
		return this.status === 403;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. TelTEL documents no Retry-After.
const TELTEL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

type TeltelErrorDetails = {
	errors: Array<{ code?: string; title?: string; detail?: string }>;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of TelTEL's JSON envelope.
function readErrorDetails(body: unknown): TeltelErrorDetails {
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
export function describeTeltelError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const details = readErrorDetails(body);
	const first = details.errors[0];
	const text = first?.title ?? first?.detail ?? fallback;
	const label = [status, first?.code].filter((p) => p !== undefined).join(' ');
	return label ? `TelTEL ${label}: ${text}` : text;
}

export type TeltelQuery = Record<string, string | number | boolean | undefined>;

export type TeltelRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: TeltelQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTeltelRequest(
	apiKey: string,
	{ method, path, query, body }: TeltelRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TELTEL_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TelTEL accepts the key in an X-API-KEY header or an apikey query
		// parameter. The header keeps it out of URLs and logs.
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
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
			rateLimitConfig: TELTEL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const details = readErrorDetails(error.body);
			throw new TeltelAPIError(
				describeTeltelError(error.status, error.body, error.message),
				{
					cause: error,
					code: details.errors[0]?.code,
					errors: details.errors,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TeltelAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TeltelAPIError('Unknown TelTEL error', { method });
	}
}
