import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const WEBEX_API_BASE = 'https://webexapis.com/v1';

const WEBEX_RATE_LIMIT_CONFIG: RateLimitConfig = {
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
 * Webex answers a failure as:
 *
 * ```
 * {
 *   "message": "...",
 *   "errors": [{ "description": "..." }],
 *   "trackingId": "ROUTERGW_..."
 * }
 * ```
 *
 * The `trackingId` is what Cisco support asks for, so it is kept on the error
 * rather than only in the message. A bad or missing token both answer 401 with
 * the same message, which is why the status is what decides an auth failure
 * here — there is no code to read.
 */
export class WebexAPIError extends Error {
	readonly status?: number;
	/** The per-field descriptions, when Webex sent them. */
	readonly errors?: readonly string[];
	/** Cisco's request id, which their support asks for. */
	readonly trackingId?: string;
	/** Milliseconds from a Retry-After header, when Webex sent one. */
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
		this.name = 'WebexAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const record = asRecord(this.body);
		this.trackingId = readString(record, 'trackingId');
		const errors = record?.errors;
		this.errors = Array.isArray(errors)
			? errors
					.map((entry) => readString(asRecord(entry), 'description'))
					.filter((entry): entry is string => entry !== undefined)
			: undefined;
	}

	/** True for a missing, expired or revoked token. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** True when the token is valid but lacks the scope for this call. */
	get isForbidden(): boolean {
		return this.status === 403;
	}
}

// unknown: see WebexAPIError.
export function describeWebexError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	// The per-field descriptions are more specific than `message`, so they win
	// when both are present.
	const errors = record?.errors;
	const details = Array.isArray(errors)
		? errors
				.map((entry) => readString(asRecord(entry), 'description'))
				.filter((entry): entry is string => entry !== undefined)
				.join('; ')
		: '';
	const text =
		details.length > 0 ? details : (readString(record, 'message') ?? fallback);
	const trackingId = readString(record, 'trackingId');
	const label = status ? `Webex ${status}` : '';
	const summary = label ? `${label}: ${text}` : text;
	return trackingId ? `${summary} (trackingId ${trackingId})` : summary;
}

export type WebexQuery = Record<string, string | number | boolean | undefined>;

export type WebexRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: WebexQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment; ids come from the caller. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the 204s: deleting a room, a team or a webhook.
export async function makeWebexRequest(
	apiKey: string,
	{ method, path, query, body }: WebexRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: WEBEX_API_BASE,
		VERSION: '1.0.0',
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
			rateLimitConfig: WEBEX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new WebexAPIError(
				describeWebexError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WebexAPIError(error.message, { cause: error, method });
		}
		throw new WebexAPIError('Unknown Webex error', { method });
	}
}

/**
 * Webex pages by a `Link` header with a `next` rel, not by a cursor in the body,
 * so a caller follows `link` rather than computing an offset.
 */
export function nextPageFromLink(
	link: string | null | undefined,
): string | undefined {
	if (!link) return undefined;
	for (const part of link.split(',')) {
		const match = /<([^>]+)>\s*;\s*rel="?next"?/.exec(part.trim());
		if (match?.[1]) return match[1];
	}
	return undefined;
}

/** Narrows a caught value to this plugin's error. */
export function isWebexFailure(error: unknown): error is WebexAPIError {
	return error instanceof WebexAPIError;
}
