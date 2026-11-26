import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MAILERLITE_API_BASE = 'https://connect.mailerlite.com/api';

/**
 * MailerLite allows 120 requests per minute per account and answers a 429 with
 * a `Retry-After` header in seconds (docs example: 119). The header is absent
 * on every non-429 response, and `error-handlers.ts` needs a delay for the
 * rare 429 that arrives without one.
 */
export const RATE_LIMIT_FALLBACK_MS = 60_000;

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. Retries live in error-handlers.ts; `headerNames` stays
// so a 429's Retry-After still reaches the thrown error.
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Error bodies are bare `{ message }` JSON; a 422 adds
 * `errors: { field: [messages] }`. A route miss 404s with
 * "Resource does not exist." and a wrong method 405s with an `allow` header.
 * There is no code field on this host.
 */
export class MailerLiteAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when MailerLite sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;
	/** Field to messages, from a 422 validation body. */
	readonly fieldErrors?: Record<string, string[]>;
	/**
	 * True when repeating the request cannot double its effect: reads, and the
	 * email upsert. Every other write is false, because a retry after an
	 * unknown outcome could send a campaign twice.
	 */
	readonly replayable: boolean;
	/** True for a failure that never reached MailerLite (reset, DNS, abort). */
	readonly transport: boolean;
	// unknown: the body is an untyped error body until the readers narrow it.
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
			transport?: boolean;
			fieldErrors?: Record<string, string[]>;
		} = {},
	) {
		// The ApiError cause is kept only for transport failures, which never
		// carried a body: for HTTP errors status, retryAfter and body are copied
		// off instead, so no request payload rides along on the plugin error.
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MailerLiteAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.body = options.body ?? cause?.body;
		this.fieldErrors = options.fieldErrors;
		this.replayable = options.replayable ?? false;
		this.transport = options.transport ?? false;
	}

	/** Field errors from a 422 body, one line per field. */
	get fieldSummary(): string | undefined {
		const entries = Object.entries(this.fieldErrors ?? {});
		if (entries.length === 0) return undefined;
		return entries
			.map(([field, messages]) => `${field}: ${messages.join('; ')}`)
			.join(' | ');
	}
}


// unknown: the body is an untyped error body; read one field at a time.
function readMessage(body: unknown): string | undefined {
	const value = asRecord(body)?.message;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: the body is an untyped error body until the guard here narrows it.
function readFieldErrors(body: unknown): Record<string, string[]> | undefined {
	const errors = asRecord(body)?.errors;
	if (!errors) return undefined;
	const fieldErrors: Record<string, string[]> = {};
	for (const [field, messages] of Object.entries(errors)) {
		if (Array.isArray(messages)) {
			const text = messages.filter(
				(message): message is string => typeof message === 'string',
			);
			if (text.length > 0) fieldErrors[field] = text;
		}
	}
	return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

/** Builds the plugin error message from the body's message and field errors. */
export function describeMailerLiteError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readMessage(body) ?? fallback;
	const label = status === undefined ? '' : `${status} `;
	const summary = `MailerLite ${label}${text}`;
	const fields = readFieldErrors(body);
	if (!fields) return summary;
	const lines = Object.entries(fields)
		.map(([field, messages]) => `${field}: ${messages.join('; ')}`)
		.join(' | ');
	return `${summary} (${lines})`;
}

export type MailerLiteRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * True when repeating the request cannot double its effect. Set per
	 * operation, never derived from the method: reads are replayable, the
	 * subscriber upsert is replayable by design (it upserts on email), and
	 * every other write is not.
	 */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless 204 answers.
export async function makeMailerLiteRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: MailerLiteRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MAILERLITE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TOKEN renders `Authorization: Bearer <key>`; the legacy Classic-API
		// `X-MailerLite-ApiKey` header does not work on this host.
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
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
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Rethrow plugin errors untouched before the ApiError branch, so a
		// double wrap cannot drop status and code.
		if (error instanceof MailerLiteAPIError) throw error;
		if (error instanceof ApiError) {
			// The API key travels in the config only, which ApiError never
			// stores, so the body and query here carry no secret.
			throw new MailerLiteAPIError(
				describeMailerLiteError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method,
					replayable,
					fieldErrors: readFieldErrors(error.body),
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never reached MailerLite, so the cause is kept
			// and the request is safe to repeat for a replayable operation.
			throw new MailerLiteAPIError(error.message, {
				cause: error,
				method,
				replayable,
				transport: true,
			});
		}
		throw new MailerLiteAPIError('Unknown MailerLite error', {
			method,
			replayable,
			transport: true,
		});
	}
}
