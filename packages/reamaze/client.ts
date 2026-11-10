import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Re:amaze has no shared API host. Requests are scoped by **brand**, and each
 * brand is reached at `https://{brand}.reamaze.io/api/v1`; the brand is found on
 * the brand's settings page. Only the brand name is configuration. The domain
 * is fixed here, so a stored value can never point a request, or the Basic
 * credentials it carries, at another machine.
 */
export const DEFAULT_REAMAZE_HOST = 'example.reamaze.io';

/** The API domain every brand lives under. */
const REAMAZE_API_DOMAIN = 'reamaze.io';

/**
 * Domains a brand address is pasted with. `{brand}.reamaze.com` is the address
 * staff see in the browser and names the same brand, so it is accepted and
 * rewritten to the API domain.
 */
const BRAND_ADDRESS_SUFFIXES = ['.reamaze.io', '.reamaze.com'] as const;

/** A brand is one DNS label: letters, digits and inner hyphens, 63 at most. */
const BRAND_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Reduces what was configured to `{brand}.reamaze.io`. Accepts the brand name
 * (`acme`), the host (`acme.reamaze.io`) or the address people paste
 * (`https://acme.reamaze.io/`), and rejects everything else: another domain, an
 * IP address, a port, a path, a nested subdomain.
 */
export function normalizeReamazeHost(host: string): string {
	const trimmed = host.trim();
	if (!trimmed) {
		throw new Error('[reamaze] brand host is required, e.g. acme.reamaze.io');
	}

	let value = trimmed;
	if (trimmed.includes('://')) {
		let url: URL;
		try {
			url = new URL(trimmed);
		} catch {
			throw new Error('[reamaze] brand host is not a valid URL');
		}
		if (url.protocol !== 'https:') {
			throw new Error('[reamaze] brand host must use https');
		}
		if (url.username || url.password) {
			throw new Error('[reamaze] brand host must not contain credentials');
		}
		value = url.host;
	}

	// A loop rather than a trailing-slash regex, which CodeQL flags as ReDoS on
	// uncontrolled input.
	while (value.endsWith('/')) {
		value = value.slice(0, -1);
	}

	let brand = value.toLowerCase();
	for (const suffix of BRAND_ADDRESS_SUFFIXES) {
		if (brand.endsWith(suffix)) {
			brand = brand.slice(0, -suffix.length);
			break;
		}
	}
	if (!BRAND_PATTERN.test(brand)) {
		throw new Error(
			'[reamaze] brand host must be a Re:amaze brand, e.g. acme or acme.reamaze.io',
		);
	}
	return `${brand}.${REAMAZE_API_DOMAIN}`;
}

/** `https://{host}/api/v1`, the base every documented path hangs off. */
export function reamazeBase(host: string): string {
	return `https://${normalizeReamazeHost(host)}/api/v1`;
}

/**
 * Re:amaze authenticates with **HTTP Basic**: the user's login email as the
 * username and their personal API token as the password. One string cannot
 * carry both, and `keyBuilder` returns one, so the pair travels JSON-encoded and
 * is parsed here, the same shape ServiceNow uses.
 */
export type ReamazeCredentials = {
	email: string;
	token: string;
};

/** Parses the pair out of the key builder's JSON string. */
export function parseCredentials(key: string): ReamazeCredentials {
	let parsed: unknown;
	try {
		parsed = JSON.parse(key);
	} catch {
		throw new ReamazeAPIError(
			'Re:amaze credentials must be a JSON object with email and token',
		);
	}
	const record = asRecord(parsed);
	const email = record?.email;
	const token = record?.token;
	if (
		typeof email !== 'string' ||
		email.length === 0 ||
		typeof token !== 'string' ||
		token.length === 0
	) {
		throw new ReamazeAPIError(
			'Re:amaze credentials must include a non-empty email and token',
		);
	}
	return { email, token };
}

/**
 * Re:amaze answers errors with a real HTTP status. Verified live, three body
 * shapes occur: `{ errors: "Not Found" }` for an unknown resource,
 * `{ status, error }` for an unknown route, and a map of field to messages for
 * a 422. A path that matches no route can also answer the site's **HTML** page,
 * so a failure may carry no JSON at all, which is why the fallback message
 * matters. A 429 means the per-token limit was hit.
 */
export class ReamazeAPIError extends Error {
	readonly status?: number;
	/** The API's machine-readable error when it sends one. */
	readonly code?: string;
	/** Per-field validation messages, when the body carries them. */
	readonly details: readonly string[];
	/** Milliseconds from a Retry-After header, when Re:amaze sent one. */
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
		this.name = 'ReamazeAPIError';
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

	/** 422 is a field Re:amaze rejected; the same body would fail again. */
	get isUnprocessable(): boolean {
		return this.status === 422;
	}
}

/**
 * Reads a Re:amaze error body into a message and details.
 *
 * Verified live, the API uses three shapes:
 *
 * - `{ "errors": "Not Found" }` for an unknown resource
 * - `{ "status": 404, "error": "Not Found" }` for a route that does not exist
 * - `{ "errors": { "logins.email": ["can't be blank"], "name": ["can't be blank"] } }`
 *   for a 422, where each key is a field and each value its messages
 *
 * unknown: the body is untyped until the guards here narrow it.
 */
export function describeReamazeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): { message: string; code?: string; details: string[] } {
	const record = asRecord(body);
	const details: string[] = [];
	let firstMessage: string | undefined;

	for (const key of ['errors', 'details'] as const) {
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
		// The 422 shape: a map of field name to a list of messages.
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

	const errorField = record?.error ?? record?.message;
	const message =
		(typeof errorField === 'string' && errorField.length > 0
			? errorField
			: firstMessage) ?? fallback;

	const code = typeof record?.code === 'string' ? record.code : undefined;
	const label =
		status === undefined ? message : `Re:amaze ${status}: ${message}`;
	return { message: label, code, details };
}

export type ReamazeRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path after `/api/v1`, e.g. `/conversations`. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Encodes one path segment, keeping an `@` readable. A contact is addressed by
 * email, and every documented example sends `bob@example.com` rather than
 * `bob%40example.com`.
 */
export function pathSegment(value: string | number): string {
	return segment(value).replace(/%40/gi, '@');
}

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. Re:amaze rate-limits per API token and answers 429 when
// the limit is reached; it does not document a Retry-After value.
const REAMAZE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function configWith(
	host: string,
	credentials: ReamazeCredentials,
): OpenAPIConfig {
	return {
		BASE: reamazeBase(host),
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// HTTP Basic: both are required for corsair/http to emit the header.
		USERNAME: credentials.email,
		PASSWORD: credentials.token,
		HEADERS: {
			// Verified live, the API answers JSON without this header. It is sent
			// anyway, since the vendor documents it.
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeReamazeRequest(
	host: string,
	key: string,
	{ method, path, query, body }: ReamazeRequest,
): Promise<unknown> {
	const credentials = parseCredentials(key);
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(
			configWith(host, credentials),
			requestOptions,
			{ rateLimitConfig: REAMAZE_RATE_LIMIT_CONFIG },
		);
	} catch (error) {
		if (error instanceof ReamazeAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeReamazeError(
				error.status,
				error.body,
				error.message,
			);
			throw new ReamazeAPIError(described.message, {
				cause: error,
				status: error.status,
				code: described.code,
				details: described.details,
				retryAfter: error.retryAfter,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ReamazeAPIError(error.message, { cause: error, method });
		}
		throw new ReamazeAPIError('Unknown Re:amaze error', { method });
	}
}
