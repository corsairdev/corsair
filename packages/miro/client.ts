import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MIRO_API_BASE = 'https://api.miro.com';

// A board can hold a lot, but no single call returns more than a hundred rows,
// and the write bodies are small, so the default is generous enough.
const MIRO_TIMEOUT_MS = 30_000;

/**
 * Miro reports failures as
 * `{ status, code, message, type }`, where `code` is the machine-readable half
 * (`tokenNotProvided`, `unauthorized`, `rateLimitExceeded`).
 */
export type MiroErrorFields = {
	code?: string;
	message?: string;
	type?: string;
};

// unknown: the body is untrusted JSON until asRecord narrows it.
export function readError(body: unknown): MiroErrorFields {
	const record = asRecord(body);
	if (!record) return {};
	const code = record.code;
	const message = record.message;
	const type = record.type;
	return {
		code: typeof code === 'string' ? code : undefined,
		message: typeof message === 'string' ? message : undefined,
		type: typeof type === 'string' ? type : undefined,
	};
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Miro sets it on a 429.
const MIRO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Miro authenticates with a bearer token, either an OAuth access token or a
 * token created in the app, and answers every failure with a `code`.
 */
export class MiroAPIError extends Error {
	readonly status?: number;
	/** `code` from the body, such as `tokenNotProvided` or `rateLimitExceeded`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Miro sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are the shape above, but a proxy can answer with
	// HTML or text.
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
		this.name = 'MiroAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.method = options.method ?? cause?.request.method;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const fields = readError(options.body ?? cause?.body);
		this.code = fields.code;
		// Only the provider's message is kept: a request body can carry board
		// content, and ApiError does not redact a body.
		this.body = fields.message
			? { code: fields.code, message: fields.message }
			: undefined;
	}
}

// unknown: see MiroAPIError.
export function describeMiroError(
	status: number | undefined,
	body: unknown, // unknown: the untyped error body, read field by field.
	fallback: string,
): string {
	const { code, message } = readError(body);
	const text = message ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Miro ${label}: ${text}` : text;
}

/**
 * A status-only description, safe to pass as the fallback above.
 *
 * The shared client's own message must never be that fallback: for a status
 * outside its fixed map (504, for one) `ApiError.message` embeds the whole
 * response body, and a rejected board write echoes what was sent.
 */
export function statusOnlyDescription(
	status: number | undefined,
	statusText: string | undefined,
): string {
	if (status === undefined) return 'request failed';
	return statusText ? `request failed (${statusText})` : 'request failed';
}

export type MiroQuery = Record<string, string | number | boolean | undefined>;

export type MiroRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: MiroQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMiroRequest(
	apiKey: string,
	{ method, path, query, body }: MiroRequest,
): Promise<unknown> {
	// unknown: callers parse it with a zod output schema.
	const config: OpenAPIConfig = {
		BASE: MIRO_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: MIRO_TIMEOUT_MS,
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
		// unknown: the body is untyped here; callers parse it with a zod schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: MIRO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is dropped: `cause` is non-enumerable, but util.inspect
			// follows it, and ApiError.body holds the whole response.
			throw new MiroAPIError(
				describeMiroError(
					error.status,
					error.body,
					// Never error.message: on an unmapped status it embeds the body.
					statusOnlyDescription(error.status, error.statusText),
				),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method ?? method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MiroAPIError(error.message, { cause: error, method });
		}
		throw new MiroAPIError('Unknown Miro error', { method });
	}
}
