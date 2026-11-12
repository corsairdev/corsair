import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Ragic has no single API host: the server name depends on where the account
 * lives (`www`, `na3`, `ap5`, `eu2`, …), which is why the plugin takes it as an
 * option. The URL is `https://{server}/{account}{path}/{sheetIndex}`, so the
 * account name and the folder path are both part of every request.
 */
export const RAGIC_DEFAULT_SERVER = 'www.ragic.com';

export type RagicServer = string;

/**
 * Ragic reports almost every failure inside a **200** response:
 *
 * ```json
 * {"status":"ERROR","code":106,"msg":"This sheet is access right protected. You are currently accessing as: guest account"}
 * {"status":"ERROR","code":403,"msg":"no right"}
 * {"status":"ERROR","code":500,"msg":"Something Unexpected Happened... Error ID: 1794349709969"}
 * ```
 *
 * All three were captured live, each at HTTP 200. A missing key and a wrong key
 * are indistinguishable: both fall back to the guest account and answer 106. So
 * the body is read, not the status.
 */
export class RagicAPIError extends Error {
	/** The body's `code`, which is Ragic's own error id, not the HTTP status. */
	readonly code?: number;
	/** The HTTP status, when Ragic returned a non-2xx one. */
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Ragic sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			code?: number;
			status?: number;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RagicAPIError';
		this.code = options.code;
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * Codes 105 ("Authentication Required Before Using API") and 106 ("No Access
	 * Right"). 106 is also what a non-admin API key gets from the schema route, and
	 * what both a missing and a wrong key get on a protected sheet, so it covers
	 * auth and permission together.
	 */
	get isAuthError(): boolean {
		return (
			this.code === 105 ||
			this.code === 106 ||
			this.status === 401 ||
			this.status === 403
		);
	}

	/** No such account, folder, sheet or record. */
	get isNotFound(): boolean {
		return (
			this.code === 101 ||
			this.code === 102 ||
			this.code === 103 ||
			this.code === 108 ||
			this.status === 404
		);
	}

	/**
	 * A request Ragic would not process: 201 bad parameters, 202 could not execute,
	 * 104 a POST to a custom form, or a `400`. The caller has to change something.
	 */
	get isValidationError(): boolean {
		return (
			this.code === 104 ||
			this.code === 201 ||
			this.code === 202 ||
			this.status === 400
		);
	}

	/** The account cannot take more records, or has expired. */
	get isQuotaError(): boolean {
		return this.code === 109 || this.code === 303;
	}

	/**
	 * HTTP 429, or body code 204 ("Request Frequency Too High"). Ragic's per-account
	 * queue holds 50 requests and refuses GETs once it is full.
	 */
	get isRateLimited(): boolean {
		return this.status === 429 || this.code === 204 || this.code === 429;
	}

	/** A server-side failure, worth retrying. */
	get isServerError(): boolean {
		return (this.code ?? 0) >= 500 || (this.status ?? 0) >= 500;
	}
}

/**
 * Reads a Ragic error body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	status?: string;
	code?: number;
	msg?: string;
} {
	const record = asRecord(body);
	if (!record) return {};
	const status = record.status;
	const code = record.code;
	const msg = record.msg ?? record.message;
	return {
		status:
			typeof status === 'string' && status.length > 0 ? status : undefined,
		code: typeof code === 'number' ? code : undefined,
		msg: typeof msg === 'string' && msg.length > 0 ? msg : undefined,
	};
}

/**
 * True when a body is Ragic's error envelope rather than data. Ragic answers 200
 * for a failed call as well as a successful one, so this is the only reliable
 * check.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function isRagicError(body: unknown): boolean {
	const { status, code } = failure(body);
	return status === 'ERROR' || (status === undefined && code !== undefined);
}

/**
 * Builds the message for an error body. Ragic's `msg` is usually specific and
 * often actionable, so it is kept verbatim.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRagicError(
	body: unknown,
	httpStatus: number | undefined,
	fallback: string,
): string {
	const { code, msg } = failure(body);
	const text = msg ?? fallback;
	if (code !== undefined) return `Ragic ${code}: ${text}`;
	return httpStatus === undefined ? text : `Ragic ${httpStatus}: ${text}`;
}

/**
 * A query value. A repeated parameter such as `where` is an array: `corsair/http`
 * then emits one `where=` per entry, which is how Ragic reads several filters.
 */
export type RagicQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type RagicRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** The full path below the server, such as `/demo/sales/1`. */
	path: string;
	query?: RagicQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Ragic documents no numeric rate limit, only a per-account queue of 50 that stops
 * accepting GET requests when full, and a manual review above 5 requests a second.
 * There is no Retry-After documented, so the handler backs off on its own.
 */
const RAGIC_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	// Ragic reports a failed request with a 200, so corsair/http must not mistake a
	// body-level error for a rate limit.
	isRateLimitError: () => false,
};

/**
 * The key goes in `Authorization: Basic <key>`: Ragic wants the raw API key as the
 * Basic username with an empty password, and the value is not base64-encoded a
 * second time. A key in the URL (`APIKey=…`) is also supported and never used.
 */
function configWith(apiKey: string, server: string): OpenAPIConfig {
	return {
		BASE: `https://${server}`,
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// The key is sent as-is: Ragic reads the Basic value directly rather than
			// decoding it, so it must not be base64-encoded here.
			Authorization: `Basic ${apiKey}`,
		},
	};
}

/**
 * Sent on every call: `api` is what switches the route from an HTML page to the
 * API, and `version` pins the date-based API version so a future default cannot
 * change the response shape under a caller.
 */
const RAGIC_COMMON_QUERY: RagicQuery = {
	api: '',
	version: '2025-01-01',
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRagicRequest(
	apiKey: string,
	server: string,
	{ method, path, query, body, replayable }: RagicRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, ...RAGIC_COMMON_QUERY },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	let raw: unknown;
	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		raw = await request<unknown>(configWith(apiKey, server), requestOptions, {
			rateLimitConfig: RAGIC_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the API key, so the fields
			// the handlers need are copied and the cause is dropped.
			throw new RagicAPIError(
				describeRagicError(error.body, error.status, error.message),
				{
					code: fields.code,
					status: error.status,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RagicAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RagicAPIError('Unknown Ragic error', { method, replayable });
	}

	// A failed call arrives as a 200 with this envelope, so it is thrown here
	// rather than returned to the output schema, which would accept it as a record.
	if (isRagicError(raw)) {
		const fields = failure(raw);
		throw new RagicAPIError(describeRagicError(raw, undefined, 'refused'), {
			code: fields.code,
			method,
			replayable,
		});
	}

	return raw;
}

/**
 * Builds a `where` filter: `fieldId,operand,value`.
 *
 * Ragic joins the three parts with commas and repeats the parameter for more
 * conditions, and decodes each value a second time after splitting it. So the
 * value is encoded once here (only `%` and `,`, the two characters that second
 * decode reads) and once more by the query string: `ABC%DEF` arrives as
 * `ABC%2525DEF`, which is the reference's own example, and a comma cannot split
 * the filter.
 */
export function whereFilter(
	fieldId: number | string,
	operand: 'eq' | 'regex' | 'gte' | 'lte' | 'gt' | 'lt' | 'like' | 'eqeq',
	value?: string | number,
): string {
	const head = `${fieldId},${operand}`;
	// No value at all is how Ragic asks for an empty field.
	if (value === undefined) return head;
	const escaped = String(value).replace(/%/g, '%25').replace(/,/g, '%2C');
	return `${head},${escaped}`;
}

/** Builds an `order` parameter: `fieldId,ASC` or `fieldId,DESC`. */
export function orderParam(
	fieldId: number | string,
	direction: 'ASC' | 'DESC',
): string {
	return `${fieldId},${direction}`;
}

/** Escapes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
