import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { RaiselyValue } from './endpoints/call';

/** The only host; the version segment is part of the base. */
export const RAISELY_API_BASE = 'https://api.raisely.com/v3';

/**
 * Raisely sends every failure as an RFC 7807 problem document, so one shape
 * covers a bad token, an unknown campaign and a rejected donation:
 *
 * ```json
 * { "detail": "You are not authorized to do that",
 *   "type": "/errors/types/forbidden", "status": 403,
 *   "instance": "/errors/occurance/3AuL:BU1dG", "code": "forbidden",
 *   "errors": [{ "message": "…", "code": "forbidden" }] }
 * ```
 *
 * `instance` is the value Raisely support asks for. `detail` is the summary and
 * `errors` the per-field detail, so both are kept.
 */
export class RaiselyAPIError extends Error {
	readonly status?: number;
	/** The machine-readable code, such as `forbidden` or `validation-error`. */
	readonly code?: string;
	/** The `instance` id Raisely support asks for. */
	readonly instance?: string;
	/** Every message the problem document carried, in order. */
	readonly errors: string[];
	/** Milliseconds from a Retry-After header, when Raisely sent one. */
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
			code?: string;
			instance?: string;
			errors?: string[];
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RaiselyAPIError';
		this.status = options.status;
		this.code = options.code;
		this.instance = options.instance;
		this.errors = options.errors ?? [];
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The token is missing, wrong, or lacks the scope for this route. */
	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.status === 403 ||
			this.code === 'forbidden' ||
			this.code === 'unauthorized'
		);
	}

	/** The campaign, donation or profile does not exist, or was deleted. */
	get isNotFound(): boolean {
		return this.status === 404 || this.status === 410;
	}

	/** A record Raisely refused; `errors` names every field at fault. */
	get isValidationError(): boolean {
		return (
			this.status === 400 ||
			this.status === 422 ||
			this.code === 'validation-error'
		);
	}
}

/**
 * Reads the problem document.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function problemBody(body: unknown): {
	messages: string[];
	code?: string;
	instance?: string;
} {
	const record = asRecord(body);
	const messages: string[] = [];

	const detail = record?.detail;
	if (typeof detail === 'string' && detail.length > 0) messages.push(detail);

	// `errors` holds the per-field detail; its messages add to `detail` rather
	// than replacing it, so a validation failure lists every field.
	const list = record?.errors;
	if (Array.isArray(list)) {
		for (const entry of list) {
			const message = asRecord(entry)?.message;
			if (typeof message === 'string' && message.length > 0) {
				if (!messages.includes(message)) messages.push(message);
			}
		}
	}

	const code = record?.code;
	const instance = record?.instance;
	return {
		messages,
		code: typeof code === 'string' ? code : undefined,
		instance: typeof instance === 'string' ? instance : undefined,
	};
}

/**
 * Builds the message for a problem document.
 * unknown: the body is untyped until `problemBody` narrows it.
 */
export function describeRaiselyError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { messages, code } = problemBody(body);
	const text = messages[0] ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const summary = label ? `Raisely ${label}: ${text}` : text;
	return messages.length > 1
		? `${summary} (${messages.slice(1).join('; ')})`
		: summary;
}

export type RaiselyQuery = Record<string, RaiselyValue | undefined>;

export type RaiselyRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** Path below `/v3`, starting with a slash. */
	path: string;
	query?: RaiselyQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Raisely answers 429 with a `Retry-After` on the rate-limited routes, so this
 * config reads the header; the handler owns the retry count and the strategy.
 */
const RAISELY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key travels as a bearer token. Raisely also accepts a user JWT and a
 * campaign key on some routes, but the organisation API key is what this plugin
 * stores, and it is the one that sees every campaign in the organisation.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RAISELY_API_BASE,
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRaiselyRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RaiselyRequest,
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
			rateLimitConfig: RAISELY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { messages, code, instance } = problemBody(error.body);
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RaiselyAPIError(
				describeRaiselyError(error.status, error.body, error.message),
				{
					status: error.status,
					code,
					instance,
					errors: messages,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RaiselyAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RaiselyAPIError('Unknown Raisely error', {
			method,
			replayable,
		});
	}
}
