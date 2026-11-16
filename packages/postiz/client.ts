import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Postiz Cloud's public API. */
export const POSTIZ_API_BASE = 'https://api.postiz.com/public/v1';

const POSTIZ_CLOUD_HOSTS = new Set(['api.postiz.com', 'platform.postiz.com']);

/**
 * Turns the instance URL from the account's `base_url` field (or the `baseUrl`
 * option) into the API base. Empty means Postiz Cloud. A self-hosted instance
 * serves the API under `/api/public/v1` on its own origin, so an origin alone
 * gets that path added; a URL that already ends in `/public/v1` is kept.
 *
 * The API key rides in the Authorization header to this host, so the URL must
 * be https and carry no credentials, query or fragment.
 */
export function normalizePostizBaseUrl(url: string | null | undefined): string {
	const trimmed = (url ?? '').trim();
	if (!trimmed) return POSTIZ_API_BASE;
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[postiz] base_url must be an absolute https:// URL, such as https://postiz.example.com',
		);
	}
	if (parsed.protocol !== 'https:') {
		throw new Error('[postiz] base_url must use https');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[postiz] base_url must not include credentials');
	}
	if (parsed.search || parsed.hash || /[?#]/.test(trimmed)) {
		throw new Error('[postiz] base_url must not include a query or fragment');
	}
	if (POSTIZ_CLOUD_HOSTS.has(parsed.hostname)) return POSTIZ_API_BASE;
	let path = parsed.pathname;
	while (path.endsWith('/')) path = path.slice(0, -1);
	if (!path.endsWith('/public/v1')) path = `${path}/api/public/v1`;
	return `${parsed.origin}${path}`;
}

/**
 * The API base for a call: the `baseUrl` option when set, otherwise the
 * account's stored `base_url`, otherwise Postiz Cloud. An inline `key` option
 * is not the stored account's key, so it is paired with the option or Cloud,
 * never with the stored field.
 */
export async function resolvePostizBaseUrl(ctx: {
	options?: { baseUrl?: string; key?: string };
	keys?: { get_base_url?: () => Promise<string | null | undefined> };
}): Promise<string> {
	const fromOptions = ctx.options?.baseUrl?.trim();
	if (fromOptions) return normalizePostizBaseUrl(fromOptions);
	if (ctx.options?.key) return POSTIZ_API_BASE;
	return normalizePostizBaseUrl(await ctx.keys?.get_base_url?.());
}

/**
 * A failure before Postiz answered: a dropped connection, DNS, an abort, or a
 * key that cannot go in a header. An HTTP error from Postiz stays core's
 * `ApiError`, so its status and Retry-After reach the handlers unchanged.
 */
export class PostizAPIError extends Error {
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached Postiz (DNS, reset, abort). */
	readonly transport: boolean;

	constructor(
		message: string,
		options: { cause?: Error; method?: string; transport?: boolean } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PostizAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
	}
}

/** Unparsed bodies: an error body before a guard narrows it, and a response
 * body before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

function asRecord(value: Untyped): Record<string, Untyped> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, Untyped>)
		: undefined;
}

function readString(
	record: Record<string, Untyped> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** The API's `msg` on its own errors, or NestJS's `message` on a missing route. */
export function readErrorMessage(body: Untyped): string | undefined {
	const record = asRecord(body);
	return readString(record, 'msg') ?? readString(record, 'message');
}

/** NestJS's `error` label, such as `Not Found`; absent on the `{ msg }` shape. */
export function readErrorLabel(body: Untyped): string | undefined {
	return readString(asRecord(body), 'error');
}

/**
 * Postiz answers two error shapes. Its own handlers send `{ msg }`, as in
 * `{"msg":"Invalid API key"}`. A route that does not exist is caught by NestJS
 * and answered as `{ message, error, statusCode }`.
 */
export function describePostizError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	const message = readErrorMessage(body) ?? fallback;
	const label = [status, readErrorLabel(body)]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Postiz ${label}: ${message}` : message;
}

export type PostizQuery = Record<string, string | number | boolean | undefined>;

export type PostizRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: PostizQuery;
	// unknown: each endpoint's input schema has already validated the body.
	body?: Untyped;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makePostizRequest(
	apiKey: string,
	{ method, path, query, body }: PostizRequest,
	baseUrl: string = POSTIZ_API_BASE,
): Promise<Untyped> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('postiz', 'api_key');
	}
	if (/[\r\n]/.test(apiKey)) {
		throw new PostizAPIError('The API key must not contain newlines');
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		// The raw key, with no scheme prefix, is what Postiz documents.
		Authorization: apiKey,
	};
	if (body !== undefined) headers['Content-Type'] = 'application/json';

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the caller's output schema parses the body returned here.
		// Core retries a 429 itself, honouring Retry-After.
		return await request<Untyped>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			// Core's message is only the status text ("Bad Request"). Put Postiz's
			// own reason on the same error, so an agent sees why and handlers
			// still get core's ApiError with its status and Retry-After.
			error.message = describePostizError(
				error.status,
				error.body,
				error.message,
			);
			throw error;
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PostizAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PostizAPIError('Unknown Postiz error', {
			method,
			transport: true,
		});
	}
}
