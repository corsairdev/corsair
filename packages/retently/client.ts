import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The API host. The docs give `https://app.retently.com` as the base and `/api/v2`
 * as the version segment, so the two are joined by the client rather than
 * hard-coded into one constant.
 */
export const RETENTLY_API_BASE = 'https://app.retently.com';
export const RETENTLY_API_VERSION = '/api/v2';

/**
 * Retently wraps every answer — success and failure alike — in one envelope:
 *
 * ```json
 * { "message": "Missing authorization key (api_key).", "code": 401, "data": null }
 * ```
 *
 * `code` repeats the HTTP status, `message` explains it, and `data` holds the
 * payload on success. The live body for a keyless call is exactly that, with
 * `code: 401` and a null `data`, so the envelope is read rather than the status
 * alone.
 */
export class RetentlyAPIError extends Error {
	readonly status?: number;
	/** The envelope's `code`, which repeats the HTTP status. */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, when Retently sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RetentlyAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * The key is missing, unknown, or for a deleted account. A 403 is not one:
	 * the key is valid but read-only, or the campaign is inactive.
	 */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The account has write permission but the key is read-only. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** The customer, feedback or company does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body Retently refused, including a batch over its size limit. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}
}

/**
 * Reads the envelope.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function envelope(body: unknown): { message?: string; code?: number } {
	const record = asRecord(body);
	const message = record?.message;
	const code = record?.code;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'number' ? code : undefined,
	};
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `envelope` narrows it.
 */
export function describeRetentlyError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, code } = envelope(body);
	const text = message ?? fallback;
	// The envelope's code repeats the status, so it is only added when it differs.
	const parts = [status];
	if (code !== undefined && code !== status) parts.push(code);
	const label = parts.filter((part) => part !== undefined).join(' ');
	return label ? `Retently ${label}: ${text}` : text;
}

export type RetentlyQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RetentlyRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	/** Path below `/api/v2`, starting with a slash. */
	path: string;
	query?: RetentlyQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Retently allows **150 requests a minute** and documents no `Retry-After`, so
 * the handler backs off on its own and reads the header only if one arrives.
 */
const RETENTLY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key goes in `X-Api-Key`, which the docs call the recommended transport.
 * The older `Authorization: api_key=…` header and the `api_key` query parameter
 * still work but are legacy, so the plugin uses the header.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: `${RETENTLY_API_BASE}${RETENTLY_API_VERSION}`,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'X-Api-Key': apiKey },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRetentlyRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RetentlyRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	// unknown: the body is provider JSON until the caller's output schema
	// parses it; `request` cannot know the operation's shape.
	let response: unknown;
	try {
		response = await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: RETENTLY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { code } = envelope(error.body);
			// The cause holds the request, and with it the X-Api-Key header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RetentlyAPIError(
				describeRetentlyError(error.status, error.body, error.message),
				{
					status: error.status,
					code,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RetentlyAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RetentlyAPIError('Unknown Retently error', {
			method,
			replayable,
		});
	}

	// A by-ID lookup for a missing customer or feedback answers HTTP 200 with
	// the 404 only in the envelope (seen live 11-12), so the envelope code is
	// checked too.
	const { code } = envelope(response);
	if (code !== undefined && code >= 400) {
		throw new RetentlyAPIError(
			describeRetentlyError(code, response, 'Retently request failed'),
			{ status: code, code, method, replayable },
		);
	}
	return response;
}
