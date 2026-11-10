import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KLAVIYO_API_BASE = 'https://a.klaviyo.com';

/**
 * Klaviyo versions its API by a date sent in the `revision` header, and every
 * request must carry one. This matches the spec the plugin was built from
 * (`openapi/stable.json`, `info.version`).
 */
export const KLAVIYO_REVISION = '2026-10-15';

/**
 * Klaviyo answers JSON:API, so every body has its own media type and a request
 * without it is rejected.
 */
const KLAVIYO_MEDIA_TYPE = 'application/vnd.api+json';

const KLAVIYO_TIMEOUT_MS = 30_000;

/** One entry of Klaviyo's `errors` array. */
export type KlaviyoErrorEntry = {
	status?: number;
	code?: string;
	title?: string;
	detail?: string;
	/** A JSON pointer to the offending field, such as `/data/`. */
	source?: { pointer?: string; parameter?: string };
};

/**
 * Klaviyo reports failures as `{ errors: [ { status, code, title, detail } ] }`,
 * where `code` is the machine-readable half such as `authentication_failed` or
 * `rate_limit_exceeded`. `readErrors` reads them.
 *
 * A string body is parsed here: `corsair/http` only parses `application/json`
 * and `application/problem+json`, and Klaviyo answers `application/vnd.api+json`,
 * so the shared client hands the raw text back. Without this, every Klaviyo
 * error would read as a bare status.
 */
// unknown: the body is untrusted JSON, sometimes still unparsed.
export function readErrors(body: unknown): KlaviyoErrorEntry[] {
	const parsed = typeof body === 'string' ? parseJson(body) : body;
	const list = asRecord(parsed)?.errors;
	if (!Array.isArray(list)) return [];
	return list.flatMap((entry) => {
		const record = asRecord(entry);
		if (!record) return [];
		const source = asRecord(record.source);
		const status = record.status;
		const pointer = source?.pointer;
		const parameter = source?.parameter;
		return [
			{
				status: typeof status === 'number' ? status : undefined,
				code: typeof record.code === 'string' ? record.code : undefined,
				title: typeof record.title === 'string' ? record.title : undefined,
				detail: typeof record.detail === 'string' ? record.detail : undefined,
				source: {
					pointer: typeof pointer === 'string' ? pointer : undefined,
					parameter: typeof parameter === 'string' ? parameter : undefined,
				},
			},
		];
	});
}

/** JSON.parse that returns undefined instead of throwing. */
// unknown: the text is provider output and may not be JSON at all.
function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

/** The first error's message, or undefined when the body carried none. */
// unknown: the untyped error body, read through readErrors.
export function readErrorText(body: unknown): string | undefined {
	const [first] = readErrors(body);
	return first?.detail ?? first?.title;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Klaviyo sets it on a 429.
const KLAVIYO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Klaviyo failure. `code` is the first entry's machine-readable code, such as
 * `rate_limit_exceeded` or `authentication_failed`.
 */
export class KlaviyoAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Klaviyo sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Every error entry Klaviyo returned, which can be more than one. */
	readonly errors?: KlaviyoErrorEntry[];
	// unknown: error bodies are the JSON:API shape above, but a proxy can answer
	// with HTML or text.
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
		this.name = 'KlaviyoAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.method = options.method ?? cause?.request.method;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const errors = readErrors(options.body ?? cause?.body);
		this.errors = errors.length > 0 ? errors : undefined;
		this.code = errors[0]?.code;
		// Only the provider's own error entries are kept: a request body carries
		// profile data, and ApiError does not redact a body.
		this.body =
			errors.length > 0
				? {
						errors: errors.map((entry) => ({
							code: entry.code,
							title: entry.title,
							detail: entry.detail,
						})),
					}
				: undefined;
	}
}

// unknown: see KlaviyoAPIError.
export function describeKlaviyoError(
	status: number | undefined,
	body: unknown, // unknown: the untyped error body, read field by field.
	fallback: string,
): string {
	const [first] = readErrors(body);
	const text = first?.detail ?? first?.title ?? fallback;
	const label = [status, first?.code]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Klaviyo ${label}: ${text}` : text;
}

/**
 * A status-only description, safe to pass as the fallback above.
 *
 * The shared client's own message must never be that fallback: for a status
 * outside its fixed map it embeds the whole response body, and a rejected
 * profile write echoes what was sent.
 */
export function statusOnlyDescription(
	status: number | undefined,
	statusText: string | undefined,
): string {
	if (status === undefined) return 'request failed';
	return statusText ? `request failed (${statusText})` : 'request failed';
}

export type KlaviyoQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type KlaviyoRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: KlaviyoQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Overrides the media type when a route answers something other than JSON. */
	mediaType?: string;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeKlaviyoRequest(
	apiKey: string,
	{ method, path, query, body, mediaType }: KlaviyoRequest,
): Promise<unknown> {
	// unknown: callers parse it with a zod output schema.
	// unknown: see the comment above.

	const config: OpenAPIConfig = {
		BASE: KLAVIYO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KLAVIYO_TIMEOUT_MS,
		HEADERS: {
			// A private key, not a bearer token: Klaviyo wants its own scheme.
			Authorization: `Klaviyo-API-Key ${apiKey}`,
			revision: KLAVIYO_REVISION,
			Accept: KLAVIYO_MEDIA_TYPE,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType:
			body === undefined ? undefined : (mediaType ?? KLAVIYO_MEDIA_TYPE),
	};

	try {
		// unknown: the body is untyped here; callers parse it with a zod schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KLAVIYO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is dropped: `cause` is non-enumerable, but util.inspect
			// follows it, and ApiError.body holds the whole response.
			throw new KlaviyoAPIError(
				describeKlaviyoError(
					error.status,
					error.body,
					// Never error.message: on an unmapped status it embeds the body.
					statusOnlyDescription(error.status, error.statusText),
				),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method ?? method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new KlaviyoAPIError(error.message, { cause: error, method });
		}
		throw new KlaviyoAPIError('Unknown Klaviyo error', { method });
	}
}
