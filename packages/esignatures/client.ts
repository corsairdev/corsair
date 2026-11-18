import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ESIGNATURES_API_BASE = 'https://esignatures.com/api';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. eSignatures does not document that header.
const ESIGNATURES_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** The docs' HTTP Basic scheme: the secret token as the username, no password. */
export function basicAuthHeader(apiKey: string): string {
	return `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
}

/**
 * eSignatures does not document an error body shape. The live API answers
 * `{ status: 'error', data: { error_code, error_message } }`, so that message
 * is read first, then the common top-level fields, and the status is
 * prepended when present.
 */
export function describeESignaturesError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(asRecord(record?.data), 'error_message') ??
		readString(record, 'error') ??
		readString(record, 'message') ??
		readString(record, 'error_message') ??
		readString(record, 'detail') ??
		fallback;
	return status === undefined ? text : `eSignatures ${status}: ${text}`;
}

export type ESignaturesRequest = {
	method: 'GET' | 'POST';
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless answers such as withdraw and send_draft.
export async function makeESignaturesRequest(
	apiKey: string,
	{ method, path, body }: ESignaturesRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: ESIGNATURES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 20_000,
		HEADERS: {
			Accept: 'application/json',
			Authorization: basicAuthHeader(apiKey),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: ESIGNATURES_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ESignaturesAPIError(
				describeESignaturesError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ESignaturesAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new ESignaturesAPIError('Unknown eSignatures error', { method });
	}
}

export class ESignaturesAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when eSignatures sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are undocumented and can be HTML from a proxy.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ESignaturesAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}

	/** True for a 429. eSignatures documents no other rate-limit signal. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}
