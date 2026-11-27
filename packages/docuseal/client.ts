import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DOCUSEAL_API_BASE = 'https://api.docuseal.com';

// DocuSeal documents no rate-limit contract: no 429 semantics and no
// Retry-After. error-handlers.ts owns the retries, so the client makes one
// attempt and only reads Retry-After into the error when a gateway sends it.
const DOCUSEAL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the error body is DocuSeal's JSON envelope or whatever a proxy
// answered with.
function readErrorMessage(body: unknown): string | undefined {
	const value = asRecord(body)?.error;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: the error body is an open shape, narrowed below one field at a time.
export function describeDocuSealError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message = readErrorMessage(body) ?? fallback;
	return status === undefined ? message : `DocuSeal ${status}: ${message}`;
}

export class DocuSealAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when something sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request; error-handlers.ts gates 5xx replays on it. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'DocuSealAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		// The ApiError cause is dropped on purpose: it carries the request with
		// the X-Auth-Token header, and inspect() would print it. Transport
		// causes (fetch failed, timeout) never held a response body, so those
		// are safe to retain.
	}
}

export type DocuSealQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type DocuSealRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: DocuSealQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeDocuSealRequest(
	apiKey: string,
	{ method, path, query, body }: DocuSealRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DOCUSEAL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'X-Auth-Token': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: callers parse the body with the endpoint's zod output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DOCUSEAL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// No cause and no body copied: the ApiError carries the auth header.
			throw new DocuSealAPIError(
				describeDocuSealError(error.status, error.body, error.message),
				{ status: error.status, retryAfter: error.retryAfter, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new DocuSealAPIError(error.message, { cause: error, method });
		}
		throw new DocuSealAPIError('Unknown DocuSeal error', { method });
	}
}
