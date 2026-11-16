import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The API base. The version segment (`/1.0`) lives in each operation's path
 * because Rocketlane increments it per resource family rather than globally.
 */
export const ROCKETLANE_API_BASE = 'https://api.rocketlane.com/api';

/**
 * Rocketlane sends every error as a list under one key, so one envelope covers
 * a bad key, a bad field and a missing record:
 *
 * ```json
 * { "errors": [{ "errorCode": "NOT_AUTHORIZED",
 *                "errorMessage": "Not Authorized: User not authorized" }] }
 * ```
 *
 * A request with no key at all is rejected before the application layer and
 * arrives as bare `401 Unauthorized` text, so `errors` can be empty.
 */
export class RocketlaneAPIError extends Error {
	readonly status?: number;
	/** The first `errorCode`, e.g. `NOT_AUTHORIZED` or `BAD_REQUEST`. */
	readonly code?: string;
	/** Every `errorMessage` the API sent, in order. */
	readonly errors: string[];
	/** Milliseconds from a Retry-After header, when Rocketlane sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/**
	 * Whether the failing call may be sent again. Declared by the endpoint: a
	 * GET is safe, a create is not, and that is not derivable from the status.
	 */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			errors?: string[];
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RocketlaneAPIError';
		this.status = options.status;
		this.code = options.code;
		this.errors = options.errors ?? [];
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The key is missing, wrong or expired. */
	get isAuthError(): boolean {
		return this.status === 401 || this.code === 'NOT_AUTHORIZED';
	}

	/** The record does not exist on this instance. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === 'NOT_FOUND';
	}

	/** A field or filter Rocketlane refused. Sending it again cannot help. */
	get isValidationError(): boolean {
		return (
			this.status === 400 ||
			this.code === 'BAD_REQUEST' ||
			this.code === 'VALIDATION_ERROR'
		);
	}
}

/**
 * Reads the `errors` array out of a Rocketlane body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function errorEntries(body: unknown): { codes: string[]; messages: string[] } {
	const record = asRecord(body);
	const list = record?.errors;
	const codes: string[] = [];
	const messages: string[] = [];
	if (!Array.isArray(list)) return { codes, messages };

	for (const entry of list) {
		const row = asRecord(entry);
		const code = row?.errorCode;
		const message = row?.errorMessage;
		if (typeof code === 'string' && code.length > 0) codes.push(code);
		if (typeof message === 'string' && message.length > 0) {
			messages.push(message);
		}
	}
	return { codes, messages };
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `errorEntries` narrows it.
 */
export function describeRocketlaneError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { codes, messages } = errorEntries(body);
	const text = messages[0] ?? fallback;
	const code = codes[0];
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const summary = label ? `Rocketlane ${label}: ${text}` : text;
	// A validation response can carry several messages; the rest join it.
	return messages.length > 1
		? `${summary} (${messages.slice(1).join('; ')})`
		: summary;
}

/**
 * A query value may be a repeated parameter, which `corsair/http` serialises by
 * repeating the key: `includeFields` is one, and it is spread in beside the
 * scalar filters.
 */
export type RocketlaneQuery = Record<
	string,
	string | number | boolean | undefined | readonly (string | number)[]
>;

export type RocketlaneRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path below `/api`, starting with a slash, including the version. */
	path: string;
	query?: RocketlaneQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * Whether this call may be sent again after a 5xx or a dropped connection.
	 * Declared per operation rather than inferred from the method, because the
	 * list endpoints take query filters and the creates do not; keeping it
	 * explicit is what stops a write being replayed.
	 */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Rocketlane documents no rate-limit window, so this config exists only to read
 * a `Retry-After` if a gateway adds one; the handler owns the retry count.
 */
const ROCKETLANE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key travels in a mandatory `api-key` header. It is not one of the names
 * `ApiError` redacts from a query string, so the cause is dropped rather than
 * relying on that and the header never reaches an error object.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: ROCKETLANE_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'api-key': apiKey },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRocketlaneRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RocketlaneRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: ROCKETLANE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { codes, messages } = errorEntries(error.body);
			// The cause holds the request, and with it the api-key header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RocketlaneAPIError(
				describeRocketlaneError(error.status, error.body, error.message),
				{
					status: error.status,
					code: codes[0],
					errors: messages,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RocketlaneAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RocketlaneAPIError('Unknown Rocketlane error', {
			method,
			replayable,
		});
	}
}
