import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Postiz Cloud. A self-hosted instance uses `https://<your-domain>/api/public/v1`. */
export const POSTIZ_API_BASE = 'https://api.postiz.com/public/v1';

/**
 * The create-post route allows 90 requests an hour on a self-hosted instance and
 * 100 on the cloud, and that budget is the whole instance's. The API documents
 * no Retry-After, so handlers own the retries.
 */
const POSTIZ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Postiz answers two error shapes. Its own handlers send `{ msg }`, as in
 * `{"msg":"Invalid API key"}`. A route that does not exist is caught by NestJS
 * and answered as `{ message, error, statusCode }`. Both are read here so a
 * handler can match on either.
 */
export class PostizAPIError extends Error {
	readonly status?: number;
	/** The API's own short reason, such as `Unauthorized`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Postiz sent one. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached Postiz (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when Postiz rejected the key rather than the request. */
	readonly credentialsRejected: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			credentialsRejected?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PostizAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
	}
}

/** Unparsed bodies: an error body before a guard narrows it, and a response
 * body before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

function asRecord(value: Untyped): Record<string, Untyped> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, Untyped>)
		: undefined;
}

function readString(
	record: Record<string, Untyped> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** The API's `msg` on its own errors, or NestJS's `message` on a missing route. */
export function readErrorMessage(body: Untyped): string | undefined {
	const record = asRecord(body);
	return readString(record, 'msg') ?? readString(record, 'message');
}

/** NestJS's `error` label, such as `Not Found`; absent on the `{ msg }` shape. */
export function readErrorLabel(body: Untyped): string | undefined {
	return readString(asRecord(body), 'error');
}

const CREDENTIAL_MESSAGE = /api key/i;

/**
 * Both documented key rejections arrive as a 401 with a message naming the key:
 * `No API Key found` and `Invalid API key`. A 403 is a key that is valid but
 * does not own the resource, which is a permission problem rather than a
 * credential one, so it is not flagged here.
 */
export function isCredentialRejection(
	status: number | undefined,
	body: Untyped,
): boolean {
	if (status !== 401) return false;
	const message = readErrorMessage(body);
	return message !== undefined && CREDENTIAL_MESSAGE.test(message);
}

export function describePostizError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	const message = readErrorMessage(body) ?? fallback;
	const label = [status, readErrorLabel(body)]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Postiz ${label}: ${message}` : message;
}

export type PostizQuery = Record<string, string | number | boolean | undefined>;

export type PostizRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: PostizQuery;
	// unknown: each endpoint's input schema has already validated the body.
	body?: Untyped;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makePostizRequest(
	apiKey: string,
	{ method, path, query, body }: PostizRequest,
): Promise<Untyped> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('postiz', 'api_key');
	}
	if (/[\r\n]/.test(apiKey)) {
		throw new PostizAPIError('The API key must not contain newlines');
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		// The raw key, with no scheme prefix, is what Postiz documents.
		Authorization: apiKey,
	};
	if (body !== undefined) headers['Content-Type'] = 'application/json';

	const config: OpenAPIConfig = {
		BASE: POSTIZ_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the caller's output schema parses the body returned here.
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: POSTIZ_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new PostizAPIError(
				describePostizError(error.status, error.body, error.statusText),
				{
					status: error.status,
					code: readErrorLabel(error.body),
					retryAfter: error.retryAfter,
					method,
					credentialsRejected: isCredentialRejection(error.status, error.body),
				},
			);
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PostizAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PostizAPIError('Unknown Postiz error', {
			method,
			transport: true,
		});
	}
}
