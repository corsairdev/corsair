import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LapostaAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string | number,
	) {
		super(message);
		this.name = 'LapostaAPIError';
	}
}

export const LAPOSTA_API_BASE = 'https://api.laposta.nl/v2';

export async function makeLapostaRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown because each validated endpoint defines its own body fields.
		body?: Record<string, unknown>;
		bodyEncoding?: 'form' | 'json';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, bodyEncoding, query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('laposta', 'api_key');
	}

	// Basic auth: Laposta uses the API key as username with an empty password
	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: LAPOSTA_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			...authHeaders,
		},
	};
	const hasBody =
		(method === 'POST' || method === 'PUT' || method === 'PATCH') &&
		body !== undefined;
	const encoding = bodyEncoding ?? 'form';
	const encodedBody =
		hasBody && body && encoding === 'form' ? encodeFormBody(body) : body;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? encodedBody : undefined,
		mediaType: hasBody
			? encoding === 'json'
				? 'application/json; charset=utf-8'
				: 'application/x-www-form-urlencoded; charset=utf-8'
			: undefined,
		query,
	};

	// `error` is unknown because the transport can reject with any runtime value.
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw stripRequestData(error);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new LapostaAPIError('Unknown error occurred during Laposta request');
	}
}

function encodeFormBody(
	// unknown because validated endpoint bodies have operation-specific fields.
	body: Record<string, unknown>,
): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(body)) {
		appendFormValue(params, key, value);
	}
	return params.toString();
}

function appendFormValue(
	params: URLSearchParams,
	key: string,
	// `unknown` because nested custom fields and options are provider-configured values.
	value: unknown,
): void {
	if (value === undefined) return;
	if (value === null) {
		params.append(key, '');
		return;
	}
	if (Array.isArray(value)) {
		if (value.length === 0) {
			// Laposta treats a present custom-field key with no value as a clear operation.
			params.append(key, '');
			return;
		}
		for (const item of value) appendFormValue(params, `${key}[]`, item);
		return;
	}
	if (typeof value === 'object') {
		for (const [childKey, childValue] of Object.entries(value)) {
			appendFormValue(params, `${key}[${childKey}]`, childValue);
		}
		return;
	}
	params.append(key, String(value));
}

/** Path segments that can carry a member's email address (Laposta accepts an email as member_id). */
function redactPath(value: string): string {
	return value
		.split('?')[0]!
		.split('/')
		.map((segment) => (/@|%40|%2540/i.test(segment) ? '[member]' : segment))
		.join('/');
}

/**
 * Rebuilds core's ApiError without the request body, query and member addresses in the path.
 * The form body holds subscriber emails and custom fields; status, retry metadata and
 * Laposta's error body (type, message, code, parameter) are kept as they are.
 */
function stripRequestData(error: ApiError): ApiError {
	return new ApiError(
		{ method: error.request.method, url: redactPath(error.request.url) },
		{
			url: redactPath(error.url),
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
