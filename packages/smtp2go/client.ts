import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SMTP2GO_API_BASE = 'https://api.smtp2go.com/v3';

// The key travels in the X-Smtp2go-Api-Key header, never in the JSON body:
// the API's documented default transport is body-based, and error payloads
// can echo request fields, so a body-carried key could leak into an error.
// Header auth is accepted on every route (live-verified against all 69
// documented paths).

// Retries belong to error-handlers.ts, so the client makes one attempt and
// only reads Retry-After into the error. The 429 that matters here has an
// empty body and no Retry-After header (live-verified): the API throttles by
// IP for at least one minute after too many requests OR too many error
// responses, so the no-header fallback delay is that documented minimum.
const SMTP2GO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 60_000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the body is an untyped JSON value until these narrow it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * SMTP2GO wraps every answer in `{ request_id, data }`. Errors carry the
 * message in `data.error` and a code in `data.error_code`; some documented
 * failures use a bare `{ error, error_code }` body without the `data`
 * wrapper, so both shapes are read.
 */
export function readEnvelopeError(
	// unknown: the body arrives as an untyped JSON value until this narrows it.
	raw: unknown,
): { message: string; code?: string } | undefined {
	const record = asRecord(raw);
	const data = asRecord(record?.data);
	const message = readString(data, 'error') ?? readString(record, 'error');
	if (message === undefined) return undefined;
	return {
		message,
		code: readString(data, 'error_code') ?? readString(record, 'error_code'),
	};
}

function describeSmtp2goError(
	status: number | undefined,
	// unknown: the error body is read for its message and never stored.
	body: unknown,
	fallback: string,
): string {
	const envelope = readEnvelopeError(body);
	const label = [status, envelope?.code]
		.filter((part) => part !== undefined)
		.join(' ');
	const text = envelope?.message ?? fallback;
	return label ? `SMTP2GO ${label}: ${text}` : text;
}

/**
 * The error type for every failed SMTP2GO call. It deliberately carries no
 * request or response body: the documented default auth transport puts the
 * api_key in the JSON body, so any body attached here (or a cause holding
 * the request) could leak the key through `console.error`, `util.inspect`
 * or `JSON.stringify`. Only the status, the provider's error_code, the
 * provider's error message, and the Retry-After header are copied.
 */
export class Smtp2goAPIError extends Error {
	readonly status?: number;
	/** `data.error_code`, e.g. `E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when the API sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the request failed before the API answered (reset, DNS, abort). */
	readonly transport: boolean;
	/** True when replaying the request cannot repeat a side effect. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			replayable?: boolean;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'Smtp2goAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.replayable = options.replayable ?? false;
	}

	/** A 429, whichever body shape the throttle used. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/**
	 * The docs claim invalid keys answer 401, but the live API answers a
	 * missing or malformed key with 403 and a well-formed unknown key with
	 * 400, both naming api_key in the error text (live-verified). Branch on
	 * the text, not the status alone.
	 */
	get isAuthError(): boolean {
		if (this.status === 401) return true;
		return (
			this.message.includes("'api_key'") && this.message.includes('not found')
		);
	}
}

export type Smtp2goRequest = {
	// every SMTP2GO operation is a POST under /v3
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body?: Record<string, unknown>;
	// Reads replay safely on a 5xx or a dropped connection; a send or a
	// removal may already have taken effect, so callers pass false for those.
	replayable: boolean;
};

/** Drops unset optional fields so the body carries only what the caller sent. */
export function pickBody(parsed: object): Record<string, unknown> {
	// unknown: JSON body values are open until serialization.
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(parsed)) {
		if (value !== undefined) body[key] = value;
	}
	return body;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeSmtp2goRequest(
	apiKey: string,
	{ path, body, replayable }: Smtp2goRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: SMTP2GO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Smtp2go-Api-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: path,
		body,
		mediaType: 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SMTP2GO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The envelope error text rides in the response body; it is read for
			// the message and never stored. The ApiError itself is dropped, since
			// its `request` field holds the outgoing body.
			throw new Smtp2goAPIError(
				describeSmtp2goError(error.status, error.body, error.message),
				{
					status: error.status,
					code: readEnvelopeError(error.body)?.code,
					retryAfter: error.retryAfter,
					method: 'POST',
					replayable,
				},
			);
		}
		// A transport failure never reached the API, so it holds no body; the
		// cause is kept for debugging and `transport` marks it for the handlers.
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new Smtp2goAPIError(error.message, {
				method: 'POST',
				transport: true,
				replayable,
				cause: error instanceof Error ? error : undefined,
			});
		}
		throw new Smtp2goAPIError('Unknown SMTP2GO error', {
			method: 'POST',
			replayable,
		});
	}
}
