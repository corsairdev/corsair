import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
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
/**
 * VSCO Workspace labels JSON answers `text/html` (seen on its 401s), and core
 * parses only JSON content types, so a JSON object or array that arrives as
 * text is parsed here. HTML and other text are left as they are.
 * unknown: the body is whatever core resolved.
 */
export function parseJsonText(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	const text = body.trim();
	if (!text.startsWith('{') && !text.startsWith('[')) return body;
	try {
		return JSON.parse(text);
	} catch {
		return body;
	}
}

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
	const text = readErrorMessage(parseJsonText(body)) ?? fallback;
	return status === undefined ? text : `VSCO Workspace ${status}: ${text}`;
}

/**
 * Encodes one path segment. IDs are ULIDs; a `.` or `..` id is refused so a URL
 * parser cannot resolve it to a parent path.
 */
export function segment(value: string | number): string {
	const text = String(value);
	if (text === '.' || text === '..') {
		throw new Error(`[tave] "${text}" is not a valid id`);
	}
	return encodeURIComponent(text);
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
		// Core's default config retries a 429 three times (R8).
		const response = parseJsonText(
			await request<unknown>(config, requestOptions),
		);
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
		if (error instanceof ApiError) throw toTaveApiError(error);
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

/**
 * Core's `ApiError` goes through (R8): its `status` and `retryAfter` are what
 * core's 429 retry and the error handlers read. It is rebuilt only to drop the
 * sent body and query (client names, notes, payment memos) and to carry VSCO
 * Workspace's own message.
 */
function toTaveApiError(error: ApiError): ApiError {
	let url = error.url;
	try {
		const parsed = new URL(error.url);
		parsed.search = '';
		url = parsed.toString();
	} catch {
		// A relative or empty url carries no query to drop.
	}
	return new ApiError(
		{
			...error.request,
			body: undefined,
			formData: undefined,
			query: undefined,
		},
		{
			url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: parseJsonText(error.body),
		},
		describeTaveError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
