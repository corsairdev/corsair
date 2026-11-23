import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MOOSEND_API_BASE = 'https://api.moosend.com/v3';

/**
 * Moosend wraps every answer, success or failure, in HTTP 200 with
 * `{Code, Error, Context}`. Code 0 means success; the probed failure is
 * `{"Code":104,"Error":"API_KEY_NOT_VALID","Context":null}`.
 */
export class MoosendAPIError extends Error {
	/** The HTTP status, when the failure came from a non-2xx response. */
	readonly status?: number;
	/** The envelope's numeric code; 0 never reaches here. */
	readonly code?: number;
	/** The envelope's error string, e.g. `API_KEY_NOT_VALID`. */
	readonly moosendError?: string;
	// unknown: the envelope's Context carries whatever the call returned.
	readonly context?: unknown;
	/** Milliseconds from a Retry-After header, when a gateway sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the failed request can be sent again after a 5xx. */
	readonly replayable?: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: number;
			moosendError?: string;
			// unknown: same open envelope part as the field above.
			context?: unknown;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message);
		this.name = 'MoosendAPIError';
		this.status = options.status;
		this.code = options.code;
		this.moosendError = options.moosendError;
		this.context = options.context;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable;
	}
}

export type MoosendQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MoosendRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: MoosendQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * True when a 5xx or a network drop can replay the request: reads only.
	 */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt. Moosend
// documents no rate limit; the config stays complete per corsair/http's
// contract and reads a Retry-After header if one ever arrives.
const MOOSEND_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse Context with the endpoint's zod output schema.
export async function makeMoosendRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: MoosendRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MOOSEND_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, apikey: apiKey },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	let envelope: unknown;
	try {
		envelope = await request<unknown>(config, requestOptions, {
			rateLimitConfig: MOOSEND_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The key rides in the query string, which ApiError keeps on
			// request. Keep only the safe fields and drop the cause so the
			// query (with the key) can never be printed.
			throw new MoosendAPIError(`Moosend ${error.status}: request failed`, {
				status: error.status,
				retryAfter: error.retryAfter,
				method,
				replayable,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		// Transport failures never reached Moosend, so the cause carries no key.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MoosendAPIError(error.message, {
				method,
				replayable,
			});
		}
		throw new MoosendAPIError('Unknown Moosend error', {
			method,
			replayable,
		});
	}

	const record = asRecord(envelope);
	const code = record?.Code;
	if (!record || typeof code !== 'number') {
		throw new MoosendAPIError('Moosend answered without its Code envelope', {
			method,
			replayable,
		});
	}
	if (code !== 0) {
		const moosendError =
			typeof record.Error === 'string' ? record.Error : 'UNKNOWN_ERROR';
		throw new MoosendAPIError(`Moosend ${code}: ${moosendError}`, {
			code,
			moosendError,
			context: record.Context,
			method,
			replayable,
		});
	}
	return record.Context;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
