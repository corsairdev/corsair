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
 * A page of a list, plus the URL of the next one.
 *
 * `corsair/http` returns `responseHeader ?? responseBody`, so a header cannot come
 * back with the body. Lists therefore make one GET with `fetch` directly and read
 * both; everything else goes through the shared client.
 */
export type WebexPage = {
	body: unknown;
	/** The absolute URL of the next page, from the `Link` header, when there is one. */
	nextLink?: string;
};

/**
 * Webex pages by a `Link` header with a `next` rel, not by a cursor in the body,
 * so a caller follows the returned `nextLink` rather than computing an offset.
 */
export function nextPageFromLink(
	link: string | null | undefined,
): string | undefined {
	if (!link) return undefined;
	for (const part of link.split(',')) {
		const match = /<([^<>]+)>\s*;\s*rel="?next"?/.exec(part.trim());
		if (match?.[1]) return match[1];
	}
	return undefined;
}

/**
 * A GET that reads the pagination header as well as the body.
 *
 * Both the fetch call and the body read are normalised to `WebexAPIError`, so a
 * dropped connection on a 5xx still reaches the plugin's error handlers, and the
 * caller may pass a `nextLink` from a previous page instead of building a query.
 */
export async function makeWebexListRequest(
	apiKey: string,
	{
		path,
		query,
		nextLink,
	}: { path: string; query?: WebexQuery; nextLink?: string },
): Promise<WebexPage> {
	const url = nextLink
		? checkNextLink(nextLink, path)
		: buildListUrl(path, query);

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		});
	} catch (error) {
		// A transport failure never reached Webex, so this read is safe to replay.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WebexAPIError(error.message, { cause: error, method: 'GET' });
		}
		throw new WebexAPIError('Unknown Webex error', { method: 'GET' });
	}

	let text: string;
	try {
		text = await response.text();
	} catch (error) {
		// The status is kept so a 5xx is still retried and a 429 still waits.
		const meta = {
			status: response.status,
			retryAfter: readRetryAfter(response),
			method: 'GET',
		};
		if (error instanceof Error || error instanceof DOMException) {
			throw new WebexAPIError(error.message, { cause: error, ...meta });
		}
		throw new WebexAPIError('Unknown Webex error', meta);
	}

	if (!response.ok) {
		let parsed: unknown = text;
		try {
			parsed = JSON.parse(text) as unknown;
		} catch {
			// An HTML or empty body is kept as text; the handler reads the status.
		}
		throw new WebexAPIError(
			describeWebexError(response.status, parsed, `HTTP ${response.status}`),
			{
				status: response.status,
				body: parsed,
				retryAfter: readRetryAfter(response),
				method: 'GET',
			},
		);
	}

	let body: unknown;
	try {
		body = JSON.parse(text) as unknown;
	} catch {
		throw new WebexAPIError('Webex returned a list that is not JSON', {
			status: response.status,
			method: 'GET',
		});
	}

	return {
		body,
		nextLink: nextPageFromLink(response.headers.get('link')),
	};
}

/**
 * A `nextLink` comes back from the caller, and the token is sent with it, so it
 * must be a Webex URL for the same list. Anything else is refused before the
 * request leaves.
 */
function checkNextLink(nextLink: string, path: string): string {
	let parsed: URL;
	try {
		parsed = new URL(nextLink);
	} catch {
		throw new WebexAPIError('nextLink is not a URL', { method: 'GET' });
	}
	const base = new URL(WEBEX_API_BASE);
	if (
		parsed.origin !== base.origin ||
		parsed.pathname !== `${base.pathname}${path}`
	) {
		throw new WebexAPIError(
			`nextLink must be a ${WEBEX_API_BASE}${path} page from this list`,
			{ method: 'GET' },
		);
	}
	return parsed.toString();
}

/** Builds the first-page URL from the path and its query. */
function buildListUrl(path: string, query: WebexQuery | undefined): string {
	const url = new URL(`${WEBEX_API_BASE}${path}`);
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	return url.toString();
}

/** Reads Retry-After, which a 429 carries in seconds. */
function readRetryAfter(response: Response): number | undefined {
	const header = response.headers.get('retry-after');
	if (!header) return undefined;
	const seconds = Number(header);
	return Number.isFinite(seconds) ? seconds * 1000 : undefined;
}

/** Narrows a caught value to this plugin's error. */
export function isWebexFailure(error: unknown): error is WebexAPIError {
	return error instanceof WebexAPIError;
}
