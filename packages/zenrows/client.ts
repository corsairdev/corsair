import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ZENROWS_API_BASE = 'https://api.zenrows.com';

// A Fetch request may render a page in a browser and route it through a
// residential proxy, so it can run for minutes. Zenrows documents that a
// client timeout below 3 minutes costs the concurrency slot without saving the
// request (https://docs.zenrows.com/api-error-codes#AUTH006), and
// corsair/http's 20 second default would cancel every rendered request.
export const ZENROWS_TIMEOUT_MS = 180_000;

// error-handlers.ts owns retries, so the client makes one attempt. A
// concurrency 429 carries no Retry-After: a slot frees when a request in
// flight finishes, so the handler backs off exponentially instead.
const ZENROWS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Zenrows' two 429 codes: concurrency full, and rate limit exceeded. */
export const ZENROWS_RATE_LIMIT_CODES = ['AUTH006', 'AUTH008'] as const;

/** Codes that mean the account cannot pay for the call, so no retry helps. */
const ZENROWS_CREDIT_CODES = [
	'AUTH004',
	'AUTH014',
	'AUTH005',
	'AUTH011',
	'AUTH012',
	'api_key_cap_reached',
	'insufficient_credits',
	'payment_required',
] as const;

/**
 * Zenrows answers errors as RFC 9457 `application/problem+json` with a stable
 * `code` to branch on (https://docs.zenrows.com/api-error-codes). Fetch uses
 * uppercase codes such as `RESP002`; Crawl and Extract use lowercase ones such
 * as `crawl_not_found`.
 *
 * The body and the request URL are deliberately not kept: the key travels in a
 * header, or in the `apikey` query parameter when the caller forwards custom
 * headers, and copying either onto the error would put it back in logs.
 */
export class ZenRowsAPIError extends Error {
	readonly status?: number;
	/** Zenrows' machine-readable code, e.g. `AUTH004` or `crawl_not_found`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Zenrows sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message);
		this.name = 'ZenRowsAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	/**
	 * True for a 429, whether Zenrows' own code arrived or a gateway answered
	 * with the bare status and no body.
	 */
	get isRateLimit(): boolean {
		return (
			this.status === 429 ||
			(this.code !== undefined &&
				(ZENROWS_RATE_LIMIT_CODES as readonly string[]).includes(this.code))
		);
	}

	/** True when the account is out of credits or a cap is reached. */
	get isOutOfCredits(): boolean {
		return (
			this.code !== undefined &&
			(ZENROWS_CREDIT_CODES as readonly string[]).includes(this.code)
		);
	}
}

/**
 * A Fetch answer is one of several media types on the same route: HTML,
 * Markdown, plaintext or JSON, chosen by the request parameters. The body is
 * kept as text and parsed by the endpoint, which knows what it asked for.
 */
export type ZenrowsResponse = {
	status: number;
	/**
	 * How corsair/http decoded the body, not the provider's Content-Type
	 * header: that header is not returned by the client. `json` means the body
	 * arrived as `application/json` and was parsed; `text` means it arrived as
	 * text and `maybeParseJson` may still have found JSON inside it, because
	 * Zenrows labels HTML, Markdown and its JSON modes all `text/plain`.
	 */
	bodyFormat: 'json' | 'text';
	text: string;
	/**
	 * The parsed body when corsair/http parsed one, which it does for
	 * `application/json` and `application/problem+json`. Left undefined for the
	 * text modes, which are HTML, Markdown or plaintext.
	 */
	// unknown: the body is provider JSON whose shape each endpoint's output
	// schema validates, so a concrete type here would be an unchecked claim.
	json?: unknown;
};

export type ZenrowsRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	/** Extra request headers, e.g. `Idempotency-Key`. */
	headers?: Record<string, string>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	mediaType?: string;
	/**
	 * Where the key travels. `header` is the default. `query` is used when the
	 * caller forwards custom headers to the target: Zenrows copies every request
	 * header onto the target request when `custom_headers` is on, so a key in the
	 * header would be handed to the scraped site. The `apikey` query parameter is
	 * read and stripped before forwarding.
	 */
	auth?: 'header' | 'query';
};

/** Reads a Zenrows problem body's `code`. */
export function readProblemCode(
	// unknown: an error body is untyped JSON until asRecord narrows it.
	body: unknown,
): string | undefined {
	const record = asRecord(body);
	const code = record?.code;
	return typeof code === 'string' && code.length > 0 ? code : undefined;
}

/**
 * Zenrows puts the useful sentence in `title`, and a longer explanation in
 * `detail` for some codes. An unknown route answers a bare `{ status: 404 }`,
 * so the status line is the fallback rather than the raw body.
 */
export function describeZenRowsError(
	status: number | undefined,
	statusText: string | undefined,
	// unknown: a provider error body, read one field at a time above.
	body: unknown,
): string {
	const record = asRecord(body);
	const title = typeof record?.title === 'string' ? record.title : undefined;
	const detail = typeof record?.detail === 'string' ? record.detail : undefined;
	const code = readProblemCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	if (title) {
		return detail && detail !== title
			? `Zenrows ${label}: ${title}. ${detail}`
			: `Zenrows ${label}: ${title}`;
	}
	if (detail) return `Zenrows ${label}: ${detail}`;
	return status === undefined
		? 'Zenrows request failed'
		: `Zenrows request failed (${statusText || status})`;
}

/** Reads Retry-After from a failed response, as milliseconds. */
function retryAfterMs(value: string | null): number | undefined {
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

/**
 * Zenrows publishes one host for Fetch, Extract and Crawl, and the same key
 * works as `X-API-Key` on all of them.
 */
function configFor(
	apiKey: string,
	headers: Record<string, string>,
): OpenAPIConfig {
	return {
		BASE: ZENROWS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: ZENROWS_TIMEOUT_MS,
		// The key is sent through requestOptions.headers instead, so it can move
		// to the query string for one request without rebuilding the config.
		HEADERS: headers,
	};
}

/** Runs one Zenrows request and returns the body as text. */
export async function makeZenrowsRequest(
	apiKey: string,
	{
		method,
		path,
		query,
		headers: extraHeaders,
		body,
		mediaType,
		auth = 'header',
	}: ZenrowsRequest,
): Promise<ZenrowsResponse> {
	// With `auth: 'query'` ZenRows forwards every request header to the target,
	// Accept included, so the client's own `application/json` would ask the
	// site for JSON. Only a caller-supplied Accept is sent then.
	const headers: Record<string, string> = {
		...(auth === 'header' ? { Accept: 'application/json' } : {}),
		...(extraHeaders ?? {}),
	};
	if (auth === 'header') headers['X-API-Key'] = apiKey;
	if (body !== undefined)
		headers['Content-Type'] = mediaType ?? 'application/json';

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: auth === 'query' ? { ...query, apikey: apiKey } : query,
		body,
		mediaType:
			body === undefined ? undefined : (mediaType ?? 'application/json'),
		// corsair/http adds `Accept: application/json` by default and drops a
		// header whose value is undefined, so this clears its default when
		// forwarding while keeping an Accept the caller set.
		headers: auth === 'query' ? { Accept: undefined, ...headers } : headers,
	};

	try {
		// corsair/http parses `application/json` and `application/problem+json`
		// and returns text for every other type, which is how a Fetch answer
		// arrives whatever the caller asked for, so the type is only known once
		// the body is inspected.
		// unknown: corsair/http hands back parsed JSON for a JSON content type and
		// a string for everything else, so the type is only known after inspection.
		const parsed = await request<unknown>(
			configFor(apiKey, headers),
			requestOptions,
			{
				rateLimitConfig: ZENROWS_RATE_LIMIT_CONFIG,
			},
		);
		if (typeof parsed === 'string') {
			// Zenrows labels HTML, Markdown, plaintext and JSON all as
			// `text/plain`, so a text answer may still hold JSON. The endpoint
			// decides, because it knows which mode it asked for.
			const json = maybeParseJson(parsed);
			return {
				status: 200,
				bodyFormat: 'text',
				text: parsed,
				...(json === undefined ? {} : { json }),
			};
		}
		return {
			status: 200,
			bodyFormat: 'json',
			text: JSON.stringify(parsed),
			json: parsed,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ZenRowsAPIError(
				describeZenRowsError(error.status, error.statusText, error.body),
				{
					status: error.status,
					code: readProblemCode(error.body),
					retryAfter: error.retryAfter ?? retryAfterMs(null),
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ZenRowsAPIError(error.message, { method });
		}
		throw new ZenRowsAPIError('Unknown Zenrows error', { method });
	}
}

/**
 * Parses a body that may be JSON, without throwing: the caller decides whether
 * a non-JSON answer is an error. Zenrows labels its JSON modes `text/plain`, so
 * an HTML page also passes through here, and only a body that parses is
 * returned.
 */
function maybeParseJson(
	// unknown: the body is page content, which may be HTML, Markdown, text or JSON.
	text: string,
): unknown {
	const trimmed = text.trim();
	if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return undefined;
	try {
		return JSON.parse(trimmed);
	} catch {
		return undefined;
	}
}

/**
 * Parses a body that the caller asked Zenrows to return as JSON. A body that is
 * not JSON is an error rather than an empty object, so a mode that silently
 * stopped working is visible instead of looking like an empty page.
 *
 * The return stays unknown because each Fetch JSON mode answers a different
 * shape, and the caller's output schema is what validates it.
 */
export function parseJsonBody(
	response: ZenrowsResponse,
	path: string,
	// unknown: see the doc comment above; the caller's output schema validates it.
): unknown {
	if (response.json !== undefined) return response.json;
	const parsed = maybeParseJson(response.text);
	if (parsed === undefined) {
		throw new ZenRowsAPIError(
			`Zenrows answered ${path} with a body that is not JSON`,
			{ status: response.status },
		);
	}
	return parsed;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
