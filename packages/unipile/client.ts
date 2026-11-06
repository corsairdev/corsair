import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const UNIPILE_API_BASE = 'https://api.unipile.com';

// Unipile proxies most methods to the provider (LinkedIn), so a call waits on
// LinkedIn as well as Unipile. Profile and search reads can take several
// seconds; the default 20 s is too tight for slow accounts.
const UNIPILE_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries. The client makes one attempt and only reads
// Retry-After (seconds) into the error. The default corsair/http config would
// replay any 429 itself, including a LinkedIn 429 on a send.
const UNIPILE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: values are validated by each endpoint's input schema; arrays repeat
// the key and objects become key[field]=value, as the Unipile SDK sends them.
export type UnipileQuery = Record<string, unknown>;

/**
 * Unipile errors follow RFC 7807:
 * `{ object: 'Error', type, status, title, detail, req_id }`.
 * `type` is `thrower/info`: `api/…` comes from Unipile, `provider/…` was
 * forwarded from LinkedIn (or another provider).
 * https://developer.unipile.com/v2.0/reference/error-responses
 */
export class UnipileAPIError extends Error {
	readonly status?: number;
	/** RFC 7807 `type`, e.g. `api/too_many_requests` or `provider/too_many_requests`. */
	readonly type?: string;
	readonly title?: string;
	readonly detail?: string;
	readonly reqId?: string;
	/** Milliseconds from the `retry-after` header, when Unipile sent one. */
	readonly retryAfter?: number;
	// unknown: error bodies are usually the RFC 7807 shape above, but a proxy
	// in front of Unipile can answer with HTML or text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'UnipileAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const record = asRecord(this.body);
		this.type = readString(record, 'type');
		this.title = readString(record, 'title');
		this.detail = readString(record, 'detail');
		this.reqId = readString(record, 'req_id');
	}
}

// unknown: the body is untrusted until these guards run.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: see UnipileAPIError.
export function describeUnipileError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const type = readString(record, 'type');
	const title = readString(record, 'title');
	const detail = readString(record, 'detail');
	const reqId = readString(record, 'req_id');
	const head = [status !== undefined ? `Unipile ${status}` : 'Unipile', type]
		.filter(Boolean)
		.join(' ');
	const text = [title, detail].filter(Boolean).join(': ') || fallback;
	return reqId ? `${head}: ${text} (req ${reqId})` : `${head}: ${text}`;
}

/** Encodes one path segment (ids can contain `:` or `=`). */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

export type UnipileRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: UnipileQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeUnipileRequest(
	apiKey: string,
	{ method, path, query, body }: UnipileRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: UNIPILE_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: UNIPILE_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
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
			rateLimitConfig: UNIPILE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new UnipileAPIError(
				describeUnipileError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new UnipileAPIError((error as Error).message, {
				cause: error as Error,
			});
		}
		throw new UnipileAPIError('Unknown Unipile error');
	}
}

/** A downloaded file (picture or attachment). */
export type UnipileFile = {
	contentType: string;
	sizeBytes: number;
	filename?: string;
	/** Present unless the file was larger than `maxBytes`. */
	bytes?: Uint8Array;
};

function filenameFrom(disposition: string | null): string | undefined {
	if (!disposition) return undefined;
	const star = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(disposition);
	if (star?.[1]) {
		try {
			return decodeURIComponent(star[1].trim().replace(/^"|"$/g, ''));
		} catch {
			return star[1].trim();
		}
	}
	const plain = /filename="?([^";]+)"?/i.exec(disposition);
	return plain?.[1]?.trim();
}

/**
 * GETs a binary route (pictures, attachments). corsair/http reads non-JSON
 * bodies as text, which corrupts bytes, so this uses fetch directly with the
 * same key, timeout and error shape as makeUnipileRequest. The body is only
 * kept when it is at most `maxBytes`; otherwise just its size is reported.
 */
export async function makeUnipileFileRequest(
	apiKey: string,
	path: string,
	maxBytes: number,
): Promise<UnipileFile> {
	let response: Response;
	try {
		response = await fetch(`${UNIPILE_API_BASE}${path}`, {
			method: 'GET',
			headers: { Accept: '*/*', 'X-API-KEY': apiKey },
			signal: AbortSignal.timeout(UNIPILE_TIMEOUT_MS),
		});
	} catch (error) {
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		const cause = error as Error;
		throw new UnipileAPIError(cause?.message ?? 'Unknown Unipile error', {
			cause,
		});
	}

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		// unknown: an RFC 7807 body, or text from a proxy.
		let body: unknown = text;
		try {
			body = JSON.parse(text);
		} catch {
			// keep the text
		}
		const retryAfterSeconds = Number.parseInt(
			response.headers.get('retry-after') ?? '',
			10,
		);
		throw new UnipileAPIError(
			describeUnipileError(response.status, body, response.statusText),
			{
				status: response.status,
				body,
				retryAfter: Number.isNaN(retryAfterSeconds)
					? undefined
					: retryAfterSeconds * 1000,
			},
		);
	}

	const contentType =
		response.headers.get('content-type') ?? 'application/octet-stream';
	const filename = filenameFrom(response.headers.get('content-disposition'));
	const declared = Number.parseInt(
		response.headers.get('content-length') ?? '',
		10,
	);
	if (!Number.isNaN(declared) && declared > maxBytes) {
		await response.body?.cancel().catch(() => undefined);
		return { contentType, sizeBytes: declared, filename };
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	return {
		contentType,
		sizeBytes: bytes.byteLength,
		filename,
		bytes: bytes.byteLength <= maxBytes ? bytes : undefined,
	};
}
