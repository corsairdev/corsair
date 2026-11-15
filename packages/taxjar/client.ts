import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TAXJAR_API_BASE = 'https://api.taxjar.com/v2';

/**
 * TaxJar answers failures as `{ detail, status, error }`, and `error` is a
 * short label such as "Unauthorized" or "Not Found". The `detail` names the
 * route it refused, so it is the useful half of the message.
 * https://developers.taxjar.com/api/reference/
 */
export class TaxJarAPIError extends Error {
	readonly status?: number;
	/** TaxJar's short label: "Unauthorized", "Not Found", "Unprocessable Entity". */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when TaxJar sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TaxJarAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. TaxJar documents a 429 with no stated
// header.
const TAXJAR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

type TaxJarErrorDetails = { detail?: string; code?: string };

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of TaxJar's JSON envelope.
function readErrorDetails(body: unknown): TaxJarErrorDetails {
	const record = asRecord(body);
	if (!record) return {};
	const detail = record.detail;
	const error = record.error;
	return {
		detail:
			typeof detail === 'string' && detail.length > 0 ? detail : undefined,
		code: typeof error === 'string' && error.length > 0 ? error : undefined,
	};
}

// unknown: same open error body as readErrorDetails.
export function describeTaxJarError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const details = readErrorDetails(body);
	const text = details.detail ?? fallback;
	const label = [status, details.code].filter((p) => p !== undefined).join(' ');
	return label ? `TaxJar ${label}: ${text}` : text;
}

/**
 * TaxJar sends money and tax rates as JSON **strings** on transactions and
 * rates (`"16.5"`, `"0.0625"`), but as numbers inside the `taxes` answer. The
 * schemas model each response as it actually arrives; this helper reads either
 * form so a schema can accept a value that changes type between routes.
 */
export function readNumber(value: number | string | null | undefined) {
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}
	return undefined;
}

export type TaxJarQuery = Record<string, string | number | boolean | undefined>;

export type TaxJarRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: TaxJarQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the 204 answers on the deletes.
export async function makeTaxJarRequest(
	apiKey: string,
	{ method, path, query, body }: TaxJarRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TAXJAR_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The docs accept `Authorization: Bearer <key>` or `Token token="<key>"`.
		// TOKEN renders the Bearer form.
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TAXJAR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const details = readErrorDetails(error.body);
			throw new TaxJarAPIError(
				describeTaxJarError(error.status, error.body, error.message),
				{ cause: error, code: details.code },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TaxJarAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TaxJarAPIError('Unknown TaxJar error', { method });
	}
}
