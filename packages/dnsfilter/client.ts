import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// One production host; the API version lives in the path.
export const DNSFILTER_API_BASE = 'https://api.dnsfilter.com';

// v1 errors are `{ error, type }`, v2 errors are `{ error: { message, type } }`.
export class DnsfilterAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly type?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'DnsfilterAPIError';
	}

	isRateLimitError(): boolean {
		return this.status === 429;
	}
}

export type DnsfilterRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Values for `{placeholders}` in the path.
	path?: Record<string, string | number>;
	// Nested objects become `key[subkey]` pairs. Values are heterogeneous
	// (strings, numbers, booleans, nested page objects) and already validated
	// by the endpoint's zod input schema, so `unknown` avoids per-key casts.
	query?: Record<string, unknown>;
	// `unknown` because bodies differ per endpoint (plain object, JSON:API
	// envelope, nested document). The endpoint's zod input schema is the single
	// source of truth for the shape, so restating it here would duplicate it.
	body?: unknown;
};

// Arbitrary JSON from the API: keys cannot be typed statically, so callers
// narrow the returned record field by field.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	// Safe: typeof object + non-null + non-array is exactly what the cast asserts.
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// Error JSON differs by version (v1 `{ error, type }`, v2 `{ error: {...} }`),
// so it is probed with typeof instead of being modelled.
function extractErrorMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	if (!record) return undefined;
	const error = record.error;
	if (typeof error === 'string' && error.length > 0) return error;
	const nestedError = asRecord(error);
	if (typeof nestedError?.message === 'string') return nestedError.message;
	if (typeof record.message === 'string') return record.message;
	return undefined;
}

// Same untyped error JSON as above; only `type` is read.
function extractErrorType(body: unknown): string | undefined {
	const record = asRecord(body);
	if (!record) return undefined;
	if (typeof record.type === 'string') return record.type;
	const nestedError = asRecord(record.error);
	if (typeof nestedError?.type === 'string') return nestedError.type;
	return undefined;
}

function withoutUndefined(
	// Query values are validated per endpoint; the transport only strips empty
	// entries, so it cannot type them more narrowly.
	input: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (!input) return undefined;
	const entries = Object.entries(input).filter(
		([, value]) => value !== undefined && value !== null,
	);
	return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

// Drops only undefined: null clears a field and arrays pass through.
function withoutUndefinedBody(body: unknown): unknown {
	if (!body || typeof body !== 'object') return body;
	if (Array.isArray(body)) return body;
	// Safe: the guard above proves a non-array object, so its entries are
	// string-keyed.
	const entries = Object.entries(body as Record<string, unknown>).filter(
		([, value]) => value !== undefined,
	);
	return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

// Anything the fetch/zod layer can throw; narrowed with instanceof below.
function toDnsfilterError(error: unknown): Error {
	if (error instanceof ApiError) {
		return new DnsfilterAPIError(
			extractErrorMessage(error.body) ?? error.message,
			error.status,
			extractErrorType(error.body),
			error.retryAfter,
		);
	}
	if (error instanceof Error) {
		return new DnsfilterAPIError(error.message);
	}
	return new DnsfilterAPIError('Unknown DNSFilter API error');
}

// Shared transport. DNSFilter wants the raw key, not `Bearer <key>`.
export async function makeDnsfilterRequest<T>(
	endpoint: string,
	apiKey: string,
	options: DnsfilterRequestOptions = {},
): Promise<T> {
	const { method = 'GET', path, query, body } = options;

	const config: OpenAPIConfig = {
		BASE: DNSFILTER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// No TOKEN: the shared client would send `Bearer <key>`.
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query: withoutUndefined(query),
		body: withoutUndefinedBody(body),
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		throw toDnsfilterError(error);
	}
}
