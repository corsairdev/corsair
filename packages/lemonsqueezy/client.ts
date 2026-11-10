import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LEMONSQUEEZY_API_BASE = 'https://api.lemonsqueezy.com';

/**
 * Lemon Squeezy speaks JSON:API. Its responses are `application/vnd.api+json`,
 * which corsair/http does not treat as JSON (it parses `application/json` and
 * `application/problem+json` only), so every body arrives as a string and is
 * parsed here. Requests must send the same media type back.
 */
export const LEMONSQUEEZY_MEDIA_TYPE = 'application/vnd.api+json';

/**
 * The API answers 300 requests a minute per key, and there is no documented
 * `Retry-After`. error-handlers.ts owns retries, so the client makes one
 * attempt and only keeps the status for the handler.
 */
const LEMONSQUEEZY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** One entry of the JSON:API `errors` array. */
export type LemonSqueezyErrorEntry = {
	status?: string;
	code?: string;
	title?: string;
	detail?: string;
	source?: { pointer?: string; parameter?: string };
};

/**
 * A Lemon Squeezy error. The body and the request are not kept: the key
 * travels in the `Authorization` header, and copying the cause onto this error
 * would put the request back into logs.
 */
export class LemonSqueezyAPIError extends Error {
	readonly status?: number;
	/** The first machine-readable code in the body, when Lemon Squeezy sent one. */
	readonly code?: string;
	/** Every `errors[]` entry, which is how a validation failure names its fields. */
	readonly errors?: LemonSqueezyErrorEntry[];
	/** Milliseconds from a Retry-After header, when one arrived. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			errors?: LemonSqueezyErrorEntry[];
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message);
		this.name = 'LemonSqueezyAPIError';
		this.status = options.status;
		this.code = options.code;
		this.errors = options.errors;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	/** True for the documented 429, with or without a body. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

export type LemonSqueezyRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	/**
	 * JSON:API query parameters, already in bracket form: `page[size]`,
	 * `filter[store_id]`. Values are encoded by corsair/http, which escapes the
	 * brackets as the API expects.
	 */
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Reads the `errors` array from a JSON:API error body. */
export function readErrors(
	// unknown: an error body is untyped JSON until narrowError reads it.
	body: unknown,
): LemonSqueezyErrorEntry[] {
	const parsed = typeof body === 'string' ? parseJson(body) : body;
	const list = asRecord(parsed)?.errors;
	if (!Array.isArray(list)) return [];
	return list.flatMap((entry) => {
		const record = asRecord(entry);
		if (!record) return [];
		const source = asRecord(record.source);
		return [
			{
				status: asString(record.status),
				code: asString(record.code),
				title: asString(record.title),
				detail: asString(record.detail),
				source: source
					? {
							pointer: asString(source.pointer),
							parameter: asString(source.parameter),
						}
					: undefined,
			},
		];
	});
}

function asString(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

/**
 * Lemon Squeezy puts the useful sentence in `detail` and a short label in
 * `title`; a validation failure can carry several entries, each with the field
 * it belongs to in `source.pointer` or `source.parameter`. The fallback is the
 * status line, because an unknown route answers a bare status.
 */
export function describeLemonSqueezyError(
	status: number | undefined,
	statusText: string | undefined,
	// unknown: a provider error body, read through readErrors above.
	body: unknown,
): string {
	const errors = readErrors(body);
	if (errors.length === 0) {
		return status === undefined
			? 'Lemon Squeezy request failed'
			: `Lemon Squeezy request failed (${statusText || status})`;
	}
	const label = [status, errors[0]?.code]
		.filter((p) => p !== undefined)
		.join(' ');
	const parts = errors.map((entry) => {
		const where = entry.source?.parameter ?? entry.source?.pointer;
		const text = entry.detail ?? entry.title ?? 'request failed';
		return where ? `${where}: ${text}` : text;
	});
	return `Lemon Squeezy ${label}: ${parts.join('; ')}`;
}

function configFor(apiKey: string): OpenAPIConfig {
	return {
		BASE: LEMONSQUEEZY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// `TOKEN` renders `Bearer <key>`, which is the documented auth transport.
		TOKEN: apiKey,
		HEADERS: {
			Accept: LEMONSQUEEZY_MEDIA_TYPE,
			'Content-Type': LEMONSQUEEZY_MEDIA_TYPE,
		},
	};
}

/**
 * Runs one request and returns the parsed JSON:API body. The media type is a
 * vendor one, so corsair/http hands back the raw string and it is parsed here;
 * a body that cannot be parsed is reported instead of being returned as text.
 */
export async function makeLemonSqueezyRequest<T>(
	apiKey: string,
	{ method, path, query, body }: LemonSqueezyRequest,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : LEMONSQUEEZY_MEDIA_TYPE,
	};

	try {
		// unknown: the body is `application/vnd.api+json`, so it arrives as a
		// string and only the endpoint's output schema can type it.
		const raw = await request<unknown>(configFor(apiKey), requestOptions, {
			rateLimitConfig: LEMONSQUEEZY_RATE_LIMIT_CONFIG,
		});
		if (typeof raw === 'string') {
			const parsed = parseJson(raw);
			if (parsed === undefined) {
				throw new LemonSqueezyAPIError(
					`Lemon Squeezy answered ${path} with a body that is not JSON`,
					{ status: 200 },
				);
			}
			return parsed as T;
		}
		return raw as T;
	} catch (error) {
		if (error instanceof LemonSqueezyAPIError) throw error;
		if (error instanceof ApiError) {
			// The body may be a string for the same media-type reason.
			const body =
				typeof error.body === 'string' ? parseJson(error.body) : error.body;
			throw new LemonSqueezyAPIError(
				describeLemonSqueezyError(error.status, error.statusText, body),
				{
					status: error.status,
					code: readErrors(body)[0]?.code,
					errors: readErrors(body),
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LemonSqueezyAPIError(error.message, { method });
		}
		throw new LemonSqueezyAPIError('Unknown Lemon Squeezy error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
