import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * NASA serves these APIs from five hosts. Only api.nasa.gov (and the APOD feed
 * on science.nasa.gov) accepts an API key; EONET, EPIC and the Image Library
 * answer without one.
 */
export const NASA_HOSTS = {
	api: 'https://api.nasa.gov',
	apod: 'https://science.nasa.gov',
	eonet: 'https://eonet.gsfc.nasa.gov',
	epic: 'https://epic.gsfc.nasa.gov',
	images: 'https://images-api.nasa.gov',
} as const;

export type NasaHost = keyof typeof NASA_HOSTS;

/** Hosts that read the `api_key` query parameter. */
const KEYED_HOSTS: ReadonlySet<NasaHost> = new Set<NasaHost>(['api', 'apod']);

// Retries belong to error-handlers.ts so a rate-limited read backs off once,
// in one place. The header names stay because NASA sends no Retry-After.
const NASA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** api.nasa.gov error code, e.g. `OVER_RATE_LIMIT`. */
const OVER_RATE_LIMIT = 'OVER_RATE_LIMIT';

// unknown: every host answers with its own error shape, so the body is read
// field by field until one of the known envelopes matches.
function readString(
	// unknown: one field of an untyped error body; see the note above.
	record: Record<string, unknown> | null | undefined, // unknown: open error body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Reads api.nasa.gov's `{ error: { code, message } }` code. */
// unknown: untyped error payload; absent fields read as undefined.
function readApiErrorCode(
	body: unknown /* unknown: untyped error payload */,
): string | undefined {
	const record = asRecord(body);
	return readString(asRecord(record?.error), 'code');
}

/** Reads the WordPress REST API's `{ code, message }` code. */
// unknown: same open error payload as readApiErrorCode.
function readWordPressCode(
	body: unknown /* unknown: same open payload as readApiErrorCode */,
): string | undefined {
	return readString(asRecord(body), 'code');
}

/**
 * NASA's five error shapes:
 *
 * - api.nasa.gov: `{ error: { code, message } }`, 403 for a bad key and 429 for
 *   the hourly limit (the code says which, the status alone does not).
 * - science.nasa.gov (WordPress): `{ code, message, data: { status } }`.
 * - images-api.nasa.gov: `{ reason }`.
 * - eonet.gsfc.nasa.gov: an HTML 500 page, or an empty body.
 * - epic.gsfc.nasa.gov: an HTML 500 page for a malformed date, `[]` for a date
 *   with no imagery.
 */
export class NasaAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	/** The URL that failed, without the API key. */
	readonly url?: string;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			url?: string;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NasaAPIError';
		this.status = options.status;
		this.code = options.code;
		this.url = options.url;
		this.method = options.method;
	}

	/** True when NASA answered the hourly limit rather than a bad key. */
	get isRateLimit(): boolean {
		return this.status === 429 || this.code === OVER_RATE_LIMIT;
	}

	/** True when NASA rejected the key, whether by status or by code. */
	get isAuthError(): boolean {
		// api.nasa.gov answers 403 for both a missing and an invalid key, with
		// the reason in `error.code`. A 401 comes from a gateway in front of it.
		return (
			this.status === 401 ||
			this.status === 403 ||
			this.code === 'API_KEY_MISSING' ||
			this.code === 'API_KEY_INVALID'
		);
	}
}

// unknown: see NasaAPIError above; every field is read defensively.
export function describeNasaError(
	status: number | undefined,
	body: unknown, // unknown: an error body from any of the five hosts
	fallback: string,
	url?: string,
): string {
	const record = asRecord(body);
	const apiError = asRecord(record?.error);
	const text =
		readString(apiError, 'message') ??
		readString(record, 'message') ??
		readString(record, 'reason') ??
		fallback;
	const code = readApiErrorCode(body) ?? readWordPressCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const where = url ? ` (${url})` : '';
	return label ? `NASA ${label}: ${text}${where}` : `${text}${where}`;
}

/**
 * Removes the API key from a URL before it lands in an error message. NASA
 * takes the key as a query parameter, and ApiError only redacts a fixed list of
 * names, so the whole URL is rebuilt here instead.
 */
export function stripKey(url: string): string {
	try {
		const parsed = new URL(url);
		if (parsed.searchParams.has('api_key')) {
			parsed.searchParams.set('api_key', 'REDACTED');
		}
		return parsed.toString();
	} catch {
		return url;
	}
}

export type NasaQuery = Record<string, string | number | boolean | undefined>;

export type NasaRequest = {
	method: 'GET';
	host: NasaHost;
	path: string;
	query?: NasaQuery;
};

// unknown: callers parse the body with the endpoint's zod output schema; the
// transport returns whatever the host sent.
export async function makeNasaRequest(
	apiKey: string,
	{ method, host, path, query }: NasaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NASA_HOSTS[host],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: KEYED_HOSTS.has(host) ? { ...query, api_key: apiKey } : query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			// unknown: see above
			rateLimitConfig: NASA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// ApiError redacts api_key already; stripKey is a second guard for
			// hosts that echo a differently named key parameter.
			const url = stripKey(error.url ?? '');
			throw new NasaAPIError(
				describeNasaError(error.status, error.body, error.message, url),
				{
					status: error.status,
					code: readApiErrorCode(error.body) ?? readWordPressCode(error.body),
					url,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NasaAPIError(error.message, { cause: error, method });
		}
		throw new NasaAPIError('Unknown NASA error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
