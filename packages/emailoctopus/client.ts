import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const EMAILOCTOPUS_API_BASE = 'https://api.emailoctopus.com';

// Docs: https://emailoctopus.com/api-documentation/v2#section/Rate-limiting
// 429 sends X-RateLimit-Retry-After. X-RateLimiting-Remaining is the token
// count, not a delay, so it is not used as Retry-After.
const EMAILOCTOPUS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'x-ratelimit-retry-after' },
};

// unknown: the body is an untyped error payload until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export class EmailOctopusAPIError extends Error {
	readonly status?: number;
	/** RFC 7807 type URL, when EmailOctopus sent one. */
	readonly type?: string;
	/** Milliseconds from X-RateLimit-Retry-After, when the header was an integer. */
	readonly retryAfter?: number;
	readonly method?: string;
	// unknown: error bodies are usually problem+json, but a proxy can answer
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
		this.name = 'EmailOctopusAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.type = readString(asRecord(this.body), 'type');
	}

	get isRateLimit(): boolean {
		return (
			this.status === 429 || this.type?.endsWith('#too-many-requests') === true
		);
	}
}

// A 422 says only "Unprocessable content." in detail; the reason is in
// errors[], one { pointer, detail } per rejected attribute.
// unknown: errors is part of the untyped error body.
function readFieldErrors(errors: unknown): string[] {
	if (!Array.isArray(errors)) return [];
	return errors.flatMap((item) => {
		const entry = asRecord(item);
		const detail = readString(entry, 'detail');
		if (!detail) return [];
		const pointer = readString(entry, 'pointer');
		return [pointer ? `${pointer}: ${detail}` : detail];
	});
}

// unknown: see EmailOctopusAPIError.
export function describeEmailOctopusError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'detail') ?? readString(record, 'title') ?? fallback;
	const label =
		status !== undefined ? `EmailOctopus ${status}` : 'EmailOctopus';
	const fieldErrors = readFieldErrors(record?.errors);
	return fieldErrors.length > 0
		? `${label}: ${text} ${fieldErrors.join('; ')}`
		: `${label}: ${text}`;
}

export type EmailOctopusQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type EmailOctopusRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: EmailOctopusQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
// Undefined for 204.
export async function makeEmailOctopusRequest(
	apiKey: string,
	{ method, path, query, body }: EmailOctopusRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: EMAILOCTOPUS_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
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
			rateLimitConfig: EMAILOCTOPUS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new EmailOctopusAPIError(
				describeEmailOctopusError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		if (error instanceof Error || error instanceof DOMException) {
			throw new EmailOctopusAPIError(error.message, { cause: error, method });
		}
		throw new EmailOctopusAPIError('Unknown EmailOctopus error', { method });
	}
}
