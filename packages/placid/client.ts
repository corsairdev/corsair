import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PLACID_API_BASE = 'https://api.placid.app/api/rest';

// A render is queued, not done, so the reply arrives long before the work
// finishes and the request itself is quick. Media and font uploads carry a
// file, so they get a wider window than the 20 second default.
const PLACID_TIMEOUT_MS = 30_000;

// Placid allows 60 requests per minute and answers 429 when it is exceeded.
// error-handlers.ts owns the retry, so the client makes a single attempt and
// only surfaces the status and Retry-After.
const PLACID_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// Placid answers a failed request with `{ message }`, and a validation error
// with `{ message, errors: { field: [messages] } }` from Laravel.
function readMessage(
	// unknown: an error body stays untyped until asRecord narrows it.
	body: unknown,
): string | undefined {
	const record = asRecord(body);
	// A 422 carries both: `message` is Laravel's generic "The given data was
	// invalid.", while `errors` names the field that failed. The field text is
	// the useful one, so it is read first.
	const errors = asRecord(record?.errors);
	if (errors) {
		const first = Object.values(errors).flat()[0];
		if (typeof first === 'string' && first.length > 0) return first;
	}
	const message = record?.message;
	return typeof message === 'string' && message.length > 0
		? message
		: undefined;
}

export class PlacidAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Placid sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Per-field validation messages, when Placid rejected the input. */
	readonly validationErrors?: Record<string, string[]>;
	// unknown: error bodies are usually `{ message }`, but a proxy can answer
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
		this.name = 'PlacidAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.validationErrors = readValidationErrors(this.body);
	}
}

// unknown: see PlacidAPIError.
function readValidationErrors(
	body: unknown,
): Record<string, string[]> | undefined {
	const errors = asRecord(asRecord(body)?.errors);
	if (!errors) return undefined;
	const result: Record<string, string[]> = {};
	for (const [field, value] of Object.entries(errors)) {
		const messages = (Array.isArray(value) ? value : [value]).filter(
			(item): item is string => typeof item === 'string',
		);
		if (messages.length > 0) result[field] = messages;
	}
	return Object.keys(result).length > 0 ? result : undefined;
}

// unknown: see PlacidAPIError.
export function describePlacidError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readMessage(body) ?? fallback;
	return status ? `Placid ${status}: ${text}` : text;
}

export type PlacidQuery = Record<string, string | number | boolean | undefined>;

export type PlacidRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: PlacidQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * Multipart uploads (media and fonts) send this instead of `body`.
	 * unknown: parts are a File plus caller-chosen string keys, and the
	 * request builder stringifies whatever else it finds.
	 */
	formData?: Record<string, unknown>;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Placid pages by opaque cursor and hands back a whole URL in `links.next`.
 * A caller may pass that URL or just its `cursor` value, so both are accepted
 * and reduced to the token the endpoint sends.
 */
export function cursorParam(value: string): string {
	const marker = 'cursor=';
	const at = value.indexOf(marker);
	if (at === -1) return value;
	const rest = value.slice(at + marker.length);
	const end = rest.search(/[&#]/);
	return end === -1 ? rest : rest.slice(0, end);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the 204 that deleting an image, PDF, video, font or collection
// returns, which is why the return type is not narrowed here.
export async function makePlacidRequest(
	apiKey: string,
	{ method, path, query, body, formData }: PlacidRequest,
): Promise<unknown> {
	const isForm = formData !== undefined;

	const config: OpenAPIConfig = {
		BASE: PLACID_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: PLACID_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			// fetch sets the multipart boundary itself, so only JSON declares a type.
			...(isForm ? {} : { 'Content-Type': 'application/json' }),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: isForm ? undefined : body,
		formData,
		mediaType: isForm ? undefined : 'application/json',
	};

	try {
		// unknown: the response is untyped until the caller's output schema
		// parses it; the same line as the return type above.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: PLACID_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new PlacidAPIError(
				describePlacidError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PlacidAPIError(error.message, { cause: error, method });
		}
		throw new PlacidAPIError('Unknown Placid error', { method });
	}
}
