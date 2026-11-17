import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NGROK_API_BASE = 'https://api.ngrok.com';

// Retries belong to error-handlers.ts. ngrok documents no Retry-After, so the
// name is kept only so a proxy that sends one is honoured.
const NGROK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * A transport failure (timeout, DNS, reset) that never got a response. An HTTP
 * error stays core's `ApiError` (see `sanitizeApiError`), so its status,
 * Retry-After and ngrok's `error_code` reach core and the handlers.
 */
export class NgrokAPIError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NgrokAPIError';
		this.method = options.method;
	}
}

/**
 * Reads ngrok's `{ error_code, status_code, msg, details: { operation_id } }`.
 * Transport-level failures omit the code and carry only `msg`.
 */
// unknown: the body is whatever the edge or the API sent.
export function readNgrokError(body: unknown): {
	code?: string;
	message?: string;
	operationId?: string;
} {
	const record = asRecord(body);
	return {
		code: readString(record, 'error_code'),
		message: readString(record, 'msg'),
		operationId: readString(asRecord(record?.details), 'operation_id'),
	};
}

// unknown: see readNgrokError.
export function describeNgrokError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { code, message, operationId } = readNgrokError(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const text = message ?? fallback;
	const where = operationId ? ` (operation ${operationId})` : '';
	return label ? `ngrok ${label}: ${text}${where}` : `${text}${where}`;
}

/**
 * Rebuilds ngrok's HTTP error as a core `ApiError` with a readable message, so
 * status, Retry-After and the rate-limit fields reach core (R8). The body keeps
 * only ngrok's `error_code`, `msg` and operation id; the sent body is dropped,
 * because a create can carry a traffic policy or metadata.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const { code, message, operationId } = readNgrokError(error.body);
	const envelope =
		code === undefined && message === undefined
			? undefined
			: {
					error_code: code,
					msg: message,
					details: operationId ? { operation_id: operationId } : undefined,
				};
	return new ApiError(
		request,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: envelope,
		},
		describeNgrokError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** ngrok's `error_code` on a core ApiError, e.g. `ERR_NGROK_202`. */
export function ngrokErrorCode(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	return readNgrokError(error.body).code;
}

/** The HTTP method of the failed request. */
export function ngrokErrorMethod(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request.method;
	if (error instanceof NgrokAPIError) return error.method;
	return undefined;
}

export type NgrokQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type NgrokRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: NgrokQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204.
export async function makeNgrokRequest(
	apiKey: string,
	{ method, path, query, body }: NgrokRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NGROK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			// ngrok requires this on every v2 request; without it the API
			// answers a version error that reads like an auth failure.
			'Ngrok-Version': '2',
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NGROK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NgrokAPIError(error.message, { cause: error, method });
		}
		throw new NgrokAPIError('Unknown ngrok error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
