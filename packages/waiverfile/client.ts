import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const WAIVERFILE_API_BASE = 'https://api.waiverfile.com';

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
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'WaiverFileAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}

	/**
	 * True when the key or site was rejected. WaiverFile reports this as a 400
	 * whose message starts `Invalid`, so the status alone cannot decide it —
	 * a genuine validation failure is also a 400.
	 */
	get isAuthError(): boolean {
		if (this.status === 401 || this.status === 403) return true;
		const message = readString(asRecord(this.body), 'Message') ?? '';
		return (
			this.status === 400 &&
			(message.startsWith('Invalid apiKey') ||
				message.startsWith('Invalid siteID') ||
				message.startsWith('InvalidService') ||
				message.startsWith('Invalid key') ||
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
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeWaiverFileRequest(
	credentials: WaiverFileCredentials,
	{ method, path, query, body, mediaType }: WaiverFileRequest,
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WAIVERFILE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new WaiverFileAPIError(
				describeWaiverFileError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WaiverFileAPIError(error.message, { cause: error, method });
		}
		throw new WaiverFileAPIError('Unknown WaiverFile error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isWaiverFileFailure(
	error: unknown,
): error is WaiverFileAPIError {
	return error instanceof WaiverFileAPIError;
}
