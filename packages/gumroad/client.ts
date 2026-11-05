import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GUMROAD_API_BASE = 'https://api.gumroad.com/v2';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const GUMROAD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type GumroadMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type GumroadQuery = Record<string, string | undefined>;
// The docs' attach flows repeat bracket keys in document order
// (`files[][id]=A&files[][url]=B&files[][id]=C...`), which a record cannot
// express, so a form body is an ordered entry list.
export type GumroadFormEntry = readonly [key: string, value: string | number];
export type GumroadForm = GumroadFormEntry[];
// The two JSON-body endpoints (user custom HTML) send a string or null.
export type GumroadJsonBody = Record<string, string | null>;

// Drops undefined values so unset fields never reach the wire.
export function formEntries(
	record: Record<string, string | number | undefined>,
): GumroadForm {
	return Object.entries(record).filter(
		(entry): entry is [string, string | number] => entry[1] !== undefined,
	);
}

/**
 * Gumroad documents JSON error bodies of `{ success: false, message }`, but
 * 401s arrive with an empty body (live-verified), so the raw body stays
 * untyped until a handler narrows it.
 */
export class GumroadAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;
	readonly method?: string;
	// unknown: error bodies are the JSON above, empty, or proxy text.
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
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GumroadAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method;
	}
}

// unknown: the body is untrusted until this guard runs.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// unknown: raw provider JSON; the message field is narrowed one key at a time.
export function describeGumroadError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message = asRecord(body)?.message;
	const text =
		typeof message === 'string' && message.length > 0 ? message : fallback;
	return status !== undefined ? `Gumroad ${status}: ${text}` : text;
}

/**
 * A 2xx response whose envelope says `success: false` is a failed call that
 * did not get an error status. Returns the error to throw, or undefined.
 */
// unknown: raw provider JSON before the endpoint's output schema parses it.
export function errorFromEnvelope(body: unknown): GumroadAPIError | undefined {
	const record = asRecord(body);
	if (record?.success !== false) return undefined;
	return new GumroadAPIError(
		describeGumroadError(undefined, record, 'Gumroad request failed'),
		{ body: record },
	);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGumroadRequest(
	path: string,
	apiKey: string,
	options: {
		method?: GumroadMethod;
		query?: GumroadQuery;
		form?: GumroadForm;
		json?: GumroadJsonBody;
		baseUrl?: string;
	} = {},
): Promise<unknown> {
	const { method = 'GET', query, form, json, baseUrl } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? GUMROAD_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 20_000,
		TOKEN: apiKey,
	};

	// The docs' cURL sends form-encoded bodies for POSTs and PUTs (the `-d`
	// params); entries are pre-encoded here so the shared client sends the
	// string verbatim, in order.
	const bodyParts: string[] = [];
	for (const [key, value] of form ?? []) {
		bodyParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
	}
	const hasForm = bodyParts.length > 0;
	// The shared client JSON-encodes a non-string body itself when the media
	// type is JSON, so the object is passed through, not pre-stringified.
	const body: unknown = hasForm
		? bodyParts.join('&')
		: json !== undefined
			? json
			: undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body,
		mediaType: hasForm
			? 'application/x-www-form-urlencoded'
			: json !== undefined
				? 'application/json'
				: undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GUMROAD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new GumroadAPIError(
				describeGumroadError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new GumroadAPIError((error as Error).message, {
				cause: error as Error,
				method,
			});
		}
		throw new GumroadAPIError('Unknown Gumroad API error', { method });
	}
}

// A downloaded file, base64-encoded so it survives the JSON plugin boundary.
export type GumroadDownload = {
	filename?: string;
	contentType: string;
	contentBase64: string;
};

function filenameFrom(res: Response): string | undefined {
	const raw = res.headers.get('content-disposition');
	// RFC 5987 filename* is percent-encoded; a plain filename= value is not,
	// so URI-decoding is applied to the extended form only.
	const extended = raw?.match(/filename\*=(?:UTF-8'')?([^";]+)/i);
	if (extended?.[1]) {
		try {
			return decodeURIComponent(extended[1]);
		} catch {
			return extended[1];
		}
	}
	const plain = raw?.match(/filename="?([^";]+)/i);
	return plain?.[1] ? plain[1].replace(/"/g, '') : undefined;
}

// Retry-After as ms; the docs never document it, so both the delay-seconds
// and HTTP-date forms are honored (browserless precedent).
function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('retry-after');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

/**
 * Raw fetch for the one documented binary response (tax form PDFs: "Response
 * is the raw PDF on success ... a JSON error envelope on failure"). The shared
 * client only parses JSON, so this path keeps its own error mapping; retries
 * stay owned by error-handlers.ts.
 */
export async function downloadGumroadFile(
	path: string,
	apiKey: string,
): Promise<GumroadDownload> {
	let res: Response;
	try {
		res = await fetch(`${GUMROAD_API_BASE}${path}`, {
			method: 'GET',
			headers: { authorization: `Bearer ${apiKey}` },
			signal: AbortSignal.timeout(20_000),
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new GumroadAPIError(error.message, { cause: error, method: 'GET' });
		}
		throw new GumroadAPIError('Unknown Gumroad download error', {
			method: 'GET',
		});
	}

	if (res.status === 429) {
		const retryAfter = retryAfterMs(res);
		await res.body?.cancel();
		throw new GumroadAPIError('Gumroad 429: Too many requests', {
			status: 429,
			retryAfter,
			method: 'GET',
		});
	}

	if (!res.ok) {
		// A body-read failure (connection dropped mid-response) must still
		// carry the status so SERVER_ERROR can classify it.
		let text: string;
		try {
			text = await res.text();
		} catch (error) {
			throw new GumroadAPIError(`Gumroad ${res.status}`, {
				status: res.status,
				method: 'GET',
				cause: error instanceof Error ? error : undefined,
			});
		}
		let message = `Gumroad ${res.status}`;
		try {
			// unknown: the failure body is arbitrary text that may be JSON;
			// only the message field is read, narrowed right below.
			const parsed = JSON.parse(text) as { message?: unknown };
			if (typeof parsed.message === 'string' && parsed.message.length > 0) {
				message = `Gumroad ${res.status}: ${parsed.message}`;
			}
		} catch {
			// Not JSON; keep the status-only message.
		}
		throw new GumroadAPIError(message, {
			status: res.status,
			body: text.length > 0 ? text : undefined,
			method: 'GET',
		});
	}

	const buffer = await res.arrayBuffer();
	return {
		filename: filenameFrom(res),
		contentType: res.headers.get('content-type') ?? 'application/octet-stream',
		contentBase64: Buffer.from(buffer).toString('base64'),
	};
}
