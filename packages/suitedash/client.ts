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
 * `{ success: false, message, data: [] }`. An HTTP error arrives as core's
 * ApiError (see `stripRequestData`); this class is only for a 2xx whose
 * envelope still says `success: false`, where core raised nothing.
 */
export class SuitedashAPIError extends Error {
	/** The provider's own message from the envelope. */
	readonly reason?: string;
	/** Field name to messages, from a 422. */
	readonly fieldErrors?: string[];
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: the envelope that said `success: false`.
	readonly body?: UnknownJson;

	constructor(
		message: string,
		options: { body?: UnknownJson; method?: string },
	) {
		super(message);
		this.name = 'SuitedashAPIError';
		this.body = options.body;
		this.method = options.method;
		const record = asRecord(this.body);
		this.reason = readString(record, 'message');
		this.fieldErrors = readStrings(record?.errors);
	}
}

const EMAIL = /[^\s"'<>@/]+@[^\s"'<>@/]+\.[^\s"'<>@/]+/g;

// unknown: any JSON value; strings get email addresses masked.
function maskEmails(value: UnknownJson): UnknownJson {
	if (typeof value === 'string') return value.replace(EMAIL, '[email]');
	if (Array.isArray(value)) return value.map(maskEmails);
	const record = asRecord(value);
	if (!record) return value;
	return Object.fromEntries(
		Object.entries(record).map(([key, entry]) => [key, maskEmails(entry)]),
	);
}

function maskPath(url: string): string {
	return (url.split('?')[0] ?? url)
		.split('/')
		.map((part) => {
			try {
				return decodeURIComponent(part).includes('@') ? '[email]' : part;
			} catch {
				return part;
			}
		})
		.join('/');
}

/**
 * Core's ApiError keeps the request's URL and query, and a contact is
 * addressed by email in the path (`/contact/jane@acme.com`). This rebuilds the
 * error without the query and with email addresses masked in the URL, the
 * message and the body, and keeps what core and the handlers read: status,
 * body, Retry-After and the method. It is still core's ApiError.
 */
export function stripRequestData(error: ApiError): ApiError {
	return new ApiError(
		{ method: error.request.method, url: maskPath(error.request.url) },
		{
			url: maskPath(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: maskEmails(error.body),
		},
		String(
			maskEmails(
				describeSuitedashError(error.status, error.body, error.message),
			),
		),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
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
		if (failure) {
			throw new SuitedashAPIError(String(maskEmails(failure)), {
				body: maskEmails(raw),
				method,
			});
		}
		return raw;
	} catch (error) {
		if (error instanceof ApiError) throw stripRequestData(error);
		throw error;
	}
}
