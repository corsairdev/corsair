import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MOPINION_API_BASE = 'https://api.mopinion.com';

/**
 * The API version every request pins. Mopinion serves its latest stable
 * release (2.5.5 on 11-24) when no `version` header is sent; `2.5.0` asks for
 * that same 2.5 line, so a future major release can't change the responses.
 * The 3.0.0 line is an alpha: live on 11-24 it answered 500 for every
 * feedback route and for a deployment read.
 */
export const MOPINION_API_VERSION = '2.5.0';

/**
 * Mopinion signs every request with an `x-auth-token`:
 * `BASE64(PUBLIC_KEY : HMAC_SHA256_hex(RESOURCE_URI | JSON_BODY))`, keyed
 * with the signature token. RESOURCE_URI excludes query parameters, and the
 * JSON_BODY is the exact request body string (empty for GETs). Verified
 * against the docs' worked example.
 */
export function mopinionAuthToken(
	publicKey: string,
	signatureToken: string,
	resourceUri: string,
	jsonBody: string,
): string {
	const hmac = createHmac('sha256', signatureToken)
		.update(`${resourceUri}|${jsonBody}`)
		.digest('hex');
	return Buffer.from(`${publicKey}:${hmac}`).toString('base64');
}

/**
 * The key the keyBuilder resolves is `<public key>:<signature token>`.
 * Public keys contain no colon, so the first colon splits the pair and a
 * colon inside the token survives.
 */
export function splitCredentials(key: string): {
	publicKey: string;
	signatureToken: string;
} {
	const at = key.indexOf(':');
	if (at <= 0 || at === key.length - 1) {
		throw new AuthMissingError('mopinion', 'api_key');
	}
	return { publicKey: key.slice(0, at), signatureToken: key.slice(at + 1) };
}

export type MopinionQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MopinionRequest = {
	method: 'GET';
	/** The path with a leading slash, WITHOUT query parameters. */
	path: string;
	query?: MopinionQuery;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMopinionRequest(
	ctx: { key: string },
	{ method, path, query }: MopinionRequest,
): Promise<unknown> {
	const { publicKey, signatureToken } = splitCredentials(ctx.key);
	// Every data API route is a GET, so the signed body is the empty string.
	const authToken = mopinionAuthToken(publicKey, signatureToken, path, '');

	const config: OpenAPIConfig = {
		BASE: MOPINION_API_BASE,
		VERSION: MOPINION_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'x-auth-token': authToken,
			version: MOPINION_API_VERSION,
		},
	};

	const requestOptions: ApiRequestOptions = { method, url: path, query };

	try {
		// Core retries a 429 three times, honouring Retry-After.
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw error;
	}
}

/**
 * Core keeps the request on `ApiError.request`, headers included: the
 * `x-auth-token` there carries the public key and a signature. The error is
 * rebuilt without headers and query values (filters can hold tags), keeping
 * the status and rate-limit fields core and the error handlers read. The
 * message comes from Mopinion's RFC 7807 problem body
 * (`{ status, error_code, title, type, details }`), which core would
 * otherwise reduce to a bare status text.
 */
export function withoutRequestData(error: ApiError): ApiError {
	const body = problemOf(error.body);
	return new ApiError(
		{
			...error.request,
			headers: undefined,
			query:
				error.request.query === undefined
					? undefined
					: Object.fromEntries(
							Object.keys(error.request.query).map((key) => [
								key,
								'[REDACTED]',
							]),
						),
		},
		{
			url: withoutQuery(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		describeMopinionError(error.status, body, error.statusText),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?[REDACTED]`;
}

/** The problem fields of an error body; a gateway's HTML page becomes `{}`. */
// unknown: an error body is whatever Mopinion (or a gateway) sent.
function problemOf(body: unknown): {
	status?: number;
	error_code?: number;
	title?: string;
	type?: string;
} {
	let value = body;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return {};
		}
	}
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return {};
	}
	// unknown: each field is narrowed below.
	const record = value as Record<string, unknown>;
	return {
		...(typeof record.status === 'number' ? { status: record.status } : {}),
		...(typeof record.error_code === 'number'
			? { error_code: record.error_code }
			: {}),
		...(typeof record.title === 'string' ? { title: record.title } : {}),
		...(typeof record.type === 'string' ? { type: record.type } : {}),
	};
}

/** The RFC 7807 `error_code` of a Mopinion error (18: invalid credentials). */
export function mopinionErrorCode(error: Error): number | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const code = problemOf(error.body).error_code;
	return typeof code === 'number' ? code : undefined;
}

export function describeMopinionError(
	status: number | undefined,
	body: { error_code?: number; title?: string },
	fallback: string,
): string {
	const text = body.title || fallback || 'request failed';
	const label = [status, body.error_code]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Mopinion ${label}: ${text}` : `Mopinion: ${text}`;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
