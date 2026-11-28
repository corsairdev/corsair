import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SMTP2GO_API_BASE = 'https://api.smtp2go.com/v3';

/**
 * SMTP2GO's hosts (the `servers` of its reference): the regionless default
 * routes to the account's region; the regional hosts pin one.
 */
export const SMTP2GO_REGION_HOSTS = {
	us: 'https://us-api.smtp2go.com/v3',
	eu: 'https://eu-api.smtp2go.com/v3',
	au: 'https://au-api.smtp2go.com/v3',
} as const;

export type Smtp2goRegion = keyof typeof SMTP2GO_REGION_HOSTS;

export function smtp2goBaseUrl(region: Smtp2goRegion | undefined): string {
	return region ? SMTP2GO_REGION_HOSTS[region] : SMTP2GO_API_BASE;
}

// The key travels in the X-Smtp2go-Api-Key header, never in the JSON body:
// the API's documented default transport is body-based, and error payloads
// can echo request fields, so a body-carried key could leak into an error.
// Header auth is accepted on every route (live-verified against all 69
// documented paths).

// The 429 that matters here has an empty body and no Retry-After header
// (live-verified): the API throttles by IP for at least one minute after too
// many requests OR too many error responses. Core retries once, after that
// documented minimum; the plugin's 429 handler then does not retry again.
export const SMTP2GO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 1,
	enabled: true,
	initialRetryDelay: 60_000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the body is an untyped JSON value until these narrow it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * SMTP2GO wraps every answer in `{ request_id, data }`. Errors carry the
 * message in `data.error` and a code in `data.error_code`; some documented
 * failures use a bare `{ error, error_code }` body without the `data`
 * wrapper, so both shapes are read.
 */
export function readEnvelopeError(
	// unknown: the body arrives as an untyped JSON value until this narrows it.
	raw: unknown,
): { message: string; code?: string } | undefined {
	const record = asRecord(raw);
	const data = asRecord(record?.data);
	const message = readString(data, 'error') ?? readString(record, 'error');
	if (message === undefined) return undefined;
	return {
		message,
		code: readString(data, 'error_code') ?? readString(record, 'error_code'),
	};
}

function looksLikeEmail(word: string): boolean {
	const at = word.indexOf('@');
	if (at < 1) return false;
	const dot = word.indexOf('.', at + 2);
	return dot > at + 1 && dot < word.length - 1;
}

/**
 * Replaces words that look like an email address. A split instead of a
 * regex keeps this linear on any input.
 */
export function redactEmails(text: string): string {
	return text
		.split(' ')
		.map((word) => (looksLikeEmail(word) ? '[email]' : word))
		.join(' ');
}

/** SMTP2GO's error code (`E_ApiResponseCodes.…`) on an ApiError or envelope error. */
export function smtp2goErrorCode(error: unknown): string | undefined {
	if (error instanceof Smtp2goEnvelopeError) return error.code;
	return error instanceof ApiError
		? readEnvelopeError(error.body)?.code
		: undefined;
}

/**
 * The docs claim invalid keys answer 401, but the live API answers a missing
 * or malformed key with 403 and a well-formed unknown key with 400, both
 * naming api_key in the error text (live-verified).
 */
export function isSmtp2goAuthError(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	if (error.status === 401) return true;
	return (
		error.message.includes("'api_key'") && error.message.includes('not found')
	);
}

/**
 * Reads and searches re-run safely after a 5xx or a dropped connection; a
 * send, add or removal may already have taken effect.
 */
export function isReplayablePath(path: string | undefined): boolean {
	const route = (path ?? '').split('?')[0] ?? '';
	return (
		/\/(view|search|summary|permissions|view-received|view-sent)$/.test(
			route,
		) ||
		route.startsWith('/stats/') ||
		route === '/archive/email'
	);
}

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent request on `ApiError.request`: its headers hold the key
 * and its body holds recipients, message bodies and attachments. The error is
 * rebuilt without them, keeping the status, method, route and rate-limit
 * fields; the body keeps only SMTP2GO's error text and code.
 */
/**
 * Every string value the caller sent (template text, webhook tokens,
 * passwords), longest first, so an error that echoes one can drop it.
 */
// unknown: a request body is any JSON value.
export function sentStrings(body: unknown): string[] {
	const found = new Set<string>();
	const walk = (value: unknown, depth: number) => {
		if (depth > 6 || value === null || value === undefined) return;
		if (typeof value === 'string') {
			if (value.length >= 6) found.add(value);
			return;
		}
		if (Array.isArray(value)) {
			for (const item of value) walk(item, depth + 1);
			return;
		}
		if (typeof value === 'object') {
			for (const item of Object.values(value)) walk(item, depth + 1);
		}
	};
	walk(body, 0);
	return [...found].sort((a, b) => b.length - a.length);
}

export function scrubSent(text: string, sent: string[]): string {
	let out = text;
	for (const value of sent) out = out.split(value).join('[REDACTED]');
	return out;
}

export function withoutRequestData(error: ApiError): ApiError {
	const sent = sentStrings(error.request.body);
	const raw = readEnvelopeError(error.body);
	const envelope = raw
		? { ...raw, message: scrubSent(raw.message, sent) }
		: undefined;
	const label = [error.status, envelope?.code]
		.filter((part) => part !== undefined)
		.join(' ');
	// Core's message for an unlisted status embeds the whole response body,
	// so without SMTP2GO's error text the status text stands in.
	const text = redactEmails(
		envelope?.message ?? (error.statusText || 'request failed'),
	);
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
			body: envelope
				? {
						data: {
							error: redactEmails(envelope.message),
							error_code: envelope.code,
						},
					}
				: undefined,
		},
		`SMTP2GO ${label}: ${text}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * A request that never got a response (reset, DNS failure, timeout). It
 * carries the route so the handlers replay only reads; an HTTP error is
 * core's ApiError instead.
 */
export class Smtp2goTransportError extends Error {
	readonly method: string;
	readonly path: string;

	constructor(method: string, path: string, cause: unknown, key?: string) {
		const raw =
			cause instanceof Error || cause instanceof DOMException
				? cause.message
				: 'SMTP2GO request failed before a response';
		// A key Headers refuses (a newline in it) makes fetch throw a message
		// that quotes it: scrub it, and keep a cause only when it is clean.
		// Headers trims surrounding whitespace before quoting a value, so the
		// trimmed form is scrubbed too.
		const forms = key ? [key, key.trim()].filter(Boolean) : [];
		const leaks = forms.some((form) => raw.includes(form));
		let message = raw;
		for (const form of forms) message = message.split(form).join('[REDACTED]');
		super(message, leaks ? undefined : { cause });
		this.name = 'Smtp2goTransportError';
		this.method = method;
		this.path = path;
	}
}

/**
 * SMTP2GO can answer HTTP 200 with an error in its envelope
 * (`data.error` / `data.error_code`). It isn't an HTTP failure, so it gets
 * its own type, carrying only the code and the (email-redacted) text.
 */
export class Smtp2goEnvelopeError extends Error {
	readonly code?: string;
	readonly path: string;

	constructor(
		path: string,
		envelope: { message: string; code?: string },
		// unknown: the request body, whose echoed values are removed.
		sentBody?: unknown,
	) {
		super(
			`SMTP2GO error in a 2xx response: ${redactEmails(scrubSent(envelope.message, sentStrings(sentBody)))}`,
		);
		this.name = 'Smtp2goEnvelopeError';
		this.code = envelope.code;
		this.path = path;
	}
}

export type Smtp2goRequest = {
	/** POST for every route except the PATCH editors. */
	method?: 'POST' | 'PATCH';
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body?: Record<string, unknown>;
	/** Kept for the call sites; replay safety now follows the route (isReplayablePath). */
	replayable?: boolean;
};

/** Drops unset optional fields so the body carries only what the caller sent. */
export function pickBody(parsed: object): Record<string, unknown> {
	// unknown: JSON body values are open until serialization.
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(parsed)) {
		if (value !== undefined) body[key] = value;
	}
	return body;
}

/** What one call needs from the endpoint context. */
export type Smtp2goCallContext = {
	key: string;
	options?: { region?: Smtp2goRegion };
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeSmtp2goRequest(
	ctx: Smtp2goCallContext,
	{ method = 'POST', path, body }: Smtp2goRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: smtp2goBaseUrl(ctx.options?.region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Smtp2go-Api-Key': ctx.key,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		mediaType: 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SMTP2GO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw new Smtp2goTransportError(method, path, error, ctx.key);
	}
}
