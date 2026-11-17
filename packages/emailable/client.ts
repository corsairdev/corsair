import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const EMAILABLE_API_BASE = 'https://api.emailable.com';

function config(apiKey: string | undefined): OpenAPIConfig {
	return {
		BASE: EMAILABLE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Emailable takes the key as a Bearer token, which keeps it out of the
		// URL and the request body.
		HEADERS: {
			Accept: 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
	};
}

const HIDDEN = '[REDACTED]';

function redactUrl(url: string): string {
	try {
		const parsed = new URL(url, EMAILABLE_API_BASE);
		if (!parsed.searchParams.has('email')) return url;
		parsed.searchParams.set('email', HIDDEN);
		return /^[a-z]+:\/\//i.test(url)
			? parsed.toString()
			: parsed.pathname + parsed.search;
	} catch {
		return url.replace(/([?&]email=)[^&#]*/g, `$1${HIDDEN}`);
	}
}

/**
 * Core's ApiError keeps the request's query and body. Here those hold email
 * addresses (the address being verified, a batch's list), so they are replaced
 * before the error leaves the plugin. Status, body and rate-limit fields stay.
 */
function withoutAddresses(error: ApiError): ApiError {
	const query = error.request.query?.email
		? { ...error.request.query, email: HIDDEN }
		: error.request.query;
	// The request body is the JSON object this client built.
	const body = error.request.body as Record<string, unknown> | undefined;
	const cleanBody =
		body && typeof body === 'object' && 'emails' in body
			? { ...body, emails: HIDDEN }
			: body;
	return new ApiError(
		{
			...error.request,
			url: redactUrl(error.request.url),
			query,
			body: cleanBody,
		},
		{
			url: redactUrl(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

async function send<T>(
	apiKey: string | undefined,
	options: ApiRequestOptions,
): Promise<T> {
	try {
		// Core's request() retries a 429 itself, honouring Retry-After.
		return await request<T>(config(apiKey), options);
	} catch (error) {
		throw error instanceof ApiError ? withoutAddresses(error) : error;
	}
}

export async function emailableGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	return send<T>(apiKey, { method: 'GET', url, query });
}

export async function emailablePost<T>(
	apiKey: string | undefined,
	url: string,
	// JSON body built by the endpoint from its validated input.
	body: Record<string, unknown>,
): Promise<T> {
	return send<T>(apiKey, {
		method: 'POST',
		url,
		body,
		mediaType: 'application/json',
	});
}

// Narrows untyped provider JSON; callers check each field they read.
export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}
