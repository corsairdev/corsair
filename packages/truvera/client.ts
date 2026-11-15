import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TRUVERA_API_BASE = 'https://api.truvera.io';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`.
const TRUVERA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Truvera answers an error as `{ status, type, message, errors: [{ path,
 * message }] }`. The `type` is `ServerError` for most failures, so the status is
 * what distinguishes them and `errors` says which field was wrong.
 */
export class TruveraAPIError extends Error {
	readonly status?: number;
	/** The provider's error type, usually `ServerError`. */
	readonly type?: string;
	/** Per-field messages, when the provider named the offending fields. */
	readonly errors?: { path?: string; message?: string }[];
	/** Milliseconds from a Retry-After header, when Truvera sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			type?: string;
			errors?: { path?: string; message?: string }[];
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TruveraAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const body = asRecord(cause?.body);
		this.type =
			options.type ?? (typeof body?.type === 'string' ? body.type : undefined);
		this.errors = options.errors ?? readErrors(cause?.body);
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** The plan's transaction limit is reached; no retry can fix it. */
	get isPaymentRequired(): boolean {
		return this.status === 402;
	}

	/** True when the field-level errors named a path, which a caller can act on. */
	get hasFieldErrors(): boolean {
		return (this.errors ?? []).some((entry) => entry.path !== undefined);
	}
}

// unknown: the error body is untyped until `errors` is read as an array.
function readErrors(
	body: unknown,
): { path?: string; message?: string }[] | undefined {
	const errors = asRecord(body)?.errors;
	if (!Array.isArray(errors)) return undefined;
	return errors.flatMap((entry) => {
		const record = asRecord(entry);
		if (!record) return [];
		return [
			{
				path: typeof record.path === 'string' ? record.path : undefined,
				message:
					typeof record.message === 'string' ? record.message : undefined,
			},
		];
	});
}

export function describeTruveraError(
	status: number | undefined,
	// unknown: the error body is the documented envelope or a proxy page.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message =
		(typeof record?.message === 'string' && record.message) || fallback;
	const errors = readErrors(body) ?? [];
	const detail = errors
		.map((entry) =>
			entry.path === undefined
				? entry.message
				: `${entry.path}: ${entry.message}`,
		)
		.filter((entry): entry is string => entry !== undefined)
		.join('; ');
	const summary =
		status === undefined ? message : `Truvera ${status}: ${message}`;
	return detail ? `${summary} (${detail})` : summary;
}

export type TruveraQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TruveraRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: TruveraQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeTruveraRequest(
	apiKey: string,
	{ method, path, query, body }: TruveraRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TRUVERA_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
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
			rateLimitConfig: TRUVERA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof TruveraAPIError) throw error;
		if (error instanceof ApiError) {
			throw new TruveraAPIError(
				describeTruveraError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TruveraAPIError(error.message, { cause: error, method });
		}
		throw new TruveraAPIError('Unknown Truvera error', { method });
	}
}
