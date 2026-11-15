import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TAPFILIATE_API_BASE = 'https://api.tapfiliate.com/1.6';

/**
 * Tapfiliate answers failures in two envelopes, and the shape depends on how
 * early the request failed:
 *
 * - `{ message, code }` for authentication, from the gateway.
 * - `{ message, code, traceId }` for a rejected or unknown request.
 * - `{ errors: [{ message, code?, property_path? }] }` for business and
 *   validation errors, where `code` is machine-readable (`commission_approved`)
 *   and `property_path` names the rejected field.
 *
 * https://developers.tapfiliate.com/api-reference/errors
 */
export class TapfiliateAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code from either envelope, e.g. `commission_approved`. */
	readonly code?: string;
	/**
	 * The validation messages, one per rejected field, when Tapfiliate sent the
	 * `errors` envelope. Empty for the single-message envelopes.
	 */
	readonly errors: Array<{
		message: string;
		code?: string;
		property_path?: string;
	}>;
	/** Tapfiliate's request id, so support can find the call. */
	readonly traceId?: string;
	/** Milliseconds from a Retry-After header, when Tapfiliate sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			errors?: Array<{
				message: string;
				code?: string;
				property_path?: string;
			}>;
			traceId?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TapfiliateAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code;
		this.errors = options.errors ?? [];
		this.traceId = options.traceId;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Tapfiliate documents 429 without a
// Retry-After header: the docs say to wait until X-RateLimit-Reset, which the
// client cannot read alongside the body, so the handler falls back to a fixed
// window.
const TAPFILIATE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

type TapfiliateErrorDetails = {
	message?: string;
	code?: string;
	traceId?: string;
	errors: Array<{ message: string; code?: string; property_path?: string }>;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of either JSON envelope.
function readErrorDetails(body: unknown): TapfiliateErrorDetails {
	const record = asRecord(body);
	if (!record) return { errors: [] };

	const errors: Array<{
		message: string;
		code?: string;
		property_path?: string;
	}> = [];
	if (Array.isArray(record.errors)) {
		for (const entry of record.errors) {
			const item = asRecord(entry);
			const message = item?.message;
			if (typeof message !== 'string' || message.length === 0) continue;
			const code = item?.code;
			const propertyPath = item?.property_path;
			errors.push({
				message,
				code: typeof code === 'string' ? code : undefined,
				property_path:
					typeof propertyPath === 'string' ? propertyPath : undefined,
			});
		}
	}

	const message = record.message;
	const code = record.code;
	const traceId = record.traceId;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		// The single-message envelopes send a number; the errors envelope sends
		// a string. Keep the string form either way so one field serves both.
		code: typeof code === 'string' ? code : undefined,
		traceId:
			typeof traceId === 'string' && traceId.length > 0 ? traceId : undefined,
		errors,
	};
}

// unknown: same open error body as readErrorDetails.
export function describeTapfiliateError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const details = readErrorDetails(body);
	// The errors envelope has no top-level message, so its first entry is the
	// one to show; the whole list stays on the error.
	const text = details.message ?? details.errors[0]?.message ?? fallback;
	const errorCode = details.code ?? details.errors[0]?.code;
	const label = [status, errorCode].filter((p) => p !== undefined).join(' ');
	return label ? `Tapfiliate ${label}: ${text}` : text;
}

export type TapfiliateQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TapfiliateRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: TapfiliateQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the 204 answers on the deletes.
export async function makeTapfiliateRequest(
	apiKey: string,
	{ method, path, query, body }: TapfiliateRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TAPFILIATE_API_BASE,
		VERSION: '1.6',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'X-Api-Key': apiKey },
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
			rateLimitConfig: TAPFILIATE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const details = readErrorDetails(error.body);
			throw new TapfiliateAPIError(
				describeTapfiliateError(error.status, error.body, error.message),
				{
					cause: error,
					code: details.code ?? details.errors[0]?.code,
					errors: details.errors,
					traceId: details.traceId,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TapfiliateAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TapfiliateAPIError('Unknown Tapfiliate error', { method });
	}
}
