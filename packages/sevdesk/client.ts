import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SEVDESK_API_BASE = 'https://my.sevdesk.de/api/v1';
export type SevdeskHttpMethod = ApiRequestOptions['method'];
type Options = {
	path?: object;
	query?: object;
	body?: object;
	resourceVersion?: string;
	replayable?: boolean;
};
// Unknown query values are documented JSON scalars, arrays, or nested filter objects passed to the shared query serializer.
function toRecord(
	value: object | undefined,
): Record<string, unknown> | undefined {
	if (!value) return undefined;
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) result[key] = entry;
	return result;
}

// Sevdesk reads any non-empty query value as true, so `download=false` returns the raw file and
// `preventSendBy=false` still prevents the status change. Send flags as 1/0 instead.
// `unknown` because query values are scalars, arrays or nested sevQuery objects.
function toQueryFlags(value: unknown): unknown {
	if (typeof value === 'boolean') return value ? 1 : 0;
	if (Array.isArray(value))
		return value.map((entry: unknown) => toQueryFlags(entry));
	if (value !== null && typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(value))
			result[key] = toQueryFlags(entry);
		return result;
	}
	return value;
}

function toQuery(
	value: object | undefined,
): Record<string, unknown> | undefined {
	const record = toRecord(value);
	if (!record) return undefined;
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(record))
		result[key] = toQueryFlags(entry);
	return result;
}
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
const SAFE_ERROR_FIELDS = new Set([
	'code',
	'errorcode',
	'type',
	'status',
	'statuscode',
	'field',
	'parameter',
]);
const REDACTED = '[REDACTED]';

// `unknown` because Sevdesk error bodies are provider-controlled JSON; preserve safe error codes while redacting arbitrary values.
function sanitizeErrorBody(value: unknown, field = ''): unknown {
	if (Array.isArray(value))
		return value.map((entry: unknown) => sanitizeErrorBody(entry));
	if (value !== null && typeof value === 'object') {
		const sanitized: Record<string, unknown> = {};
		for (const key of Object.keys(value)) {
			const entry: unknown = Reflect.get(value, key);
			sanitized[key] = sanitizeErrorBody(
				entry,
				key.toLowerCase().replace(/[-_]/gu, ''),
			);
		}
		return sanitized;
	}
	if (SAFE_ERROR_FIELDS.has(field)) return value;
	return value === null ? null : REDACTED;
}

function sanitizeApiError(error: ApiError): ApiError {
	// Error body values and request payloads can contain contacts, invoices, and credentials.
	const body: unknown = error.body;
	const stack = error.stack?.replace(
		error.message,
		'Sevdesk API request failed',
	);
	const request: ApiRequestOptions = {
		method: error.request.method,
		url: SEVDESK_API_BASE,
	};
	// Mutate the original ApiError so Corsair keeps its identity, stack frames, status, and Retry-After metadata.
	return Object.assign(error, {
		url: SEVDESK_API_BASE,
		statusText: '',
		message: 'Sevdesk API request failed',
		stack,
		body: sanitizeErrorBody(body),
		request,
	});
}

function safeError(caught: unknown): Error {
	// unknown because HTTP and fetch errors have no stable shape; narrow API errors before removing potentially sensitive data.
	if (caught instanceof ApiError) return sanitizeApiError(caught);
	return new Error('Sevdesk request failed');
}
export async function makeSevdeskRequest<T>(
	method: SevdeskHttpMethod,
	endpoint: string,
	apiKey: string | undefined,
	options: Options = {},
): Promise<T> {
	if (!apiKey || !/^[a-f0-9]{32}$/iu.test(apiKey))
		throw new AuthMissingError('sevdesk', 'api_key');
	if (
		options.resourceVersion !== undefined &&
		options.resourceVersion !== 'default' &&
		!/^\d+\.\d+$/u.test(options.resourceVersion)
	)
		throw new Error('Invalid Sevdesk X-Version value');
	const headers: Record<string, string> = {
		Authorization: apiKey,
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': 'Corsair Sevdesk integration',
	};
	if (options.resourceVersion !== undefined)
		headers['X-Version'] = options.resourceVersion;
	const config: OpenAPIConfig = {
		BASE: SEVDESK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
		ENCODE_PATH: encodeURIComponent,
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path: toRecord(options.path),
		query: toQuery(options.query),
		body: ['POST', 'PUT', 'PATCH'].includes(method) ? options.body : undefined,
		mediaType: 'application/json; charset=utf-8',
	};
	for (let attempt = 0; attempt < 3; attempt += 1) {
		try {
			// unknown because provider JSON is untrusted until the operation's output Zod schema validates it.
			// Core's default rate-limit config retries a 429 three times and honours Retry-After.
			return await request<T>(config, requestOptions);
		} catch (caught: unknown) {
			// unknown because transport failures may contain PII; sanitize before retrying or propagating them.
			const error = safeError(caught);
			if (
				method !== 'GET' ||
				options.replayable !== true ||
				(error instanceof ApiError && error.status < 500) ||
				attempt === 2
			)
				throw error;
			await delay(50 * 2 ** attempt);
		}
	}
	throw new Error('Sevdesk request failed');
}
