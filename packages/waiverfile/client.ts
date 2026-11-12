import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const WAIVERFILE_API_BASE = 'https://api.waiverfile.com';

/** The same deadline the shared transport gives every JSON request. */
const DOWNLOAD_TIMEOUT_MS = 20_000;

/**
 * Every call takes both credentials as **query parameters**: the `apiKey` and
 * the `siteID` GUID the key belongs to. There is no bearer token and no header,
 * and `InsertEvent` is the exception that carries them in the *body* instead.
 *
 * One Corsair key slot must hold both, so they are packed as
 * `<apiKey>\n<siteID>`.
 */
export type WaiverFileCredentials = {
	apiKey: string;
	siteID: string;
};

/** Splits the packed key, or undefined when it is not a pair. */
export function parseWaiverFileKey(
	key: string,
): WaiverFileCredentials | undefined {
	const [apiKey, siteID, ...rest] = key.split('\n');
	if (rest.length > 0) return undefined;
	if (!apiKey?.trim() || !siteID?.trim()) return undefined;
	return { apiKey: apiKey.trim(), siteID: siteID.trim() };
}

/** Rejects a key that is not the documented pair, before any request. */
export function requireWaiverFileKey(key: string): WaiverFileCredentials {
	const pair = parseWaiverFileKey(key);
	if (!pair) {
		throw new WaiverFileConfigurationError(
			'The WaiverFile key must hold the API key and the site ID, separated by a newline: `<apiKey>\\n<siteID>`.',
		);
	}
	return pair;
}

/** Raised before a request when the key slot is not the documented pair. */
export class WaiverFileConfigurationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'WaiverFileConfigurationError';
	}
}

const WAIVERFILE_RATE_LIMIT_CONFIG: RateLimitConfig = {
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
 * WaiverFile answers a failure as `{ Message }` with a capital M — no code, and
 * no lowercase `message`. A bad key or a wrong site is a **400**, not a 401,
 * which is worth knowing because the status alone reads like a validation
 * problem.
 */
export class WaiverFileAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when WaiverFile sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** The path that failed, so a handler can tell a read from a GET with effects. */
	readonly path?: string;
	// unknown: error bodies are usually `{ Message }`, but a proxy can answer
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
			path?: string;
		} = {},
	) {
		// An ApiError from corsair/http is never kept as the cause: it holds the
		// request query and body, and WaiverFile's credentials travel there as
		// `apiKey` (and `APIKey` in the InsertEvent body), which the shared
		// redaction does not cover. Its status, body and retry delay are copied
		// instead, already scrubbed.
		const cause = options.cause instanceof ApiError ? undefined : options.cause;
		super(message, cause ? { cause } : undefined);
		this.name = 'WaiverFileAPIError';
		this.status = options.status;
		this.body = options.body;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.path = options.path;
	}

	/**
	 * True when the key or site was rejected. WaiverFile reports this as a 400
	 * whose message starts `Invalid`, so the status alone cannot decide it —
	 * a genuine validation failure is also a 400.
	 */
	get isAuthError(): boolean {
		if (this.status === 401 || this.status === 403) return true;
		const message = readString(asRecord(this.body), 'Message') ?? '';
		// Ping answers `InvalidService is online though.`; every other route
		// answers a bare `Invalid`. Over_daily_limit and IP_blocked are the other
		// key-level refusals the reference lists.
		return (
			this.status === 400 &&
			(/^(Invalid(Service)?|Over_daily_limit|IP_blocked)\b/.test(message) ||
				message.includes('apiKey is required') ||
				message.includes('siteID is required'))
		);
	}

	/** True when the route itself does not exist, which is a 404 here. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

// unknown: see WaiverFileAPIError.
export function describeWaiverFileError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	// The error field is capitalised, unlike almost every other API.
	const text =
		readString(record, 'Message') ??
		readString(record, 'message') ??
		readString(record, 'ExceptionMessage') ??
		fallback;
	return status ? `WaiverFile ${status}: ${text}` : text;
}

export type WaiverFileQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type WaiverFileRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: WaiverFileQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** The media type, defaulting to JSON. */
	mediaType?: string;
	/**
	 * Values to remove from an error besides the key, such as a webhook target
	 * URL that may carry the receiver's token. WaiverFile's 404 echoes the whole
	 * request URL.
	 */
	redact?: string[];
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeWaiverFileRequest(
	credentials: WaiverFileCredentials,
	{ method, path, query, body, mediaType, redact }: WaiverFileRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: WAIVERFILE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// The credentials go on every query string, alongside the endpoint's own.
		query: { ...query, apiKey: credentials.apiKey, siteID: credentials.siteID },
		body,
		mediaType:
			body === undefined ? undefined : (mediaType ?? 'application/json'),
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WAIVERFILE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// A 404 body echoes the whole request URL, key included, so the body
			// is scrubbed before it reaches the message or the error object.
			const body = scrubWaiverFileSecret(
				error.body,
				credentials.apiKey,
				redact,
			);
			throw new WaiverFileAPIError(
				describeWaiverFileError(error.status, body, `HTTP ${error.status}`),
				{
					status: error.status,
					body,
					retryAfter: error.retryAfter,
					method,
					path,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WaiverFileAPIError(
				scrubWaiverFileSecret(error.message, credentials.apiKey, redact),
				{ method, path },
			);
		}
		throw new WaiverFileAPIError('Unknown WaiverFile error', { method, path });
	}
}

/**
 * Removes the API key from an error body or message. WaiverFile's "No HTTP
 * resource was found that matches the request URI '…?apiKey=…'" puts the key
 * in plain text, and the shared transport's redaction only covers its own
 * request fields.
 */
export function scrubWaiverFileSecret(
	value: string,
	apiKey: string,
	extra?: string[],
): string;
// unknown: the error body is whatever WaiverFile or a proxy sent.
export function scrubWaiverFileSecret(
	value: unknown,
	apiKey: string,
	extra?: string[],
): unknown;
// unknown: same as the overload above; a string comes back as a string.
export function scrubWaiverFileSecret(
	value: unknown,
	apiKey: string,
	extra: string[] = [],
): unknown {
	const secrets = [apiKey, ...extra].filter((secret) => secret.length > 0);
	const scrub = (text: string) => {
		let out = text.replace(/([?&]apiKey=)[^&'"\s]*/gi, '$1[REDACTED]');
		for (const secret of secrets) {
			out = out.split(secret).join('[REDACTED]');
			const encoded = encodeURIComponent(secret);
			if (encoded !== secret) out = out.split(encoded).join('[REDACTED]');
		}
		return out;
	};
	if (typeof value === 'string') return scrub(value);
	if (value === undefined || value === null) return value;
	try {
		return JSON.parse(scrub(JSON.stringify(value)));
	} catch {
		return undefined;
	}
}

/**
 * Fetches a binary body, which `corsair/http` cannot return: it reads every
 * response as text, and decoding a PDF as UTF-8 replaces invalid sequences, so the
 * bytes and the length both change. The one endpoint that downloads a file uses
 * this instead, and both the fetch call and the body read are normalised to this
 * plugin's error type so a transport failure still reaches the handlers.
 */
export async function makeWaiverFileDownload(
	credentials: WaiverFileCredentials,
	{ path, query }: { path: string; query?: WaiverFileQuery },
): Promise<{ bytes: Buffer; contentType: string }> {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined) params.set(key, String(value));
	}
	params.set('apiKey', credentials.apiKey);
	params.set('siteID', credentials.siteID);
	const url = `${WAIVERFILE_API_BASE}${path}?${params.toString()}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/pdf' },
			// The shared transport's 20-second deadline does not apply here, so
			// the same limit covers the request and the body read below.
			signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
		});
	} catch (error) {
		// A transport failure never reached WaiverFile, so a read is safe to replay.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WaiverFileAPIError(
				scrubWaiverFileSecret(error.message, credentials.apiKey),
				{ method: 'GET', path },
			);
		}
		throw new WaiverFileAPIError('Unknown WaiverFile error', {
			method: 'GET',
			path,
		});
	}

	if (!response.ok) {
		// The reference says PDF errors have an empty body; anything else is
		// kept, parsed when it is JSON, so isAuthError and Retry-After still work.
		const text = await response.text().catch(() => '');
		let parsed: unknown = text || undefined;
		try {
			parsed = text ? JSON.parse(text) : undefined;
		} catch {
			// Plain text stays as it is.
		}
		const body = scrubWaiverFileSecret(parsed, credentials.apiKey);
		const retryAfterHeader = response.headers.get('retry-after');
		const retryAfterSeconds = retryAfterHeader
			? Number(retryAfterHeader)
			: Number.NaN;
		throw new WaiverFileAPIError(
			describeWaiverFileError(response.status, body, `HTTP ${response.status}`),
			{
				status: response.status,
				body,
				retryAfter: Number.isFinite(retryAfterSeconds)
					? retryAfterSeconds * 1000
					: undefined,
				method: 'GET',
				path,
			},
		);
	}

	let bytes: Buffer;
	try {
		bytes = Buffer.from(await response.arrayBuffer());
	} catch (error) {
		throw new WaiverFileAPIError(
			error instanceof Error ? error.message : 'Reading the PDF failed',
			{ method: 'GET', path },
		);
	}
	return {
		bytes,
		contentType: response.headers.get('content-type') ?? 'application/pdf',
	};
}

/** Narrows a caught value to this plugin's error. */
export function isWaiverFileFailure(
	// unknown: a caught value can be anything; this guard is what narrows it.
	error: unknown,
): error is WaiverFileAPIError {
	return error instanceof WaiverFileAPIError;
}
