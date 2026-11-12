import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const VIRUSTOTAL_API_BASE = 'https://www.virustotal.com/api/v3';

/**
 * Every call sends the key in `x-apikey`, not a bearer token. Without the
 * header the API answers `AuthenticationRequiredError`; with a wrong one,
 * `WrongCredentialsError`. Both are 401.
 */
export const VIRUSTOTAL_API_KEY_HEADER = 'x-apikey';

/** A minute, daily and monthly quota all answer 429 but mean different things. */
const QUOTA_EXCEEDED = 'QuotaExceededError';
const TOO_MANY_REQUESTS = 'TooManyRequestsError';

/**
 * A quota has run out, so retrying only burns another request. The rate limit
 * is a burst, so a retry can work — and is the only 429 worth retrying. The
 * error-handlers file reads `isQuotaExceeded` to tell them apart.
 */
const VIRUSTOTAL_RATE_LIMIT_CONFIG: RateLimitConfig = {
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
 * VirusTotal answers a failure as `{ error: { code, message } }`, where `code`
 * is a name such as `NotFoundError` or `QuotaExceededError`.
 *
 * The two 429s are the subtle part: `QuotaExceededError` means a minute, daily
 * or monthly allowance is spent, while `TooManyRequestsError` is a burst that
 * clears. Only the second is worth retrying.
 */
export class VirustotalAPIError extends Error {
	readonly status?: number;
	/** The named code, e.g. `NotFoundError`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when VirusTotal sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shape above, but a proxy can answer
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
		this.name = 'VirustotalAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		this.code = readString(asRecord(asRecord(this.body)?.error), 'code');
	}

	/** True for a missing, wrong, inactive or unverified key. */
	get isAuthError(): boolean {
		if (this.status === 401) return true;
		return (
			this.code === 'AuthenticationRequiredError' ||
			this.code === 'WrongCredentialsError' ||
			this.code === 'UserNotActiveError'
		);
	}

	/** True when a quota is spent, so a retry cannot help. */
	get isQuotaExceeded(): boolean {
		return this.code === QUOTA_EXCEEDED;
	}

	/**
	 * True for a burst that will clear, so a retry can help. The code has to say so:
	 * a 429 from a proxy or a gateway carries no VirusTotal code, and retrying a POST
	 * or DELETE on that guess could repeat a write.
	 */
	get isRateLimited(): boolean {
		return this.status === 429 && this.code === TOO_MANY_REQUESTS;
	}

	/**
	 * True when the resource exists but has not been processed yet. VirusTotal
	 * documents this as a 400 rather than a 404, which is why it gets its own
	 * check.
	 */
	get isNotAvailableYet(): boolean {
		return this.code === 'NotAvailableYet';
	}

	/** True when the resource is unknown to VirusTotal. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === 'NotFoundError';
	}
}

// unknown: see VirustotalAPIError.
export function describeVirustotalError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const error = asRecord(asRecord(body)?.error);
	const text = readString(error, 'message') ?? fallback;
	const code = readString(error, 'code');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `VirusTotal ${label}: ${text}` : text;
}

export type VirustotalQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type VirustotalRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: VirustotalQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Overrides the JSON media type, for the form-encoded URL scan. */
	mediaType?: string;
};

/** Encodes one path segment; ids and domains come from the caller. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * The identifier VirusTotal uses for a URL: the URL encoded as unpadded
 * base64url (RFC 4648 §3.2). The docs note that a SHA-256 of the canonicalized
 * URL also works, but base64 needs no canonicalization because VirusTotal does
 * it server-side.
 */
export function urlId(url: string): string {
	const bytes = new TextEncoder().encode(url);
	// btoa works on a latin-1 string, so go through bytes rather than encodeURI.
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeVirustotalRequest(
	apiKey: string,
	{ method, path, query, body, mediaType }: VirustotalRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: VIRUSTOTAL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			[VIRUSTOTAL_API_KEY_HEADER]: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType:
			body === undefined ? undefined : (mediaType ?? 'application/json'),
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: VIRUSTOTAL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new VirustotalAPIError(
				describeVirustotalError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new VirustotalAPIError(error.message, { cause: error, method });
		}
		throw new VirustotalAPIError('Unknown VirusTotal error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isVirustotalFailure(
	error: unknown,
): error is VirustotalAPIError {
	return error instanceof VirustotalAPIError;
}
