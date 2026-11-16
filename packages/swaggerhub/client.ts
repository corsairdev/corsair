import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The registry lives on one host, and every documented path hangs off it. */
export const SWAGGERHUB_API_BASE = 'https://api.swaggerhub.com';

/**
 * SwaggerHub authenticates with an **API key sent in the `Authorization` header
 * as the bare key**, with no `Bearer` prefix. The key is on the account's
 * settings page under API Key.
 *
 * Anonymous calls work for public APIs, but a key is what the plugin sends: the
 * registry answers 401 for a bad key rather than silently narrowing the result.
 */
export class SwaggerhubAPIError extends Error {
	readonly status?: number;
	/** The API's own error code, when the body carries one. */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, when SwaggerHub sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SwaggerhubAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	get isNotFound(): boolean {
		return this.status === 404;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** 400 is a definition or parameter SwaggerHub rejected. */
	get isValidation(): boolean {
		return this.status === 400;
	}

	/** 409 is a name that already exists, or a published version. */
	get isConflict(): boolean {
		return this.status === 409;
	}

	/** 415 is a definition sent with a media type the route does not take. */
	get isUnsupportedMedia(): boolean {
		return this.status === 415;
	}
}

/**
 * Reads a SwaggerHub error body. The registry answers
 * `{ code: 404, message: "Unknown API owner/name:1.0.0" }`, and a gateway can
 * answer an HTML page instead, so the fallback matters.
 * unknown: the body is untyped until the guards here narrow it.
 */
export function describeSwaggerhubError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): { message: string; code?: number } {
	const record = asRecord(body);
	const text =
		typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: typeof record?.error === 'string' && record.error.length > 0
				? record.error
				: fallback;
	const code = typeof record?.code === 'number' ? record.code : undefined;
	const prefix = status === undefined ? '' : `SwaggerHub ${status}: `;
	return { message: `${prefix}${text}`, code };
}

export type SwaggerhubRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path after the host, e.g. `/apis`. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	/** A JSON body, serialized with the JSON media type. */
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * A raw definition body: YAML or JSON text sent as the request body with its
	 * own media type. SwaggerHub takes the definition itself here, not a wrapper.
	 */
	definition?: { content: string; mediaType: string };
};

/** SwaggerHub answers `owner/api` with slashes in a name, so each segment is encoded. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Joins `owner`, `api` and an optional version into the path SwaggerHub expects.
 * The owner is case-sensitive, so the value is never normalised.
 */
export function specPath(
	kind: 'apis' | 'domains' | 'templates',
	owner: string,
	name: string,
	version?: string,
): string {
	const base = `/${kind}/${segment(owner)}/${segment(name)}`;
	return version === undefined ? base : `${base}/${segment(version)}`;
}

/**
 * Sends one request. The key goes in `Authorization` **without a prefix**, which
 * is what the vendor documents, and a raw definition body keeps its own media
 * type so YAML is never re-quoted as JSON.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeSwaggerhubRequest(
	apiKey: string,
	{ method, path, query, body, definition }: SwaggerhubRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: SWAGGERHUB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: definition ? definitionBody(definition) : body,
		mediaType: definition
			? definition.mediaType
			: body === undefined
				? undefined
				: 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw toSwaggerhubApiError(error);
		if (error instanceof SwaggerhubAPIError) throw error;
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SwaggerhubAPIError(error.message, { cause: error, method });
		}
		throw new SwaggerhubAPIError('Unknown SwaggerHub error', { method });
	}
}

/**
 * Core JSON-encodes every body sent with a JSON media type, so a JSON definition
 * passed as text would arrive as one quoted string. It is parsed here and core
 * encodes it once. YAML and other text go through as they are.
 * unknown: a parsed JSON definition is any JSON value.
 */
function definitionBody(definition: {
	content: string;
	mediaType: string;
}): unknown {
	if (!definition.mediaType.includes('/json')) return definition.content;
	try {
		return JSON.parse(definition.content);
	} catch {
		throw new SwaggerhubAPIError(
			'[swaggerhub] definition is not valid JSON; send YAML with format: "yaml"',
		);
	}
}

/**
 * Core's `ApiError` goes through (R8): its `status` and `retryAfter` are what
 * core's 429 retry and the error handlers read. It is rebuilt only to drop the
 * sent body and query (a whole API definition) and to carry SwaggerHub's own
 * message.
 */
function toSwaggerhubApiError(error: ApiError): ApiError {
	const described = describeSwaggerhubError(
		error.status,
		error.body,
		error.message,
	);
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
			body: error.body,
		},
		described.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
