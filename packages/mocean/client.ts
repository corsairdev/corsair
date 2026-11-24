import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	BinaryResponse,
	OpenAPIConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MOCEAN_API_BASE = 'https://rest.moceanapi.com';

/**
 * Every Mocean REST response defaults to XML; the plugin asks for JSON on
 * every `/rest/2` call. It goes in the query for GETs and in the form body
 * for POSTs, which the endpoints set.
 */
export const MOCEAN_RESP_FORMAT = 'json';

/**
 * Mocean answers most failures with HTTP 202 and a body `status`, and the
 * same number means different things per API family: 2 is "insufficient
 * balance" for SMS but "authorization failed" for Verify, whose throttle
 * code is 1. Template and WhatsApp routes use plain HTTP statuses.
 */
export type MoceanFamily = 'sms' | 'verify' | 'query' | 'voice' | 'whatsapp';

export type MoceanQuery = Record<string, string | number | boolean | undefined>;

export type MoceanRequest = {
	family: MoceanFamily;
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: MoceanQuery;
	/**
	 * A string body is sent verbatim with `mediaType` (Mocean takes
	 * form-encoded bodies on `/rest/2`); anything else is sent as JSON.
	 */
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	mediaType?: string;
	/** Downloads (recordings, WhatsApp media) come back as bytes. */
	responseType?: 'binary';
};

const PHONE = /\+?\d[\d\s-]{6,}\d/g;
const EMAIL = /[^\s@()<>"',;:]+@[^\s@()<>"',;:]+/g;

/**
 * Mocean URL-encodes some messages ("Associated+verify+request+has+...") and
 * can quote the receiver's number back. Decode, then mask numbers and emails.
 */
export function cleanMessage(text: string): string {
	let decoded = text.replace(/\+/g, ' ');
	try {
		decoded = decodeURIComponent(decoded);
	} catch {
		// keep the '+'-decoded text when it is not valid percent-encoding
	}
	return decoded.replace(EMAIL, '[email]').replace(PHONE, '[number]');
}

/** Reads a body status that Mocean sends as a number or, on voice, a string. */
// unknown: any parsed response body; only `status` is read.
export function readBodyStatus(body: unknown): number | undefined {
	// Mocean's default format is XML: <result><status>1</status>...
	if (typeof body === 'string') {
		const match = /<status>\s*(\d+)\s*<\/status>/.exec(body);
		return match ? Number(match[1]) : undefined;
	}
	const value = asRecord(body)?.status;
	if (typeof value === 'number') return value;
	if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value);
	return undefined;
}

/** The HTTP status a body status means, per family, for Corsair's handlers. */
export function statusForBody(family: MoceanFamily, code: number): number {
	if (family === 'verify') {
		if (code === 1) return 429;
		if (code === 2) return 401;
		if (code === 3 || code === 21 || code === 40) return 503;
		if (code === 18) return 402;
		return 400;
	}
	if (family === 'voice') {
		if (code === 10 || code === 14) return 500;
		if (code === 15) return 503;
	}
	if (code === 1) return 401;
	if (code === 2) return 402;
	if (code === 32) return 429;
	if (code === 40) return 503;
	if (code === 24 || code === 45) return 500;
	return 400;
}

/**
 * Errors built from a 2xx body status, as opposed to an HTTP failure.
 * Core already retried an HTTP 429; only a body throttle needs the plugin's
 * retry.
 */
const bodyStatusErrors = new WeakSet<ApiError>();

export function isBodyStatusError(error: Error): error is ApiError {
	return error instanceof ApiError && bodyStatusErrors.has(error);
}

// unknown: whatever the server sent; only status and err_msg survive.
function safeBody(
	body: unknown,
): { status?: number; err_msg?: string; hint?: string } | string {
	const record = asRecord(body);
	if (record) {
		// A send's validation error wraps the status in messages[0].
		const first = Array.isArray(record.messages)
			? asRecord(record.messages[0])
			: undefined;
		const source =
			readBodyStatus(record) === undefined && first ? first : record;
		const status = readBodyStatus(source);
		const message =
			typeof source.err_msg === 'string'
				? cleanMessage(source.err_msg)
				: undefined;
		const hint =
			typeof source.hint === 'string' ? cleanMessage(source.hint) : undefined;
		return {
			...(status === undefined ? {} : { status }),
			...(message === undefined ? {} : { err_msg: message }),
			...(hint === undefined ? {} : { hint }),
		};
	}
	if (typeof body !== 'string') return '';
	const xmlMessage = /<err_msg>([^<]*)<\/err_msg>/.exec(body)?.[1];
	if (xmlMessage !== undefined) {
		const status = readBodyStatus(body);
		return {
			...(status === undefined ? {} : { status }),
			err_msg: cleanMessage(xmlMessage),
		};
	}
	return cleanMessage(body.replace(/<[^>]+>/g, ' ').trim()).slice(0, 300);
}

function strippedRequest(options: ApiRequestOptions): ApiRequestOptions {
	// Form and JSON bodies carry phone numbers, message text and PINs, and
	// queries can carry a number or a message id. The token is a header.
	return {
		method: options.method,
		url: options.url,
		query: undefined,
		body: undefined,
		formData: undefined,
		headers: undefined,
	};
}

function messageOf(prefix: string, body: ReturnType<typeof safeBody>): string {
	if (typeof body === 'string') return body ? `${prefix}: ${body}` : prefix;
	return body.err_msg ? `${prefix}: ${body.err_msg}` : prefix;
}

/** Rebuilds an HTTP ApiError without request data, keeping status and retry info. */
function withoutRequestData(error: ApiError): ApiError {
	const body = safeBody(error.body);
	return new ApiError(
		strippedRequest(error.request),
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		messageOf(`Mocean HTTP ${error.status}`, body),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * Sends one request. HTTP failures become core's ApiError without request
 * data; a 2xx body with a nonzero `status` becomes one too, with the HTTP
 * status that body status means. A send's per-receiver results
 * (`messages[]`, `calls[]`) are returned as they are: one failed receiver
 * does not fail the others.
 */
// unknown: the default return type; callers parse it with an output schema.
export async function makeMoceanRequest<T = unknown>(
	apiKey: string,
	{ family, method, path, query, body, mediaType, responseType }: MoceanRequest,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: MOCEAN_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: responseType === 'binary' ? '*/*' : 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType,
		...(responseType ? { responseType } : {}),
	};

	// unknown: a JSON body, a BinaryResponse, or a body-status error.
	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw error;
	}

	// A download that failed answers JSON (or XML) instead of the file.
	if (responseType === 'binary') {
		const binary = raw as BinaryResponse;
		const type =
			(binary.contentType ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
		// A status answer, not a file. OpenXML documents (DOCX, XLSX) are
		// files: match the JSON and XML media types exactly.
		if (
			type === 'application/json' ||
			type === 'text/json' ||
			type === 'application/xml' ||
			type === 'text/xml' ||
			type.endsWith('+json')
		) {
			const text = new TextDecoder().decode(binary.bytes);
			// unknown: the error body is parsed only to read status and err_msg.
			let parsed: unknown = text;
			try {
				parsed = JSON.parse(text);
			} catch {
				// XML or text: read below as a string
			}
			const code = readBodyStatus(parsed) ?? 24;
			throw bodyStatusError(requestOptions, path, family, code, parsed);
		}
		if (binary.bytes.byteLength === 0) {
			throw bodyStatusError(requestOptions, path, family, 24, 'empty file');
		}
		return raw as T;
	}

	const code = readBodyStatus(raw);
	if (code !== undefined && code !== 0) {
		throw bodyStatusError(requestOptions, path, family, code, raw);
	}
	return raw as T;
}

function bodyStatusError(
	requestOptions: ApiRequestOptions,
	path: string,
	family: MoceanFamily,
	code: number,
	// unknown: the failing body, reduced to status and err_msg by safeBody.
	raw: unknown,
): ApiError {
	const cleaned = safeBody(raw);
	const body =
		typeof cleaned === 'string'
			? { status: code, err_msg: cleaned }
			: { ...cleaned, status: code };
	const error = new ApiError(
		strippedRequest(requestOptions),
		{
			url: `${MOCEAN_API_BASE}${path}`,
			ok: false,
			status: statusForBody(family, code),
			statusText: `Mocean status ${code}`,
			body,
		},
		messageOf(`Mocean status ${code}`, body),
	);
	bodyStatusErrors.add(error);
	return error;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Builds the urlencoded form body Mocean takes, with `mocean-resp-format`
 * always set so the answer comes back as JSON.
 */
export function moceanForm(
	fields: Record<string, string | number | boolean | undefined>,
): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) params.set(key, String(value));
	}
	params.set('mocean-resp-format', MOCEAN_RESP_FORMAT);
	return params.toString();
}
