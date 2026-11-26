import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists for
// this state, so message matching is the only handle available; kept narrow on
// purpose so it can't swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads the stored API key. `ctx.keys.get_api_key()` throws rather than
 * returning null when the account has no DEK at all, a valid state for
 * accounts that pass the key through plugin options; that resolves to "no
 * stored key". Anything else thrown is a real failure and propagates.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/**
 * ScrapeCreators REST API. Every route is under `/v1`, `/v2` or `/v3` and takes
 * the key in the `x-api-key` header. Reference:
 * https://docs.scrapecreators.com/introduction and
 * https://docs.scrapecreators.com/openapi.json.
 */
export const SCRAPECREATORS_API_BASE = 'https://api.scrapecreators.com';

/**
 * Live scrapes and AI transcripts can take well over the transport's 20 s
 * default (a transcript of a long video runs for minutes on their side).
 */
export const SCRAPECREATORS_TIMEOUT_MS = 120_000;

export async function makeScrapeCreatorsRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method: 'GET' | 'POST';
		query?: Record<string, string | number | boolean>;
		body?: Record<string, string | number | boolean>;
	},
): Promise<T> {
	// keyBuilder already throws AuthMissingError before an empty key reaches
	// here; this keeps a keyless request from going out (the API answers 401).
	if (apiKey.length === 0) {
		throw new AuthMissingError('scrapecreators', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: SCRAPECREATORS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: SCRAPECREATORS_TIMEOUT_MS,
		HEADERS: {
			'x-api-key': apiKey,
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: options.method === 'GET' ? options.query : undefined,
		body: options.method === 'POST' ? options.body : undefined,
		mediaType: 'application/json',
	};

	try {
		// Core's default rate-limit config retries a 429 three times, honouring
		// Retry-After; the plugin's 429 handler doesn't retry again.
		const result = await request<T | string>(config, requestOptions);
		return parseTextJson(result) as T;
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error);
		}
		throw error;
	}
}

/**
 * Some routes (`/v1/account/credit-balance`) send JSON as `text/plain`, which
 * core returns as a string. A string that parses as JSON is that JSON; any
 * other string is returned as sent, and the output schema rejects it.
 */
// `unknown` is necessary because a response body is untrusted until its output schema parses it.
export function parseTextJson(value: unknown): unknown {
	if (typeof value !== 'string') return value;
	const trimmed = value.trim();
	if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;
	try {
		return JSON.parse(trimmed);
	} catch {
		return value;
	}
}

const REDACTED = '[REDACTED]';
const MAX_MESSAGE_LENGTH = 300;

/**
 * Core keeps the sent body on `ApiError.request` and scrubs only the URL and
 * query; the POST form of a route carries the same handles, URLs and cursors.
 * The error is rebuilt without it, keeping the status and rate-limit fields
 * that the error handlers and core's retries read. The message becomes
 * ScrapeCreators' own `message` plus its `error` code
 * (`{"success":false,"error":"missing_parameter","errorStatus":400,"message":"..."}`).
 */
function withoutRequestData(error: ApiError): ApiError {
	const body = parseTextJson(error.body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
		},
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		safeMessage(error, body),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// `unknown` is necessary because an error body is whatever JSON (or text) the API sent.
function safeMessage(error: ApiError, body: unknown): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? (body as { message?: unknown; error?: unknown })
			: {};
	let text =
		typeof fields.message === 'string' && fields.message.trim() !== ''
			? fields.message.trim()
			: error.statusText || `HTTP ${error.status}`;
	if (text.length > MAX_MESSAGE_LENGTH) {
		text = `${text.slice(0, MAX_MESSAGE_LENGTH - 3)}...`;
	}
	return typeof fields.error === 'string' && !text.includes(fields.error)
		? `${text} (${fields.error})`
		: text;
}
