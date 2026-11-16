import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { JsonObject, UnknownJson } from './json';

export const SIMPLESAT_API_BASE = 'https://api.simplesat.io';

/**
 * Simplesat documents no rate limit and no rate-limit headers, so a 429 here
 * comes from a gateway. Retries live in error-handlers.ts.
 */
const SIMPLESAT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * True when the key is missing, unrecognised or lacks the route's scope.
 * Simplesat answers all three with 403 (`Invalid Token.`), so a 401 or 403,
 * or a detail naming the token, counts.
 */
export function isSimplesatAuthError(error: ApiError): boolean {
	if (error.status === 401 || error.status === 403) return true;
	const detail =
		readString(asRecord(error.body), 'detail')?.toLowerCase() ?? '';
	return (
		detail.includes('invalid token') ||
		detail.includes('no api key') ||
		detail.includes('not authenticated')
	);
}

// The record is an untyped error body; read one field at a time.
function readString(
	record: JsonObject | null | undefined, // unknown: untyped error body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * A 400 body maps a field name to its messages. `detail` is a string rather
 * than a list, so it is not mistaken for a field named `detail`.
 */
function readFieldErrors(
	body: UnknownJson, // unknown: an error body, whose fields are checked below
): Record<string, string[]> | undefined {
	const record = asRecord(body);
	if (!record) return undefined;

	const out: Record<string, string[]> = {};
	for (const [field, messages] of Object.entries(record)) {
		if (field === 'detail') continue;
		if (Array.isArray(messages)) {
			const strings = messages.filter(
				(entry): entry is string => typeof entry === 'string',
			);
			if (strings.length > 0) out[field] = strings;
		} else if (typeof messages === 'string') {
			out[field] = [messages];
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export function describeSimplesatError(
	status: number | undefined,
	body: UnknownJson, // unknown: an error body can be text, HTML or empty
	fallback: string,
): string {
	const record = asRecord(body);
	const fieldErrors = readFieldErrors(body);
	const text =
		readString(record, 'detail') ??
		(fieldErrors ? describeFieldErrors(fieldErrors) : fallback);
	return status === undefined ? text : `Simplesat ${status}: ${text}`;
}

function describeFieldErrors(errors: Record<string, string[]>): string {
	return Object.entries(errors)
		.map(([field, messages]) => `${field}: ${messages.join('; ')}`)
		.join('. ');
}

export type SimplesatQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SimplesatRequest = {
	method: 'GET' | 'POST' | 'PUT';
	path: string;
	query?: SimplesatQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: unknown; // unknown: the endpoint's input schema already validated it
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema, and the shape
// differs per route, which is what that schema is for. unknown: the schema
// narrows it before a caller sees it.
export async function makeSimplesatRequest(
	apiKey: string,
	{ method, path, query, body }: SimplesatRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIMPLESAT_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// A literal header: the key is not a Bearer token, and the header name
			// is Simplesat's own.
			'X-Simplesat-Token': apiKey,
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
		// unknown: see the note on makeSimplesatRequest.
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SIMPLESAT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw stripRequestData(error);
		throw error;
	}
}

/**
 * A record is addressed in the path by id, and a customer by an external id
 * that can be an email address. The record segment is replaced with a marker.
 */
export function maskPath(url: string): string {
	return (url.split('?')[0] ?? url).replace(
		/(\/api\/v1\/(?:customers|answers|responses|team-members))\/(?!search(?:$|\/)|bulk(?:$|\/)|create-or-update(?:$|\/))[^/]+/,
		'$1/[identifier]',
	);
}

/**
 * Core's ApiError keeps the request it failed on: the customer or response
 * body (names, emails, comments), the query and the record id in the path.
 * This rebuilds it without them and keeps what core and the handlers read:
 * status, body, Retry-After and the method. It is still core's ApiError.
 */
export function stripRequestData(error: ApiError): ApiError {
	return new ApiError(
		{ method: error.request.method, url: maskPath(error.request.url) },
		{
			url: maskPath(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		describeSimplesatError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
