import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MONEYBIRD_API_BASE = 'https://moneybird.com/api/v2';

/**
 * Moneybird paths carry the administration id: /api/v2/{administration_id}/...
 * The id is stored beside the token; administrations.list sits above the
 * administration scope and needs none.
 */
export type MoneybirdCallContext = {
	key: string;
	options: { administrationId?: string };
	keys: {
		get_administration_id: () => Promise<string | null | undefined>;
	};
};

/** Moneybird ids are large integers the docs say to treat as strings. */
export function asMoneybirdId(value: string | number): string {
	return String(value);
}

/** Throws before sending when no administration id is configured. */
export async function resolveAdministrationId(
	ctx: MoneybirdCallContext,
): Promise<string> {
	const value =
		ctx.options.administrationId ?? (await ctx.keys.get_administration_id());
	if (typeof value !== 'string' || !/^\d+$/.test(value)) {
		throw new Error(
			'Moneybird administration_id is required: pass administrationId in the plugin options or save it on the account.',
		);
	}
	return value;
}

/**
 * Moneybird errors: 400 and 422 carry the validation errors in the body,
 * 401 answers `{"error":"access token invalid","symbolic":{...}}` (probed),
 * 402 means the account limit is reached, 403 an IP blacklist, 429 the
 * documented throttle of 150 requests per 5 minutes per IP.
 */
export class MoneybirdAPIError extends Error {
	readonly status?: number;
	/** The `error` field of the body, e.g. `access token invalid`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Moneybird sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the failed request can be sent again after a 5xx. */
	readonly replayable?: boolean;
	// unknown: the body is an untyped error body until narrowed below.
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
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MoneybirdAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.code = readErrorCode(this.body);
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.replayable = options.replayable;
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: the body is an untyped error body; read one field at a time.
function readErrorCode(body: unknown): string | undefined {
	return readString(asRecord(body), 'error');
}

export function describeMoneybirdError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'error') ?? readString(record, 'message') ?? fallback;
	// A 422 body nests per-field messages; keep the summary short and put the
	// details on error.errors for the caller.
	const label = [status].filter((part) => part !== undefined).join(' ');
	return label ? `Moneybird ${label}: ${text}` : text;
}

// unknown: the body is an untyped error body; read one field at a time.
function readErrors(body: unknown): Record<string, string[]> | undefined {
	const record = asRecord(body);
	const errors = record?.errors;
	const base = asRecord(errors) ?? record;
	if (!base) return undefined;
	const out: Record<string, string[]> = {};
	for (const [field, value] of Object.entries(base)) {
		if (field === 'error' || field === 'symbolic') continue;
		if (Array.isArray(value)) {
			out[field] = value.map((entry) => String(entry));
		} else if (asRecord(value)) {
			// Moneybird nests attribute errors one level deeper on updates.
			for (const [nested, nestedValue] of Object.entries(
				value as Record<string, unknown>,
			)) {
				if (Array.isArray(nestedValue)) {
					out[`${field}.${nested}`] = nestedValue.map((entry) => String(entry));
				}
			}
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export type MoneybirdQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MoneybirdRequest = {
	/** True when the path starts above the administration scope. */
	global?: boolean;
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	path: string;
	query?: MoneybirdQuery;
	/**
	 * The resource-wrapped body, e.g. `{ contact: {...} }`. Serialized as
	 * JSON.
	 */
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * True when a 5xx or a network drop can replay the request: reads only.
	 */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. The documented throttle is 150 requests
// per 5 minutes per IP with a Retry-After header on the 429.
const MONEYBIRD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema;
// deletes answer 204 with no body.
export async function makeMoneybirdRequest(
	ctx: MoneybirdCallContext,
	{ global, method, path, query, body, replayable }: MoneybirdRequest,
): Promise<unknown> {
	const prefix = global
		? MONEYBIRD_API_BASE
		: `${MONEYBIRD_API_BASE}/${await resolveAdministrationId(ctx)}`;
	const config: OpenAPIConfig = {
		BASE: prefix,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${ctx.key}`,
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
			rateLimitConfig: MONEYBIRD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MoneybirdAPIError(
				describeMoneybirdError(error.status, error.body, error.message),
				{ cause: error, replayable },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MoneybirdAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new MoneybirdAPIError('Unknown Moneybird error', {
			method,
			replayable,
		});
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** Normalizes an id input to the digit string the path expects, then encodes it. */
export function idSegment(value: string | number): string {
	return segment(asMoneybirdId(value));
}
