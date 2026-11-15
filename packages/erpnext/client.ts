import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Strips trailing slashes from the caller-supplied site origin without a
 * regular expression: the origin is user input, and a backtracking trim
 * over strings of repeated slashes is quadratic (CodeQL polynomial-regex).
 */
export function trimTrailingSlashes(url: string): string {
	let trimmed = url;
	while (trimmed.endsWith('/')) {
		trimmed = trimmed.slice(0, -1);
	}
	return trimmed;
}

/**
 * Validates a site origin before any credential is sent to it: an absolute
 * https URL with a host, no embedded credentials, query or fragment. A path
 * prefix (a site behind a reverse proxy) is kept, without trailing slashes.
 * The value comes from plugin options or the tenant's stored base_url, so a
 * typo or a plain-http URL fails here instead of sending the token in clear
 * text or to an unexpected host.
 */
export function normalizeErpnextBaseUrl(url: string): string {
	const trimmed = url.trim();
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[erpnext] base URL must be an absolute https:// URL, for example https://yourcompany.frappe.cloud',
		);
	}
	if (parsed.protocol !== 'https:') {
		throw new Error('[erpnext] base URL must use https');
	}
	if (!parsed.hostname) {
		throw new Error('[erpnext] base URL must include a host');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[erpnext] base URL must not include credentials');
	}
	if (
		parsed.search ||
		parsed.hash ||
		trimmed.includes('?') ||
		trimmed.includes('#')
	) {
		throw new Error('[erpnext] base URL must not include a query or fragment');
	}
	return `${parsed.origin}${trimTrailingSlashes(parsed.pathname)}`;
}

/**
 * A missing site origin is a missing connection setting: AuthMissingError
 * lets Corsair offer a connect link that asks for the account's base_url.
 */
export function missingErpnextBaseUrl(detail: string): AuthMissingError {
	return new AuthMissingError('erpnext', 'api_key', `[erpnext] ${detail}`);
}

export class ErpnextAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` is intentional here: the body is whatever the Frappe site
	// returned (JSON with `exc`/`_server_messages`, sometimes plain text), so
	// no narrower type can be guaranteed and callers must narrow it.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options);
		this.name = 'ErpnextAPIError';
		if (options?.cause instanceof ApiError) {
			// The shared transport already parsed the response, including the
			// Retry-After header in milliseconds, so its fields are authoritative.
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		} else if (options) {
			// Direct construction (binary download path): the caller read the
			// status line and Retry-After itself, so carry them through so the
			// error handlers can classify and rate-limit the wrapped error.
			this.status = options.status;
			this.statusText = options.statusText;
			this.body = options.body;
			this.retryAfter = options.retryAfter;
		}
	}
}

/**
 * ERPNext tokens are `<api_key>:<api_secret>` pairs. The composite credential
 * the key builder returns is forwarded as Frappe's documented custom scheme.
 */
export function erpnextAuthorizationHeader(key: string): string {
	return `token ${key}`;
}

export type ErpnextRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// `unknown` is intentional here: bodies are provider-defined payloads
	// (documents are open record sets validated by each operation's input
	// schema before they reach this transport).
	body?: unknown;
	// `unknown` is intentional here: query values are provider-defined filter,
	// field-list, and pagination inputs forwarded as-is after validation.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	mediaType?: string;
};

export async function makeErpnextRequest<T>(
	endpoint: string,
	baseUrl: string,
	key: string,
	options: ErpnextRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType } = options;

	const config: OpenAPIConfig = {
		BASE: trimTrailingSlashes(baseUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// Frappe's documented token scheme; sent verbatim so the shared
			// client never rewrites it to a Bearer header.
			Authorization: erpnextAuthorizationHeader(key),
			...headers,
		},
	};

	const hasBody = body !== undefined && method !== 'GET';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? (mediaType ?? 'application/json') : undefined,
		query,
	};

	// Core's ApiError passes through unchanged (its status and retryAfter
	// drive the error handlers), and core's request() keeps its default 429
	// retries, which honour Retry-After.
	return request<T>(config, requestOptions);
}

/**
 * Fetches binary content (document PDFs, stored files) with the same token
 * authentication. The shared transport returns non-JSON bodies as decoded
 * text, which mangles bytes, so downloads go through fetch directly and the
 * bytes come back as base64 for the operation's output schema.
 */
export async function fetchErpnextBinary(
	endpoint: string,
	baseUrl: string,
	key: string,
): Promise<string> {
	const url = `${trimTrailingSlashes(baseUrl)}${endpoint}`;
	// Downloads skip core's request(), so they repeat its 429 handling here:
	// up to three retries, waiting for Retry-After (capped) or backing off.
	for (let attempt = 0; ; attempt++) {
		const response = await fetch(url, {
			headers: { Authorization: erpnextAuthorizationHeader(key) },
			signal: AbortSignal.timeout(60_000),
		});
		if (response.ok) {
			const bytes = new Uint8Array(await response.arrayBuffer());
			return Buffer.from(bytes).toString('base64');
		}
		// The failed body is never read; cancel it so undici can free the connection.
		await response.body?.cancel().catch(() => undefined);
		const statusText = response.statusText || 'Request failed';
		// Mirror the shared transport's Retry-After handling: the header is
		// in seconds on the wire and milliseconds once wrapped, so the
		// endpoint error handlers see the same shape as JSON-path errors and
		// can classify (401/403/429) binary reads correctly.
		const retryAfterHeader = response.headers.get('Retry-After');
		const retryAfterSeconds = retryAfterHeader
			? Number.parseInt(retryAfterHeader, 10)
			: Number.NaN;
		const retryAfter = Number.isNaN(retryAfterSeconds)
			? undefined
			: retryAfterSeconds * 1000;
		if (response.status === 429 && attempt < BINARY_MAX_RETRIES) {
			const wait = Math.min(
				retryAfter ?? 1000 * 2 ** attempt,
				BINARY_MAX_RETRY_WAIT_MS,
			);
			await new Promise((resolve) => setTimeout(resolve, wait));
			continue;
		}
		throw new ErpnextAPIError(
			`ERPNext binary download failed with HTTP ${response.status}: ${statusText}`,
			{
				cause: new Error(String(response.status)),
				status: response.status,
				statusText,
				retryAfter,
			},
		);
	}
}

const BINARY_MAX_RETRIES = 3;
const BINARY_MAX_RETRY_WAIT_MS = 60_000;
