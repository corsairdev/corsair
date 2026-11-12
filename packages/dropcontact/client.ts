import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DROPCONTACT_API_BASE = 'https://api.dropcontact.com';

// A batch may hold 250 records of up to 15 kB each, so the body can reach
// several megabytes and the provider does the enrichment work before answering.
const DROPCONTACT_TIMEOUT_MS = 60_000;

/** `error_code` as a number, whichever type the route used. */
// unknown: an untyped response body; every field is type-checked on read.
export function readReason(body: unknown): string | undefined {
	const record = asRecord(body);
	const reason = record?.reason;
	if (typeof reason === 'string' && reason.length > 0) return reason;
	// FastAPI validation failures use `detail` instead of `reason`, either as a
	// string or as a list of per-field objects.
	const detail = record?.detail;
	if (typeof detail === 'string' && detail.length > 0) return detail;
	if (Array.isArray(detail)) {
		const messages = detail
			.map((entry) => {
				const item = asRecord(entry);
				const field = Array.isArray(item?.loc) ? item.loc.join('.') : undefined;
				const message = item?.msg;
				if (typeof message !== 'string') return undefined;
				return field ? `${field}: ${message}` : message;
			})
			.filter((entry): entry is string => entry !== undefined);
		if (messages.length > 0) return messages.join('; ');
	}
	return undefined;
}

/** True when the body says the call failed, whatever the HTTP status was. */
// unknown: the body is untyped JSON until asRecord narrows it.
export function isFailedBody(body: unknown): boolean {
	const record = asRecord(body);
	if (!record) return false;
	// Every Dropcontact envelope carries `success`, and it is authoritative:
	// a not-ready result is HTTP 200 with success false and a reason.
	return record.success === false;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Dropcontact documents 60 requests per
// second and says to increase the delay after a 429, without naming a window.
const DROPCONTACT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Dropcontact answers with its own envelope on most routes,
 * `{ error, success, reason }`, and a FastAPI shape on others,
 * `{ detail }` or `{ detail: [{ loc, msg, type }] }`. Both are read here.
 *
 * A 200 can still be a failure: fetching results before the batch is ready
 * answers `success: false` with a `reason`, which is a normal state rather than
 * an error, so the caller decides with `isFailedBody` instead of the client
 * throwing.
 */
export class DropcontactAPIError extends Error {
	readonly status?: number;
	/** The provider's own `reason` or `detail`, when it sent one. */
	readonly reason?: string;
	/** The credit balance Dropcontact reported, when it sent one. */
	readonly creditsLeft?: number;
	/** Milliseconds from a Retry-After header, when Dropcontact sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are the envelopes above, but a proxy can answer
	// with HTML or text.
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
		this.name = 'DropcontactAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.method = options.method ?? cause?.request.method;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const body = options.body ?? cause?.body;
		this.reason = readReason(body);
		const credits = asRecord(body)?.credits_left;
		this.creditsLeft =
			typeof credits === 'number' && Number.isFinite(credits)
				? credits
				: undefined;
		// Only the envelope is kept: the body can echo submitted contact data,
		// which must not reach a log through an error.
		this.body = this.reason ? { reason: this.reason } : undefined;
	}
}

// unknown: see DropcontactAPIError.
export function describeDropcontactError(
	status: number | undefined,
	body: unknown, // unknown: the untyped error body, read field by field.
	fallback: string,
): string {
	const reason = readReason(body) ?? fallback;
	return status !== undefined ? `Dropcontact ${status}: ${reason}` : reason;
}

/**
 * A status-only description, safe to pass as the fallback above.
 *
 * The shared client's own message must never be that fallback: for a status
 * outside its fixed map (504, for one) `ApiError.message` embeds the whole
 * response body, and a failed enrich response can echo the submitted contacts.
 */
export function statusOnlyDescription(
	status: number | undefined,
	statusText: string | undefined,
): string {
	if (status === undefined) return 'request failed';
	return statusText ? `request failed (${statusText})` : 'request failed';
}

export type DropcontactQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type DropcontactRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: DropcontactQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeDropcontactRequest(
	apiKey: string,
	{ method, path, query, body }: DropcontactRequest,
): Promise<unknown> {
	// unknown: callers parse it with a zod output schema.
	const config: OpenAPIConfig = {
		BASE: DROPCONTACT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: DROPCONTACT_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			'X-Access-Token': apiKey,
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
		// unknown: see the return type.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DROPCONTACT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately dropped: `cause` is non-enumerable, but
			// util.inspect follows it, and ApiError.body holds the whole response,
			// which can echo the contacts that were submitted. Everything the
			// handlers need is copied onto this error instead.
			throw new DropcontactAPIError(
				describeDropcontactError(
					error.status,
					error.body,
					// Never error.message here: on a status outside the shared client's
					// fixed map it embeds the whole response body.
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
			throw new DropcontactAPIError(error.message, { cause: error, method });
		}
		throw new DropcontactAPIError('Unknown Dropcontact error', { method });
	}
}
