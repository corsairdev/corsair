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
};

/**
 * Error bodies arrive in three shapes with no single rule: an XML envelope
 * (`<errors><error>...`) on most endpoints even for JSON requests, a JSON
 * `{ errors: [...] }` on expire failures, and an EMPTY body on some 403s.
 * This pulls a human message out of any of the three and falls back otherwise.
 */
export function describeDocRaptorErrorBody(
	body: unknown,
	fallback: string,
): string {
	if (typeof body === 'string') {
		const trimmed = body.trim();
		if (!trimmed) return fallback;
		const xmlMessages = [
			...trimmed.matchAll(/<error(?:\s[^>]*)?>([\s\S]*?)<\/error>/gi),
		]
			.map((match) => (match[1] ?? '').trim())
			.filter(Boolean);
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

export class DocRaptorAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when DocRaptor sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			retryAfter?: number;
			method?: string;
			// Retained only for transport failures (reset, DNS, abort), which
			// never carried a request body, so no credential can leak through it.
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'DocRaptorAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	/**
	 * The 403 throttle: DocRaptor answers more than 30 simultaneous generation
	 * requests with 403 instead of 429. Its message names the cause; the other
	 * two 403 meanings (no permission, listing denied) do not.
	 */
	get isThrottle(): boolean {
		return this.status === 403 && /simultaneous|throttl/i.test(this.message);
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema; it is
// undefined for the bodyless answers (200 empty on expire).
export async function makeDocRaptorRequest(
	apiKey: string,
	{ method, host = 'api', path, query, body }: DocRaptorRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DOCRAPTOR_HOSTS[host],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: DOCRAPTOR_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
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
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DOCRAPTOR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause ApiError is dropped: its body echoes request data, and
			// status plus the extracted message carry everything callers need.
			throw new DocRaptorAPIError(
				describeDocRaptorErrorBody(error.body, error.message),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new DocRaptorAPIError(error.message, { cause: error, method });
		}
		throw new DocRaptorAPIError('Unknown DocRaptor error', { method });
	}
}
