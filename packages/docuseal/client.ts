import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** DocuSeal Cloud, global (US) region. */
export const DOCUSEAL_API_BASE = 'https://api.docuseal.com';
/** DocuSeal Cloud, EU region (the spec's second server). */
export const DOCUSEAL_EU_API_BASE = 'https://api.docuseal.eu';

const CLOUD_API_HOSTS = new Set(['api.docuseal.com', 'api.docuseal.eu']);
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

/**
 * The API root for a DocuSeal server. Cloud keys go to `api.docuseal.com`
 * (global) or `api.docuseal.eu`; a self-hosted install serves the same API
 * under `<site>/api`, so a site URL (`https://sign.example.com`) gets `/api`
 * appended and an API root (`https://sign.example.com/api`) is kept.
 */
export function normalizeDocuSealBaseUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) return DOCUSEAL_API_BASE;
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[docuseal] baseUrl must be an absolute http(s) URL, for example https://api.docuseal.eu',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[docuseal] baseUrl must use http or https');
	}
	// The API key and signer data travel on every call: plain http only for a
	// server on this machine.
	if (parsed.protocol === 'http:' && !LOOPBACK_HOSTS.has(parsed.hostname)) {
		throw new Error(
			'[docuseal] baseUrl must use https (http is allowed only for localhost)',
		);
	}
	if (parsed.username || parsed.password || parsed.search || parsed.hash) {
		throw new Error(
			'[docuseal] baseUrl must not include credentials, a query or a fragment',
		);
	}
	let path = parsed.pathname;
	// A loop rather than /\/+$/, which CodeQL flags as ReDoS on long slash runs.
	while (path.endsWith('/')) path = path.slice(0, -1);
	if (CLOUD_API_HOSTS.has(parsed.hostname)) return `${parsed.origin}${path}`;
	if (!path.endsWith('/api')) path = `${path}/api`;
	return `${parsed.origin}${path}`;
}

/**
 * DocuSeal documents no rate-limit contract. If a 429 comes back, core's
 * request() retries it three times, honouring Retry-After when a gateway
 * sends one; the plugin's 429 handler then does not retry again.
 */
export const DOCUSEAL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the error body is DocuSeal's JSON envelope or whatever a proxy
// answered with.
function readErrorMessage(body: unknown): string | undefined {
	const value = asRecord(body)?.error;
	return typeof value === 'string' && value.length > 0
		? redactEmails(value)
		: undefined;
}

const EMAIL_PATTERN = /[^\s@"'<>(),;:]+@[^\s@"'<>(),;:]+\.[^\s@"'<>(),;:]+/g;

/** DocuSeal echoes submitter input in some messages; addresses are replaced. */
export function redactEmails(text: string): string {
	return text.replace(EMAIL_PATTERN, '[email]');
}

// unknown: the error body is an open shape, narrowed below one field at a time.
export function describeDocuSealError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message = readErrorMessage(body) ?? fallback;
	return status === undefined ? message : `DocuSeal ${status}: ${message}`;
}

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent request on `ApiError.request`: its headers hold the
 * X-Auth-Token and its body can hold signer names, emails, phone numbers and
 * base64 documents. The error is rebuilt without them, keeping the status,
 * method and rate-limit fields that the error handlers and core read, and
 * with DocuSeal's own `{"error": "..."}` reason as the message.
 */
export function withoutRequestData(error: ApiError): ApiError {
	const body = asRecord(error.body);
	const reason = readErrorMessage(error.body);
	return new ApiError(
		{
			method: error.request.method,
			url: error.request.url,
			body: error.request.body === undefined ? undefined : REDACTED,
		},
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			// Only DocuSeal's error reason: anything else in the body is dropped.
			body: reason !== undefined ? { error: reason } : body ? {} : undefined,
		},
		// Core's message for an unlisted status embeds the whole response
		// body, so the fallback is the status text only.
		describeDocuSealError(
			error.status,
			error.body,
			error.statusText || 'request failed',
		),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * A request that never got a response (connection reset, DNS failure,
 * timeout). It carries the method so the error handlers replay only reads;
 * an HTTP error is core's ApiError instead.
 */
export class DocuSealTransportError extends Error {
	readonly method: string;

	constructor(method: string, cause: unknown, key?: string) {
		const raw =
			cause instanceof Error || cause instanceof DOMException
				? cause.message
				: 'DocuSeal request failed before a response';
		// A key Headers refuses (a newline in it) makes fetch throw a message
		// that quotes it: scrub it, and keep a cause only when it is clean.
		const leaks = Boolean(key) && raw.includes(String(key));
		super(
			leaks ? raw.split(String(key)).join('[REDACTED]') : raw,
			leaks ? undefined : { cause },
		);
		this.name = 'DocuSealTransportError';
		this.method = method;
	}
}

export type DocuSealQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type DocuSealRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: DocuSealQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** What one call needs from the endpoint context. */
export type DocuSealCallContext = {
	key: string;
	options?: { baseUrl?: string };
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeDocuSealRequest(
	ctx: DocuSealCallContext,
	{ method, path, query, body }: DocuSealRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: normalizeDocuSealBaseUrl(ctx.options?.baseUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'X-Auth-Token': ctx.key },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: callers parse the body with the endpoint's zod output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DOCUSEAL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw new DocuSealTransportError(method, error, ctx.key);
	}
}
