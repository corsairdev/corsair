import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// /api/user0 is the canonical user-API prefix. /api/b2 routes to the same
// controllers, but a translation layer (Api::User0::LegacyB2Fields) renames
// poll fields there (voters_count -> vote_count_eligible and similar), which
// would break the output schemas. Never point requests at /api/b2.
export const LOOMIO_API_BASE = 'https://www.loomio.com/api/user0';

// Loomio has no published rate limit and sends no rate-limit headers. The
// hosted install throttles at 900 requests per 5 minutes per IP (Rack::Attack),
// so retries live in error-handlers.ts with the default backoff. headerNames
// stays for the core contract even though no header is expected.
const LOOMIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type LoomioRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** True when the path names a record id, so a 403 may mean permission. */
	resourceScoped?: boolean;
};

// unknown: the record is an untyped error body; read one field at a time.
function readErrorValue(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | number | undefined {
	const value = record?.[key];
	return typeof value === 'string' || typeof value === 'number'
		? value
		: undefined;
}

/**
 * Renders a Loomio error body as one line. Bodies seen in the docs and source:
 * `{"error":"You are not authorized..."}` (403), `{"error":404}` (missing
 * record, the value is the bare number), `{"error":400}`, and
 * `{"errors":{field:["message"]}}` (422 validation).
 */
export function readLoomioErrorDetail(
	// unknown: the body is one of the open error shapes until a field narrows it.
	body: unknown,
): string | undefined {
	const record = asRecord(body);
	const error = readErrorValue(record, 'error');
	if (error !== undefined) {
		return typeof error === 'number' ? `HTTP ${error}` : error;
	}
	const errors = asRecord(record?.errors);
	if (!errors) return undefined;
	return Object.entries(errors)
		.map(([field, messages]) => {
			const list = Array.isArray(messages)
				? messages.filter((m) => typeof m === 'string').join(', ')
				: '';
			return list.length > 0 ? `${field}: ${list}` : field;
		})
		.join('; ');
}

export function describeLoomioError(
	status: number | undefined,
	// unknown: a provider failure body is one of the shapes readLoomioErrorDetail covers.
	body: unknown,
	resourceScoped: boolean,
): string {
	const detail = readLoomioErrorDetail(body);
	if (status === 403 && resourceScoped) {
		const note =
			'the record may not exist, or the key is valid but lacks permission on it';
		return detail ? `Loomio 403: ${detail} (${note})` : `Loomio 403: ${note}`;
	}
	if (detail) {
		return `Loomio ${status ?? ''}: ${detail}`.replace('Loomio :', 'Loomio:');
	}
	return status === undefined
		? 'Loomio request failed'
		: `Loomio request failed (${status})`;
}

export class LoomioAPIError extends Error {
	readonly status?: number;
	readonly method?: string;
	readonly retryAfter?: number;
	/** Human-readable piece of the provider's error body, when one arrived. */
	readonly detail?: string;
	/** The request named a record id, so a 403 may be permission, not auth. */
	readonly resourceScoped: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			method?: string;
			retryAfter?: number;
			detail?: string;
			resourceScoped?: boolean;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'LoomioAPIError';
		this.status = options.status;
		this.method = options.method;
		this.retryAfter = options.retryAfter;
		this.detail = options.detail;
		this.resourceScoped = options.resourceScoped ?? false;
	}

	/**
	 * Loomio answers a missing or invalid key with 403, not 401, and a
	 * permission denial gets the identical body. A 403 on a call that named no
	 * record reads as an auth failure; on a resource-scoped call both readings
	 * stay open (see `resourceScoped`).
	 */
	get isAuthError(): boolean {
		return this.status === 401 || (this.status === 403 && !this.resourceScoped);
	}

	/** True when the response suggests the named record is missing or invisible. */
	get resourceNotFound(): boolean {
		return this.status === 404 || (this.status === 403 && this.resourceScoped);
	}

	/** GETs can be replayed after a failure; Loomio POSTs are not idempotent. */
	get replaySafe(): boolean {
		return this.method === 'GET';
	}
}

export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeLoomioRequest(
	apiKey: string,
	{ method, path, query, body, resourceScoped = false }: LoomioRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: LOOMIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: LOOMIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof LoomioAPIError) throw error;
		if (error instanceof ApiError) {
			// The key rides in the Authorization header, but the body is still
			// provider-controlled: copy safe scalars only, never the cause or body.
			throw new LoomioAPIError(
				describeLoomioError(error.status, error.body, resourceScoped),
				{
					status: error.status,
					method,
					retryAfter: error.retryAfter,
					detail: readLoomioErrorDetail(error.body),
					resourceScoped,
				},
			);
		}
		// Transport failures never reached Loomio, so the cause holds no body.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LoomioAPIError(error.message, {
				method,
				cause: error,
				resourceScoped,
			});
		}
		throw new LoomioAPIError('Unknown Loomio error', {
			method,
			resourceScoped,
		});
	}
}
