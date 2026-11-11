import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * WATI has three regional hosts, and a token only works against the region its
 * workspace lives in. The docs are explicit that a token must not be moved
 * between regions, so the host is a plugin option rather than something the
 * client can infer.
 */
export const WATI_REGIONS = {
	global: 'https://live-mt-server.wati.io',
	eu: 'https://eu-api.wati.io',
	ksa: 'https://ksa-api.wati.io',
} as const;

export type WatiRegion = keyof typeof WATI_REGIONS;

/** V3 puts no tenant in the path — the token identifies the workspace. */
export const WATI_API_BASE = `${WATI_REGIONS.global}/api/ext/v3`;

const WATI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * WATI answers a failure as `{ error, code, message, timestamp }`, where
 * `error` is a short machine name and `code` repeats the HTTP status as a
 * number.
 *
 * A missing token (`missing_token`) and a bad one (`invalid_token`) are both
 * 401 but are different fixes, so the plugin keeps them apart. A 403 is not
 * always a missing scope: the docs say role, plan and channel access can each
 * cause it.
 */
export class WatiAPIError extends Error {
	readonly status?: number;
	/** The short machine name, e.g. `invalid_token`. */
	readonly code?: string;
	/** The HTTP status as a number, as WATI repeats it in the body. */
	readonly statusCode?: number;
	/** When WATI answered, which is useful when correlating a failure. */
	readonly timestamp?: string;
	/** Milliseconds from a Retry-After header, when WATI sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shape above, but a proxy can answer
	// with HTML or text.
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
		this.name = 'WatiAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const record = asRecord(this.body);
		this.code = readString(record, 'error');
		const code = record?.code;
		this.statusCode = typeof code === 'number' ? code : undefined;
		this.timestamp = readString(record, 'timestamp');
	}

	/** True when no token was sent at all. */
	get isMissingToken(): boolean {
		return this.code === 'missing_token';
	}

	/** True when a token was sent but is wrong, malformed or expired. */
	get isInvalidToken(): boolean {
		return this.code === 'invalid_token';
	}

	/**
	 * True for either token failure. Both mean the credential needs fixing, so
	 * a retry cannot help — but the distinction is what tells a caller whether
	 * they configured a key at all.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.isMissingToken || this.isInvalidToken;
	}
}

// unknown: see WatiAPIError.
export function describeWatiError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'message') ?? fallback;
	const code = readString(record, 'error');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `WATI ${label}: ${text}` : text;
}

export type WatiQuery = Record<string, string | number | boolean | undefined>;

export type WatiRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: WatiQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment; targets and ids come from the caller. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * A contact "target" is the `wa_id` or the phone number, and the docs allow a
 * leading `+`. The `+` must be percent-encoded to stay in one path segment,
 * which is what `segment` already does — this documents why it matters.
 */
export function target(value: string): string {
	return segment(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeWatiRequest(
	apiKey: string,
	{ method, path, query, body }: WatiRequest,
	base: string = WATI_API_BASE,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
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
			rateLimitConfig: WATI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new WatiAPIError(
				describeWatiError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WatiAPIError(error.message, { cause: error, method });
		}
		throw new WatiAPIError('Unknown WATI error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isWatiFailure(error: unknown): error is WatiAPIError {
	return error instanceof WatiAPIError;
}
