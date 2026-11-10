import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SHIPPO_API_BASE = 'https://api.goshippo.com';

/**
 * The API version this plugin is written against. Shippo keeps every version
 * live and switches behaviour on this header, so a missing one silently means
 * "latest", which would make the pinned schemas drift. Sent on every request.
 */
export const SHIPPO_API_VERSION = '2018-02-08';

// Buying a label waits on the carrier, and a batch purchase fans out across
// dozens of them; Shippo's own guidance is that 20 seconds is not unusual.
const SHIPPO_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Shippo documents per-endpoint per-minute
// limits but not a header, so one is honoured only if it appears.
const SHIPPO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Shippo has two error shapes and they carry different information:
 *
 * - `{ detail: "Token does not exist" }` — authentication, and any route the
 *   router did not match. Auth is checked before routing, so an unknown path
 *   also answers 401, not 404.
 * - `{ <field>: ["is required"], non_field_errors: ["…"] }` — a 400 validation
 *   failure, keyed by field. The spec leaves this as an untyped `BadRequest`,
 *   so it is read structurally here.
 *
 * `code` is the string to branch on: `INVALID_TOKEN` or `VALIDATION_ERROR`.
 *
 * The token travels in the Authorization header only, never the query or body,
 * so `body` is safe to keep and no request copy is retained.
 */
export class ShippoAPIError extends Error {
	readonly status?: number;
	/** `INVALID_TOKEN` for an auth failure, `VALIDATION_ERROR` for a 400. */
	readonly code?: string;
	/** Field-keyed validation messages, as Shippo sent them. */
	readonly fieldErrors?: Record<string, string[]>;
	/** Milliseconds from a Retry-After header, when Shippo sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are the two shapes above, but a gateway can answer
	// with HTML or plain text.
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
		this.name = 'ShippoAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.fieldErrors = readFieldErrors(this.body);
		this.code = this.fieldErrors
			? 'VALIDATION_ERROR'
			: this.status === 401
				? 'INVALID_TOKEN'
				: undefined;
	}

	/** True for the documented per-minute limit. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: the body is untyped JSON until the guards below narrow it.
function readFieldErrors(body: unknown): Record<string, string[]> | undefined {
	const record = asRecord(body);
	if (!record || 'detail' in record) return undefined;
	const out: Record<string, string[]> = {};
	for (const [key, value] of Object.entries(record)) {
		if (Array.isArray(value)) {
			const messages = value.filter(
				(entry): entry is string => typeof entry === 'string',
			);
			if (messages.length > 0) out[key] = messages;
			continue;
		}
		if (typeof value === 'string') out[key] = [value];
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: see ShippoAPIError; the body's shape is unknown until read here.
export function describeShippoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const detail = readString(record, 'detail');
	if (detail) {
		return status ? `Shippo ${status}: ${detail}` : detail;
	}

	const fields = readFieldErrors(body);
	if (fields) {
		// Join the first message per field: Shippo puts the actionable sentence
		// there, and a whole batch of them buries the field name.
		const parts = Object.entries(fields).map(
			([field, messages]) => `${field}: ${messages[0]}`,
		);
		const label = status ? `Shippo ${status}: ` : '';
		return `${label}${parts.join('; ')}`;
	}

	return status ? `Shippo ${status}: ${fallback}` : fallback;
}

export type ShippoQuery = Record<string, string | number | boolean | undefined>;

export type ShippoRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: ShippoQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** `SHIPPO-ACCOUNT-ID`, for a platform account acting on a managed one. */
	shippoAccountId?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeShippoRequest(
	apiKey: string,
	{ method, path, query, body, shippoAccountId }: ShippoRequest,
// unknown: the caller's output schema types whatever comes back.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: SHIPPO_API_BASE,
		VERSION: SHIPPO_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: SHIPPO_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			'SHIPPO-API-VERSION': SHIPPO_API_VERSION,
			...(shippoAccountId ? { 'SHIPPO-ACCOUNT-ID': shippoAccountId } : {}),
		},
	};

	// `Authorization: ShippoToken <token>`, not Bearer: corsair/http's TOKEN
	// renders `Bearer`, so the literal header is the only way to send this.
	const headers = { Authorization: `ShippoToken ${apiKey}` };

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		headers,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: same as the return type above.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SHIPPO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ShippoAPIError) {
			// Thrown by a caller-supplied callback: rethrow untouched so its
			// fields survive.
			throw error;
		}
		if (error instanceof ApiError) {
			// The token is in the Authorization header, which neither the message
			// nor `cause` prints; `request` is still not retained.
			throw new ShippoAPIError(
				describeShippoError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ShippoAPIError(error.message, { cause: error, method });
		}
		throw new ShippoAPIError('Unknown Shippo error', { method });
	}
}
