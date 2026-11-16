import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NEEDLE_API_BASE = 'https://needle.app/api/v1';

// Retries belong to error-handlers.ts. Needle documents a 429 for its
// per-account limits and sends Retry-After with it.
const NEEDLE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the body is an untyped error payload; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Every Needle error is `{ requestId, error, data? }` with no machine-readable
 * code, so the HTTP status is the only classification and `requestId` is what
 * their support asks for. It is kept on the error for that reason.
 */
export class NeedleAPIError extends Error {
	readonly status?: number;
	/** Needle's id for the failed request, quoted to their support. */
	readonly requestId?: string;
	/** Extra detail Needle attached, usually field-level validation. */
	// unknown: `data` has no documented shape; it is the provider's own detail.
	readonly data?: unknown;
	/** Milliseconds from a Retry-After header, when Needle sent one. */
	readonly retryAfter?: number;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			requestId?: string;
			data?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NeedleAPIError';
		this.status = options.status;
		this.requestId = options.requestId;
		this.data = options.data;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** 403 is a key without the scope this route needs, or a plan limit. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}
}

// unknown: see NeedleAPIError.
export function describeNeedleError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'error') ?? fallback;
	const requestId = readString(record, 'requestId');
	const label = status === undefined ? '' : `Needle ${status}: `;
	return requestId
		? `${label}${text} (requestId ${requestId})`
		: `${label}${text}`;
}

export type NeedleQuery = Record<string, string | number | boolean | undefined>;

export type NeedleRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: NeedleQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204.
export async function makeNeedleRequest(
	apiKey: string,
	{ method, path, query, body }: NeedleRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NEEDLE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NEEDLE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new NeedleAPIError(
				describeNeedleError(error.status, error.body, error.message),
				{
					status: error.status,
					requestId: readString(asRecord(error.body), 'requestId'),
					data: asRecord(error.body)?.data,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NeedleAPIError(error.message, { cause: error, method });
		}
		throw new NeedleAPIError('Unknown Needle error', { method });
	}
}

/** Encodes one path segment. Identities can carry `@` and slashes. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
