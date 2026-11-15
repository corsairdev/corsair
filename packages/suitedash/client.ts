import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { UnknownJson } from './json';

export const SUITEDASH_API_BASE = 'https://app.suitedash.com/secure-api';

/**
 * Call limits are plan-based and counted per month, not per second: 80 on trial,
 * 400 on Start, 2000 on Thrive, 20000 on Pinnacle. A 429 is a monthly quota, so
 * retrying it burns budget without ever succeeding; the handler does not retry.
 */
const SUITEDASH_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * SuiteDash needs **two** credentials on every call: a public id and a secret
 * key, each in its own header. It reports every failure inside the envelope
 * `{ success: false, message, data: [] }`, so a 200 is not proof of success.
 *
 * A 401 names the missing header, which is the most useful part of the message.
 */
export class SuitedashAPIError extends Error {
	readonly status?: number;
	/** The provider's own message from the envelope. */
	readonly reason?: string;
	/** Field name to messages, from a 422. */
	readonly fieldErrors?: string[];
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: an error body is an envelope, but a proxy can answer HTML.
	readonly body?: UnknownJson;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: UnknownJson;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SuitedashAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const record = asRecord(this.body);
		this.reason = readString(record, 'message');
		this.fieldErrors = readStrings(record?.errors);
	}

	/** True when a credential is missing or invalid. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/**
	 * The plan's monthly call allowance is exhausted. No retry fixes it, so this
	 * is separate from a throughput limit.
	 */
	get isQuotaExhausted(): boolean {
		return this.status === 429;
	}
}

// unknown: the record is an untyped envelope; read one field at a time.
function readString(record: JsonObjectLike, key: string): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

type JsonObjectLike = Record<string, UnknownJson> | null | undefined;

// unknown: `errors` is documented as a string array, but a proxy could reshape it.
function readStrings(value: UnknownJson): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const strings = value.filter(
		(entry): entry is string => typeof entry === 'string',
	);
	return strings.length > 0 ? strings : undefined;
}

/**
 * A 2xx carrying `success: false` is a real failure here, and SuiteDash does
 * that for business errors as well as auth. This reads the flag so the client
 * can refuse to hand back a failed body as data.
 */
// unknown: the body is an envelope, checked field by field here.
export function failureFromEnvelope(body: UnknownJson): string | null {
	const record = asRecord(body);
	if (!record || record.success !== false) return null;
	const message = readString(record, 'message');
	const errors = readStrings(record.errors);
	return (
		message ?? (errors ? errors.join('; ') : 'SuiteDash reported a failure')
	);
}

// unknown: see SuitedashAPIError.
export function describeSuitedashError(
	status: number | undefined,
	body: UnknownJson,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		failureFromEnvelope(body) ?? readString(record, 'message') ?? fallback;
	return status === undefined ? text : `SuiteDash ${status}: ${text}`;
}

export type SuitedashQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SuitedashRequest = {
	method: 'GET' | 'POST' | 'PUT';
	path: string;
	query?: SuitedashQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: UnknownJson; // unknown: the endpoint's input schema validated it
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema, and the
// shape differs per route, which is what that schema is for.
export async function makeSuitedashRequest(
	credentials: { publicId: string; secretKey: string },
	{ method, path, query, body }: SuitedashRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SUITEDASH_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// Two literal headers: SuiteDash has no single-token form.
			'X-Public-ID': credentials.publicId,
			'X-Secret-Key': credentials.secretKey,
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		const raw = await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SUITEDASH_RATE_LIMIT_CONFIG,
		});
		// A 2xx can still say `success: false`, so the flag decides, not the status.
		const failure = failureFromEnvelope(raw);
		if (failure) throw new SuitedashAPIError(failure, { body: raw, method });
		return raw;
	} catch (error) {
		// Rethrow this client's own error untouched: the generic `instanceof
		// Error` branch below would otherwise re-wrap it and drop the body.
		if (error instanceof SuitedashAPIError) throw error;
		if (error instanceof ApiError) {
			// The cause is deliberately not attached: it carries the request,
			// including both credential headers, so `util.inspect(error)` would
			// print them.
			throw new SuitedashAPIError(
				describeSuitedashError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method,
				},
			);
		}
		// A transport failure never held a body or headers, so its cause is safe to
		// keep. DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SuitedashAPIError(error.message, { cause: error, method });
		}
		throw new SuitedashAPIError('Unknown SuiteDash error', { method });
	}
}
