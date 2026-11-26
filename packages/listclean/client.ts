import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LISTCLEAN_API_BASE = 'https://api.listclean.xyz/v1';

// A single verification runs SMTP checks against the recipient's mail
// exchanger, which can take tens of seconds on a slow domain.
const LISTCLEAN_TIMEOUT_MS = 60_000;

const HIDDEN = '[REDACTED]';

/**
 * Every Listclean answer is `{ success, error_code, message, data }` with an
 * integer `success`: `1` on success, `0` on failure, including over a 2xx
 * status. Two documented quirks:
 *
 * - An unknown route answers 404 with an HTML CodeIgniter page, not the
 *   envelope, so a non-object body must fail loudly rather than parse as an
 *   empty result.
 * - `GET /account/profile/` answers its 401 without `error_code` and with
 *   `data: []`, so neither field is required to read the failure.
 */
// unknown: the body is an untyped error body until asRecord narrows it; only
// the three envelope fields are read, so no stricter type fits.
export function readEnvelope(body: unknown): {
	success?: number;
	message?: string;
	errorCode?: number;
} {
	const record = asRecord(body);
	const success = record?.success;
	const message = record?.message;
	const errorCode = record?.error_code;
	return {
		success: typeof success === 'number' ? success : undefined,
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		errorCode: typeof errorCode === 'number' ? errorCode : undefined,
	};
}

/** Replaces anything shaped like an email address, so a message never carries one. */
export function withoutAddresses(text: string): string {
	return text.replace(/[^\s@"'<>()]+@[^\s@"'<>()]+/g, '[email]');
}

/** The message Listclean sent, with the status and its error code in front. */
// unknown: the body is the envelope above, or text from a proxy that never
// reached Listclean.
export function describeListcleanError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const envelope = readEnvelope(body);
	const text = withoutAddresses(envelope.message ?? fallback);
	const label = [status, envelope.errorCode]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Listclean ${label}: ${text}` : `Listclean: ${text}`;
}

export type ListcleanQueryValue = string | number | boolean;

export type ListcleanRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: Record<string, ListcleanQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * True when sending the request twice is harmless. A 5xx or a lost answer
	 * is retried only then: `verify.verifyEmail` spends a credit even when the
	 * answer is lost, a batch submit or upload creates a second billed job, and
	 * delete is irreversible.
	 */
	replayable: boolean;
	/**
	 * How the success body is read. `envelope` (the default) checks the JSON
	 * envelope; `json` is the JSON result download, which answers a bare JSON
	 * stream as octet-stream text; `text` is the CSV download.
	 */
	response?: 'envelope' | 'json' | 'text';
};

/** What the error handlers need to know about the request behind an error. */
export type ListcleanRequestFacts = {
	method: ListcleanRequest['method'];
	replayable: boolean;
	/** True when the request got no HTTP answer (reset, DNS, abort, timeout). */
	transport: boolean;
};

// Facts ride beside the error instead of on a wrapper class, so core's
// ApiError (status, retryAfter) reaches the handlers unchanged.
const requestFacts = new WeakMap<object, ListcleanRequestFacts>();

// unknown: handlers receive any thrown value.
export function requestFactsOf(
	error: unknown,
): ListcleanRequestFacts | undefined {
	return typeof error === 'object' && error !== null
		? requestFacts.get(error)
		: undefined;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, ListcleanQueryValue | undefined>,
): Record<string, ListcleanQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, ListcleanQueryValue] => entry[1] !== undefined,
		),
	);
}

/** The single-verify path carries the address itself; it is masked in errors. */
function safePath(path: string): string {
	return path.replace(
		/^\/verify\/email\/(?!batch$)[^/?#]+/,
		`/verify/email/${HIDDEN}`,
	);
}

/**
 * Core's ApiError keeps the request (body, query, URL) and the provider's
 * body. Here those carry email addresses (the verified address in the path,
 * a batch's list, an uploaded CSV chunk, the `email` log filter) and the
 * profile's name, phone and address. The error is rebuilt with the request
 * body dropped, the address masked in the URL and query, and only the three
 * envelope fields of the provider's body kept. Status, statusText and the
 * rate-limit fields are copied, so handlers and core read them as before.
 */
function rebuild(
	options: ApiRequestOptions,
	result: { status: number; statusText: string; body: unknown },
	message: string,
	rateLimit: Pick<
		ApiError,
		'retryAfter' | 'rateLimitReset' | 'rateLimitRemaining' | 'rateLimitLimit'
	> = {},
): ApiError {
	const query = options.query?.email
		? { ...options.query, email: HIDDEN }
		: options.query;
	const envelope = asRecord(result.body);
	const body = envelope
		? {
				success: envelope.success,
				error_code: envelope.error_code,
				message:
					typeof envelope.message === 'string'
						? withoutAddresses(envelope.message)
						: envelope.message,
			}
		: undefined;
	const url = `${LISTCLEAN_API_BASE}${safePath(options.url)}`;
	return new ApiError(
		{ ...options, url: safePath(options.url), query, body: undefined },
		{
			url,
			ok: false,
			status: result.status,
			statusText: result.statusText,
			body,
		},
		message,
		{
			retryAfter: rateLimit.retryAfter,
			rateLimitReset: rateLimit.rateLimitReset,
			rateLimitRemaining: rateLimit.rateLimitRemaining,
			rateLimitLimit: rateLimit.rateLimitLimit,
		},
	);
}

/**
 * A 2xx answer that is not a success. request() hands back only the body,
 * so the status is the 200 every observed envelope failure used.
 */
function okStatusFailure(
	options: ApiRequestOptions,
	// unknown: the body that failed the check, kept for its envelope fields.
	body: unknown,
	message: string,
): ApiError {
	return rebuild(options, { status: 200, statusText: 'OK', body }, message);
}

/**
 * The result download. The spec describes a bare JSON stream sent as text;
 * the live API (2026-11-26) answers application/json with the envelope
 * wrapping a second envelope (`data.success`, `data.data.result`). Both
 * envelopes are checked, so a failure in either throws instead of reading as
 * an empty result list. An HTML page (a wrong route or id) fails too.
 */
// unknown: the body arrives as text or parsed JSON depending on the
// content-type, so the download row's shape is the caller's output schema.
function parseJsonDownload(options: ApiRequestOptions, raw: unknown): unknown {
	let parsed = raw;
	if (typeof raw === 'string') {
		try {
			parsed = JSON.parse(raw) as unknown;
		} catch {
			throw okStatusFailure(
				options,
				undefined,
				'Listclean: the result download answered a body that is not JSON; an HTML page means the route or list id does not exist',
			);
		}
	}
	const outer = asRecord(parsed);
	if (!outer || !('success' in outer)) return parsed;
	validateEnvelope(options, outer);
	const inner = asRecord(outer.data);
	if (inner && 'success' in inner) validateEnvelope(options, inner);
	return parsed;
}

/**
 * The rows of a result download: the bare array the spec describes, or
 * `data.data.result` inside the double envelope the live API sends.
 */
// unknown: the output schema parses the rows.
export function downloadRows(raw: unknown): unknown {
	if (Array.isArray(raw)) return raw;
	const inner = asRecord(asRecord(raw)?.data);
	const payload = asRecord(inner?.data);
	return payload?.result ?? inner?.result;
}

/**
 * The CSV download answers text. A JSON envelope there is a failure
 * (Listclean answers `success: 0` for an unknown list), and an HTML page
 * means the route is wrong.
 */
// unknown: the body arrives as text, or parsed JSON when Listclean answers
// the envelope instead of the file.
function readCsvDownload(options: ApiRequestOptions, raw: unknown): string {
	if (asRecord(raw)) validateEnvelope(options, raw);
	if (typeof raw !== 'string' || /^\s*</.test(raw)) {
		throw okStatusFailure(
			options,
			undefined,
			'Listclean: the CSV download answered a body that is not CSV; an HTML page means the route or list id does not exist',
		);
	}
	return raw;
}

/**
 * Validates the envelope of a successful answer and returns the whole
 * envelope record. Endpoints read `data` with {@link envelopeData} and the
 * `message` with {@link envelopeMessage}.
 */
// unknown: each endpoint's output schema parses what this returns.
function validateEnvelope(options: ApiRequestOptions, raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record) {
		throw okStatusFailure(
			options,
			undefined,
			'Listclean: the answer is not the JSON envelope; an HTML page means the route does not exist',
		);
	}
	const envelope = readEnvelope(record);
	if (envelope.success !== 1) {
		throw okStatusFailure(
			options,
			record,
			describeListcleanError(200, record, 'Listclean reported a failure'),
		);
	}
	return record;
}

// unknown: callers parse the body with the endpoint's zod output schema, so
// the client's return type stays unknown by design.
export async function makeListcleanRequest(
	apiKey: string,
	{ method, path, query, body, replayable, response }: ListcleanRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: LISTCLEAN_API_BASE,
		VERSION: '0.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: LISTCLEAN_TIMEOUT_MS,
		// The key rides in this header as a plain value; Listclean documents no
		// Bearer or Basic scheme (spec, securityDefinitions.api_key).
		HEADERS: {
			Accept: response === 'text' ? 'text/csv, */*' : 'application/json',
			'X-Auth-Token': apiKey,
		},
	};

	const options: ApiRequestOptions = {
		method,
		url: path,
		query: query ? definedQuery(query) : undefined,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	let raw: unknown;
	try {
		// Core's request() retries a 429 three times, honouring Retry-After.
		// unknown: the endpoint's zod output schema parses the body.
		raw = await request<unknown>(config, options);
	} catch (error) {
		if (error instanceof ApiError) {
			const rebuilt = rebuild(
				options,
				error,
				describeListcleanError(error.status, error.body, error.statusText),
				error,
			);
			requestFacts.set(rebuilt, { method, replayable, transport: false });
			throw rebuilt;
		}
		// No HTTP answer (reset, DNS, abort, timeout): there was no response
		// body, so the error passes through with the request's facts beside it.
		if (typeof error === 'object' && error !== null) {
			requestFacts.set(error, { method, replayable, transport: true });
		}
		throw error;
	}

	try {
		if (response === 'json') return parseJsonDownload(options, raw);
		if (response === 'text') return readCsvDownload(options, raw);
		return validateEnvelope(options, raw);
	} catch (error) {
		if (error instanceof ApiError) {
			requestFacts.set(error, { method, replayable, transport: false });
		}
		throw error;
	}
}

/** The `data` payload of the envelope the client already validated. */
// unknown: the payload's shape is the endpoint's output schema, not one fixed type.
export function envelopeData(raw: unknown): unknown {
	return asRecord(raw)?.data;
}

/** The envelope `message`, which some writes document in place of data. */
// unknown: the output schema validates this as a string; here it is untyped.
export function envelopeMessage(raw: unknown): unknown {
	return asRecord(raw)?.message;
}
