import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TAVE_API_BASE = 'https://workspace.vsco.co/api/v2';

/**
 * The API answers failures as `{ error: true, status, message }`, and the same
 * shape covers a refused key and a missing record. A path that does not exist
 * answers **200 with the documentation HTML** rather than a JSON 404, so the
 * client checks the content type and reports an HTML body as a missing route
 * instead of handing the caller a page it cannot parse.
 * https://workspace.vsco.co/api/v2
 */
export class TaveAPIError extends Error {
	readonly status?: number;
	/** True when the route answered HTML, which means the path is not an API route. */
	readonly isHtmlResponse: boolean;
	/** Milliseconds from a Retry-After header, when the API sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			isHtmlResponse?: boolean;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TaveAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.isHtmlResponse = options.isHtmlResponse ?? false;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const TAVE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: the body is untyped until asRecord narrows it; an unexpected route
// answers HTML, which asRecord rejects.
function readErrorMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const message = record?.message;
	return typeof message === 'string' && message.length > 0
		? message
		: undefined;
}

/** True when the body is a document rather than the API's JSON. */
function looksLikeHtml(body: unknown): boolean {
	return typeof body === 'string' && /^\s*<(!doctype|html)/i.test(body);
}

// unknown: same open error body as readErrorMessage.
export function describeTaveError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	if (looksLikeHtml(body)) {
		// A 200 with the docs page means the path is not an API route.
		return `VSCO Workspace answered HTML instead of JSON for a path that is not an API route (status ${status ?? 200}).`;
	}
	const text = readErrorMessage(body) ?? fallback;
	return status === undefined ? text : `VSCO Workspace ${status}: ${text}`;
}

export type TaveQuery = Record<string, string | number | boolean | undefined>;

export type TaveRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: TaveQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless 204 answers.
export async function makeTaveRequest(
	apiKey: string,
	{ method, path, query, body }: TaveRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TAVE_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The docs name both X-API-KEY and a bearer token; the key header is the
		// one the settings page issues.
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the response shape is the endpoint's concern; the caller
		// parses it with its zod output schema.
		const response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: TAVE_RATE_LIMIT_CONFIG,
		});
		// A route that does not exist answers 200 with the docs page, so an HTML
		// body has to become an error rather than a record.
		if (looksLikeHtml(response)) {
			throw new TaveAPIError(
				describeTaveError(200, response, 'Unexpected HTML response'),
				{ isHtmlResponse: true, method },
			);
		}
		return response;
	} catch (error) {
		// Rethrow the HTML error raised above untouched: the ApiError branch
		// would otherwise re-wrap it and lose the flag.
		if (error instanceof TaveAPIError) throw error;
		if (error instanceof ApiError) {
			throw new TaveAPIError(
				describeTaveError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TaveAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TaveAPIError('Unknown VSCO Workspace error', { method });
	}
}
