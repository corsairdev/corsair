import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MOOSEND_API_BASE = 'https://api.moosend.com/v3';

export type MoosendQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MoosendRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: MoosendQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/**
 * Moosend's `{Code, Error, Context}` envelope. Code 0 is success; on success
 * `Error` is usually null, but bulk calls put a warning there (for example
 * "1 items were ignored because Email is not valid ...").
 */
export type MoosendEnvelope = {
	code: number;
	notice: string | null;
	// unknown: each endpoint parses Context with its own output schema.
	context: unknown;
};

const EMAIL = /[^\s@()<>"',;:]+@[^\s@()<>"',;:]+/g;

/** Masks email addresses Moosend quotes back in its error strings. */
export function maskEmails(text: string): string {
	return text.replace(EMAIL, '[email]');
}

/**
 * Moosend answers almost every failure with HTTP 200 and a nonzero Code, so
 * core's HTTP-status logic never sees them. The status here maps the code to
 * the HTTP status it means, so Corsair's error handling (429 retries, a 401
 * that asks to reconnect, a 404) treats it the same as a real HTTP failure.
 * The original code and error string stay on `body`.
 */
export function statusForEnvelope(code: number, error: string): number {
	if (code === 429 || /RATE.?LIMIT/i.test(error)) return 429;
	if (code === 104 || /API_KEY/i.test(error)) return 401;
	if (/NOT_FOUND/i.test(error)) return 404;
	// -1 covers both real faults ("An internal error occurred ...", a bare
	// "UNEXPECTED_ERROR") and refusals with a reason ("UNEXPECTED_ERROR: The
	// email is unsubscribed from the mailing list"); only the first are 5xx.
	if (
		code === -1 &&
		(/internal error/i.test(error) || /^UNEXPECTED_ERROR:?\s*$/.test(error))
	)
		return 500;
	return 400;
}

function strippedRequest(options: ApiRequestOptions): ApiRequestOptions {
	// The body carries subscriber emails, names and campaign content, and the
	// query can carry an `Email` lookup next to the key. Drop both.
	return { ...options, query: undefined, body: undefined, formData: undefined };
}

/** The URL without its query string (key, Email lookups). */
function withoutQuery(url: string): string {
	const index = url.indexOf('?');
	return index === -1 ? url : url.slice(0, index);
}

/** Rebuilds an HTTP ApiError without the request body, keeping its status. */
function withoutRequestBody(error: ApiError): ApiError {
	const rebuilt = new ApiError(
		strippedRequest(error.request),
		{
			url: withoutQuery(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			// A gateway error page is HTML; keep only a short text sample.
			body:
				typeof error.body === 'string'
					? maskEmails(error.body.slice(0, 300))
					: error.body,
		},
		`Moosend HTTP ${error.status}: request failed`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	rebuilt.stack = error.stack;
	return rebuilt;
}

/** True for an ApiError built from a nonzero envelope Code. */
export function isEnvelopeError(error: Error): error is ApiError {
	if (!(error instanceof ApiError)) return false;
	const body = asRecord(error.body);
	return typeof body?.Code === 'number';
}

/** The envelope's Error string of an ApiError built from one. */
export function envelopeErrorName(error: Error): string | undefined {
	if (!isEnvelopeError(error)) return undefined;
	const value = asRecord(error.body)?.Error;
	return typeof value === 'string' ? value : undefined;
}

/**
 * Sends one request and unwraps the envelope. Nonzero Codes throw core's
 * `ApiError` with the mapped status and the masked envelope on `body`.
 */
export async function makeMoosendRequest(
	apiKey: string,
	{ method, path, query, body }: MoosendRequest,
): Promise<MoosendEnvelope> {
	const config: OpenAPIConfig = {
		BASE: MOOSEND_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, apikey: apiKey },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	// unknown: the envelope is checked field by field below.
	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestBody(error);
		throw error;
	}

	const record = asRecord(raw);
	const code = record?.Code;
	if (!record || typeof code !== 'number') {
		throw new ApiError(
			strippedRequest(requestOptions),
			{
				url: `${MOOSEND_API_BASE}${path}`,
				ok: false,
				status: 502,
				statusText: 'Bad Gateway',
				body: 'Moosend answered without its {Code, Error, Context} envelope.',
			},
			'Moosend answered without its {Code, Error, Context} envelope',
		);
	}

	const errorText =
		typeof record.Error === 'string' ? maskEmails(record.Error) : null;

	if (code !== 0) {
		const name = errorText ?? 'UNKNOWN_ERROR';
		const status = statusForEnvelope(code, name);
		throw new ApiError(
			strippedRequest(requestOptions),
			{
				url: `${MOOSEND_API_BASE}${path}`,
				ok: false,
				status,
				statusText: name,
				body: { Code: code, Error: name },
			},
			`Moosend ${code}: ${name}`,
		);
	}

	return { code, notice: errorText, context: record.Context };
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
