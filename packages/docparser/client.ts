import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DOCPARSER_API_BASE = 'https://api.docparser.com';

export type DocparserQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Core's ApiError keeps the request's form fields. For imports those are the
 * whole document (base64), its URL, file name and remote id, so they are replaced before the error
 * leaves the plugin. Status, body and rate-limit fields stay.
 */
function withoutDocument(error: ApiError): ApiError {
	const form = error.request.formData;
	const fields = ['file_content', 'url', 'file_name', 'remote_id'];
	if (!form || !fields.some((field) => field in form)) return error;
	const cleaned = { ...form };
	// The document, its URL and caller-chosen names can identify a person.
	for (const field of fields)
		if (field in cleaned) cleaned[field] = '[REDACTED]';
	return new ApiError(
		{ ...error.request, formData: cleaned },
		{
			url: error.url,
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

export async function docparserRequest<T>(
	apiKey: string | undefined,
	method: 'GET' | 'POST',
	url: string,
	options: {
		query?: DocparserQuery;
		// Sent as multipart/form-data, the encoding Docparser's import routes take.
		formData?: Record<string, string | string[] | undefined>;
	} = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: DOCPARSER_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${btoa(`${apiKey ?? ''}:`)}`,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url,
		query: options.query,
		formData: options.formData,
	};
	try {
		// Core's request() retries a 429 itself, honouring Retry-After.
		return await request<T>(config, requestOptions);
	} catch (error) {
		throw error instanceof ApiError ? withoutDocument(error) : error;
	}
}

export async function docparserGet<T>(
	apiKey: string | undefined,
	url: string,
	query?: DocparserQuery,
): Promise<T> {
	return docparserRequest<T>(apiKey, 'GET', url, { query });
}

// Narrows untyped provider JSON; callers check each field they read.
export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

/** Path segment from caller input, escaped. */
export function seg(value: string): string {
	return encodeURIComponent(value);
}
