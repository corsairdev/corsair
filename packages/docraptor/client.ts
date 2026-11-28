import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DOCRAPTOR_API_BASE = 'https://api.docraptor.com';
// ips.json lives on the marketing host, not the API host.
export const DOCRAPTOR_SITE_BASE = 'https://docraptor.com';

export type DocRaptorHost = keyof typeof DOCRAPTOR_HOSTS;

export const DOCRAPTOR_HOSTS = {
	api: DOCRAPTOR_API_BASE,
	site: DOCRAPTOR_SITE_BASE,
} as const;

// Hosted documents are generated synchronously and DocRaptor allows 60s for
// synchronous generation, past corsair/http's 20s default.
const DOCRAPTOR_TIMEOUT_MS = 90_000;

// error-handlers.ts owns retries, so the transport makes one attempt.
// DocRaptor publishes no rate-limit header and no 429: its throttle is a 403
// on more than 30 simultaneous requests. Matching that 403 here is what makes
// core read Retry-After into the ApiError, should DocRaptor ever send one.
const DOCRAPTOR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 429 ||
		(status === 403 &&
			/simultaneous|throttl/i.test(describeDocRaptorErrorBody(body, ''))),
};

export type DocRaptorQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type DocRaptorRequest = {
	method: 'GET' | 'POST' | 'PATCH';
	host?: DocRaptorHost;
	path: string;
	query?: DocRaptorQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** `binary` returns `{ bytes, contentType }` for the routes that answer with the document itself. */
	responseType?: 'binary';
};

/**
 * Error bodies arrive in three shapes with no single rule: an XML envelope
 * (`<errors><error>...`) on most endpoints even for JSON requests, a JSON
 * `{ errors: [...] }` on expire failures, and an EMPTY body on some 403s.
 * This pulls a human message out of any of the three and falls back otherwise.
 */
/**
 * The text of each `<error ...>...</error>` element, found with a linear
 * scan instead of a backtracking regex (the body is untrusted).
 */
function xmlErrorMessages(text: string): string[] {
	const lower = text.toLowerCase();
	const messages: string[] = [];
	let from = 0;
	for (;;) {
		const open = lower.indexOf('<error', from);
		if (open === -1) break;
		const next = lower.charAt(open + 6);
		// `<errors>` or `<error-x>` is another element; skip past it.
		if (next !== '>' && !/\s/.test(next)) {
			from = open + 6;
			continue;
		}
		const tagEnd = lower.indexOf('>', open);
		if (tagEnd === -1) break;
		const close = lower.indexOf('</error>', tagEnd + 1);
		if (close === -1) break;
		const message = text.slice(tagEnd + 1, close).trim();
		if (message) messages.push(message);
		from = close + 8;
	}
	return messages;
}

export function describeDocRaptorErrorBody(
	body: unknown,
	fallback: string,
): string {
	if (typeof body === 'string') {
		const trimmed = body.trim();
		if (!trimmed) return fallback;
		const xmlMessages = xmlErrorMessages(trimmed);
		if (xmlMessages.length > 0) return xmlMessages.join('; ');
		if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
			try {
				return describeDocRaptorErrorBody(JSON.parse(trimmed), trimmed);
			} catch {
				return trimmed;
			}
		}
		return trimmed;
	}
	const record = asRecord(body);
	if (record) {
		const errors = record.errors;
		if (Array.isArray(errors)) {
			const first = errors.find((entry) => typeof entry === 'string');
			if (first) return (first as string).trim();
		}
		for (const key of ['message', 'error'] as const) {
			const value = record[key];
			if (typeof value === 'string' && value.trim()) return value.trim();
		}
	}
	return fallback;
}

/** Whether an error is DocRaptor's throttle: a 403 naming simultaneous requests (more than 30 at once) instead of a 429. */
export function isDocRaptorThrottle(error: unknown): boolean {
	return (
		error instanceof ApiError &&
		error.status === 403 &&
		/simultaneous|throttl/i.test(describeDocRaptorErrorBody(error.body, ''))
	);
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema; it is
// undefined for the bodyless answers (200 empty on expire). Core's ApiError
// passes through unchanged: its body holds DocRaptor's XML or JSON error
// (`describeDocRaptorErrorBody` reads it), never the request's content.
export async function makeDocRaptorRequest(
	apiKey: string,
	{ method, host = 'api', path, query, body, responseType }: DocRaptorRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DOCRAPTOR_HOSTS[host],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: DOCRAPTOR_TIMEOUT_MS,
		HEADERS: {
			Accept: responseType === 'binary' ? '*/*' : 'application/json',
			// The API key is the Basic USERNAME with an EMPTY password. corsair's
			// USERNAME/PASSWORD auth config rejects an empty password, so the
			// header is built literally instead.
			Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
		...(responseType ? { responseType } : {}),
	};

	return await request<unknown>(config, requestOptions, {
		rateLimitConfig: DOCRAPTOR_RATE_LIMIT_CONFIG,
	});
}
