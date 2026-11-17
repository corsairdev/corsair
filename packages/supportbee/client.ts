import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * SupportBee has no shared API host. Every desk is its own subdomain, reached at
 * `https://{company}.supportbee.com`, and the company is the first label of the
 * desk address an agent sees in the browser.
 *
 * Only the company name is configuration. The domain is fixed here, so a stored
 * value can never point a request, or the bearer token it carries, at another
 * machine.
 */
/** The API domain every desk lives under. */
const SUPPORTBEE_API_DOMAIN = 'supportbee.com';

/** Domains a desk address is pasted with. */
const COMPANY_ADDRESS_SUFFIXES = [
	'.supportbee.com',
	'.supportbeeapp.com',
] as const;

/** A company is one DNS label: letters, digits and inner hyphens, 63 at most. */
const COMPANY_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Reduces what was configured to `{company}.supportbee.com`. Accepts the company
 * name (`acme`), the host (`acme.supportbee.com`) or the address people paste
 * (`https://acme.supportbee.com/tickets`), and rejects everything else: another
 * domain, an IP address, a port, a nested subdomain.
 */
export function normalizeSupportbeeCompany(company: string): string {
	const trimmed = company.trim();
	if (!trimmed) {
		throw new Error(
			'[supportbee] company is required, e.g. acme or acme.supportbee.com',
		);
	}

	let value = trimmed;
	if (trimmed.includes('://')) {
		let url: URL;
		try {
			url = new URL(trimmed);
		} catch {
			throw new Error('[supportbee] company address is not a valid URL');
		}
		if (url.protocol !== 'https:') {
			throw new Error('[supportbee] company address must use https');
		}
		if (url.username || url.password) {
			throw new Error(
				'[supportbee] company address must not contain credentials',
			);
		}
		value = url.host;
	}

	// A loop rather than a trailing-slash regex, which CodeQL flags as ReDoS on
	// uncontrolled input.
	while (value.endsWith('/')) {
		value = value.slice(0, -1);
	}

	let companyName = value.toLowerCase();
	for (const suffix of COMPANY_ADDRESS_SUFFIXES) {
		if (companyName.endsWith(suffix)) {
			companyName = companyName.slice(0, -suffix.length);
			break;
		}
	}
	if (!COMPANY_PATTERN.test(companyName)) {
		throw new Error(
			'[supportbee] company must be a SupportBee desk, e.g. acme or acme.supportbee.com',
		);
	}
	return `${companyName}.${SUPPORTBEE_API_DOMAIN}`;
}

/** `https://{company}.supportbee.com`, the base every documented path hangs off. */
export function supportbeeBase(company: string): string {
	return `https://${normalizeSupportbeeCompany(company)}`;
}

/**
 * SupportBee answers a failed request with a real HTTP status. The documented
 * ones are 400 for a validation failure, 401 or 403 for a rejected token, 404
 * for a missing resource and 429 when a request is rate limited.
 *
 * The token is a **bearer token** taken from the desk's own page, under the
 * profile picture, then API Token.
 */
export class SupportbeeAPIError extends Error {
	readonly status?: number;
	/** The API's machine-readable error when it sends one. */
	readonly code?: string;
	/** Per-field validation messages, when the body carries them. */
	readonly details: readonly string[];
	/** Milliseconds from a Retry-After header, when SupportBee sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			details?: readonly string[];
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SupportbeeAPIError';
		this.status = options.status;
		this.code = options.code;
		this.details = options.details ?? [];
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	get isNotFound(): boolean {
		return this.status === 404;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

/**
 * Reads a SupportBee error body into a message and details. The API answers
 * a validation failure with a field-to-messages map, and a routing failure with
 * an HTML page from the desk, so a failure can carry no JSON at all.
 *
 * unknown: the body is untyped until the guards here narrow it.
 */
export function describeSupportbeeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): { message: string; code?: string; details: string[] } {
	const record = asRecord(body);
	const details: string[] = [];
	let firstMessage: string | undefined;

	for (const key of ['errors', 'error', 'details', 'message'] as const) {
		const value = record?.[key];
		if (typeof value === 'string' && value.length > 0) {
			firstMessage ??= value;
			details.push(value);
			continue;
		}
		if (Array.isArray(value)) {
			for (const entry of value) {
				if (typeof entry === 'string') {
					firstMessage ??= entry;
					details.push(entry);
					continue;
				}
				const item = asRecord(entry);
				const text = item?.message ?? item?.detail;
				if (typeof text === 'string') {
					firstMessage ??= text;
					details.push(text);
				}
			}
			continue;
		}
		// The validation shape: a map of field name to a list of messages.
		const fields = asRecord(value);
		if (fields) {
			for (const [field, messages] of Object.entries(fields)) {
				const list = Array.isArray(messages) ? messages : [messages];
				for (const message of list) {
					if (typeof message !== 'string') continue;
					firstMessage ??= `${field} ${message}`;
					details.push(`${field} ${message}`);
				}
			}
		}
	}

	const message = firstMessage ?? fallback;
	const code = typeof record?.code === 'string' ? record.code : undefined;
	const label =
		status === undefined ? message : `SupportBee ${status}: ${message}`;
	return { message: label, code, details };
}

export type SupportbeeRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path after the host, e.g. `/tickets`. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	/** A form body, used only by the attachment upload. */
	form?: FormData;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. SupportBee rate-limits ticket creation and does not
// document a Retry-After value; retries live in error-handlers.ts.
const SUPPORTBEE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one request. The token is a bearer token, and SupportBee also requires
 * `Accept: application/json`: without it the desk answers HTML.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeSupportbeeRequest(
	company: string,
	apiKey: string,
	{ method, path, query, body, form }: SupportbeeRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: supportbeeBase(company),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// Documented as required: without it the desk answers HTML.
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		// A FormData body carries its own multipart boundary, so no media type is
		// set for it.
		body: form ?? body,
		mediaType: form || body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SUPPORTBEE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof SupportbeeAPIError) throw error;
		if (error instanceof ApiError) {
			// Still core's ApiError (plugin rule R8), so its status and retry fields
			// reach the handlers. It is rebuilt only to drop the request body and
			// form, which hold ticket text, customer emails and attachment files.
			// The token is in the config headers, never in the request options.
			throw new ApiError(
				{ method: error.request.method, url: error.request.url },
				{
					// The query can hold search text such as a customer's email.
					url: error.url.split('?')[0] ?? error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: error.body,
				},
				describeSupportbeeError(error.status, error.body, error.message)
					.message,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A key the Headers class refuses (a newline, say) comes back inside
			// the message, so the key is cut from it and that error is not kept as
			// the cause.
			const leaks =
				apiKey.length > 0 &&
				(error.message.includes(apiKey) ||
					String(error.stack ?? '').includes(apiKey));
			const message = leaks
				? error.message.split(apiKey).join('[redacted]')
				: error.message;
			throw new SupportbeeAPIError(
				message,
				leaks ? { method } : { cause: error, method },
			);
		}
		throw new SupportbeeAPIError('Unknown SupportBee error', { method });
	}
}
