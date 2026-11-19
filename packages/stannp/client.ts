import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// Stannp hosts one API per region; an account lives on exactly one of them.
// https://www.stannp.com/stannp-api-llm.md ("Base URL" section)
export const STANNP_HOSTS = {
	eu: 'https://api-eu1.stannp.com',
	us: 'https://api-us1.stannp.com',
} as const;

export type StannpRegion = keyof typeof STANNP_HOSTS;

const DEFAULT_REGION: StannpRegion = 'us';

// Mailpiece creation runs a mail merge and renders a PDF, and campaign
// sample production renders a whole campaign, so the 20 second default is
// tight.
const STANNP_TIMEOUT_MS = 60_000;

/**
 * The documented limit is 300 requests per minute for most endpoints. The
 * window state arrives on every response as X-RateLimit-Reset, in seconds
 * until the window resets, so it doubles as the no-retry-after delay.
 * Retries themselves belong to error-handlers.ts, hence maxRetries: 0.
 */
const STANNP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'x-ratelimit-reset' },
};

/**
 * Stannp wraps every v1 answer in `{ success, data }` on success and
 * `{ success: false, error }` on failure (a 200 body can still say error).
 * The only documented exception under the same host is `/v2/balance`, a
 * separate Laravel-style API with a different envelope; this plugin stays on
 * the v1 surface and does not call it.
 */
export class StannpAPIError extends Error {
	readonly status?: number;
	/** The unmodified response body, when there was one. */
	// unknown: error bodies can be the v1 envelope, an idempotent replay's
	// original success envelope, or non-JSON from a proxy.
	readonly body?: unknown;
	/** Milliseconds to wait before retrying, from X-RateLimit-Reset. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'StannpAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}
}

export function describeStannpError(
	status: number | undefined,
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const error = record?.error;
	const text = typeof error === 'string' && error.length > 0 ? error : fallback;
	return status === undefined ? text : `Stannp ${status}: ${text}`;
}

export type StannpQuery = Record<string, string | number | boolean | undefined>;

/** One form field value; arrays repeat as indexed PHP-style keys. */
export type StannpFormValue = string | number | boolean | undefined;

export type StannpRequest = {
	method: 'GET' | 'POST';
	/** Full URL of the host for this account's region. */
	base: string;
	path: string;
	query?: StannpQuery;
	/**
	 * Fields sent as an application/x-www-form-urlencoded body, the format
	 * every documented curl example uses. Undefined sends no body.
	 */
	form?: Record<string, StannpFormValue | StannpFormValue[]>;
	/** Optional X-Idempotency-Key, documented for safely retrying writes. */
	idempotencyKey?: string;
};

/**
 * Encodes PHP-style bracket keys: `recipient[firstname]` for the nested
 * recipient object and indexed `files[0]`, `files[1]` for arrays, matching
 * the documented curl examples (a repeated bare `files` key would collapse
 * to its last value on the PHP side). `true`/`false` are sent as the literal
 * strings the docs' own examples use (`test=true`).
 */
export function encodeStannpForm(
	form: StannpRequest['form'],
): string | undefined {
	if (!form) return undefined;
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(form)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				if (item === undefined) return;
				params.set(`${key}[${index}]`, String(item));
			});
			continue;
		}
		params.set(key, String(value));
	}
	return params.toString();
}

/** True when the body is Stannp's v1 failure envelope. */
export function isFailureEnvelope(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
): boolean {
	const record = asRecord(body);
	return record?.success === false;
}

// unknown: callers parse the unwrapped body with the endpoint's zod output
// schema, so the client cannot name a stricter return type.
/**
 * Authenticated Stannp request. Authenticates with HTTP Basic, the API key
 * as the username and an empty password, per the docs' `-u {API_KEY}:`
 * examples. Returns the unwrapped `data` value; non-2xx and a 2xx failure
 * envelope both throw StannpAPIError.
 */
export async function makeStannpRequest(
	apiKey: string,
	{
		method,
		base = STANNP_HOSTS[DEFAULT_REGION],
		path,
		query,
		form,
		idempotencyKey,
	}: StannpRequest,
): Promise<unknown> {
	const auth = Buffer.from(`${apiKey}:`).toString('base64');
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: STANNP_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${auth}`,
		},
	};

	const body = encodeStannpForm(form);
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType:
			body === undefined ? undefined : 'application/x-www-form-urlencoded',
		...(idempotencyKey
			? { headers: { 'X-Idempotency-Key': idempotencyKey } }
			: {}),
	};

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: STANNP_RATE_LIMIT_CONFIG,
		});
		// A 2xx body that still says error is a failure; unwrap success.
		if (isFailureEnvelope(raw)) {
			const record = asRecord(raw);
			const message =
				typeof record?.error === 'string' && record.error.length > 0
					? record.error
					: 'Stannp request failed';
			throw new StannpAPIError(describeStannpError(undefined, raw, message), {
				body: raw,
				method,
			});
		}
		// unknown: the endpoint's output schema validates whatever `data` holds;
		// some documented responses (204, empty 200) have no envelope at all.
		const envelope = asRecord(raw);
		return envelope && 'data' in envelope ? envelope.data : raw;
	} catch (error) {
		// Rethrow our own error untouched; the branch below would re-wrap it
		// and drop its body.
		if (error instanceof StannpAPIError) throw error;
		if (error instanceof ApiError) {
			// A duplicate idempotent request replays the ORIGINAL success
			// envelope with a 409, so keep the body reachable for the caller.
			throw new StannpAPIError(
				describeStannpError(error.status, error.body, error.message),
				{ cause: error, status: error.status, body: error.body, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new StannpAPIError(error.message, { cause: error, method });
		}
		throw new StannpAPIError('Unknown Stannp error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
