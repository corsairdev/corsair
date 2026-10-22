import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * DNSFilter serves every operation from a single production host. Versioning is
 * per-path (`/v1/...`, `/v2/...`), so requests carry absolute paths.
 */
export const DNSFILTER_API_BASE = 'https://api.dnsfilter.com';

/**
 * Normalised DNSFilter error. DNSFilter v1 returns `{ error, type }` and v2
 * returns `{ error: { message, type } }`, so both shapes are flattened here.
 */
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
	/** Values substituted into `{placeholders}` in the path. */
	path?: Record<string, string | number>;
	/** Query string values; nested objects become `key[subkey]` pairs. */
	query?: Record<string, unknown>;
	body?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

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

function extractErrorType(body: unknown): string | undefined {
	const record = asRecord(body);
	if (!record) return undefined;
	if (typeof record.type === 'string') return record.type;
	const nestedError = asRecord(record.error);
	if (typeof nestedError?.type === 'string') return nestedError.type;
	return undefined;
}

function withoutUndefined(
	input: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (!input) return undefined;
	const entries = Object.entries(input).filter(
		([, value]) => value !== undefined && value !== null,
	);
	return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

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

/**
 * Single transport used by every endpoint. DNSFilter authenticates with the raw
 * API key in the `Authorization` header (no `Bearer` prefix).
 */
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
		TOKEN: apiKey,
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
		body: withoutUndefined(asRecord(body) ?? undefined),
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		throw toDnsfilterError(error);
	}
}
