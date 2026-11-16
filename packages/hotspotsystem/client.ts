import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const HOTSPOTSYSTEM_API_BASE = 'https://api.hotspotsystem.com/v2.0';

/**
 * The documented transport is a `sn-apikey` header. The API also accepts the
 * key as an HTTP Basic username with an empty password, which the same docs
 * page describes, so either way the key never travels in the URL.
 */
export const HOTSPOTSYSTEM_API_KEY_HEADER = 'sn-apikey';

/**
 * One attempt: retries belong to error-handlers.ts, so one place decides them.
 * HotspotSystem documents no rate-limit headers and no request budget, so only
 * `retry-after` is read, for a gateway that sends one anyway.
 */
const HOTSPOTSYSTEM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** A value JSON can carry; every body this API returns is JSON. */
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

/** A JSON object, which is every documented body. */
export type JsonObject = { [key: string]: JsonValue };

export type HotspotSystemQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type HotspotSystemRequest = {
	method: 'GET';
	path: string;
	query?: HotspotSystemQuery;
};

/**
 * A failure that never reached the provider: a reset connection, a DNS failure,
 * or the client's own timeout. Every operation here is a GET, so a replay can
 * never duplicate a write, but `timedOut` still separates the two so the
 * handlers can report which happened.
 */
export class HotspotSystemTransportError extends Error {
	readonly timedOut: boolean;

	constructor(message: string, timedOut: boolean, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'HotspotSystemTransportError';
		this.timedOut = timedOut;
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** Narrows a JSON value to an object, which is the only shape worth reading. */
function asRecord(value: JsonValue | undefined): JsonObject | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? value
		: undefined;
}

/**
 * HotspotSystem reports a failure as `{"error": "..."}` on the documented 500,
 * and its auth failure is the same shape on a 401. A proxy can answer with
 * something else, so this reads what it can and falls back.
 */
export function readErrorMessage(
	body: JsonValue | undefined,
): string | undefined {
	const error = asRecord(body)?.error;
	return typeof error === 'string' && error.length > 0 ? error : undefined;
}

/**
 * A provider failure. `status` and the provider's message are kept because they
 * are what the handlers and the caller read; the body itself is dropped, since
 * HotspotSystem echoes the operator's own values into some messages.
 */
export class HotspotSystemAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from `Retry-After`, when a gateway sent one. */
	readonly retryAfter?: number;
	readonly method: string;

	constructor(
		message: string,
		options: {
			status?: number;
			retryAfter?: number;
			method: string;
		},
	) {
		super(message);
		this.name = 'HotspotSystemAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}
}

/** Renders a failure for a message a person reads. */
export function describeFailure(
	status: number | undefined,
	body: JsonValue | undefined,
	fallback: string,
): string {
	const text = readErrorMessage(body) ?? fallback;
	return status === undefined
		? `HotspotSystem: ${text}`
		: `HotspotSystem ${status}: ${text}`;
}

/**
 * Reads the next page's offset from the documented `Link` response header,
 * whose documented form is
 * `<https://api.hotspotsystem.com/v2.0/locations?limit=10&offset=10>; rel="next"`.
 * Absent when there is no next page.
 */
export function nextOffsetFromLinkHeader(
	link: string | null | undefined,
): number | undefined {
	if (!link) return undefined;
	// Several relations can share one header, comma separated.
	for (const part of link.split(',')) {
		// Anchored: an unanchored match accepts `rel="nextish"`, which is a
		// different relation.
		if (!/rel="?next"?(?:\s*;|\s*$)/.test(part)) continue;
		const url = part.match(/<([^>]+)>/)?.[1];
		if (!url) continue;
		const offset = /[?&]offset=([^&>\s]+)/.exec(url)?.[1];
		if (offset === undefined) continue;
		const value = Number(offset);
		return Number.isFinite(value) && value >= 0 ? value : undefined;
	}
	return undefined;
}

export function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: HOTSPOTSYSTEM_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Set on the config rather than on the request headers so the key is not
		// copied into `ApiError.request`, which is enumerable on the error.
		HEADERS: {
			Accept: 'application/json',
			[HOTSPOTSYSTEM_API_KEY_HEADER]: apiKey,
		},
	};
}

/**
 * Sends one request. Resolves with the parsed body, or `undefined` for the
 * bodyless answers; every documented success here carries a body.
 *
 * Pagination needs the `Link` response header, and `corsair/http` cannot return
 * a header and a body together: its `ApiResult.body` is
 * `responseHeader ?? responseBody`, so asking for the header discards the body.
 * The paged reads therefore go through `makeHotspotSystemPageRequest` below,
 * and everything else uses this.
 */
export async function makeHotspotSystemRequest(
	apiKey: string,
	request_: HotspotSystemRequest,
): Promise<JsonValue | undefined> {
	const requestOptions: ApiRequestOptions = {
		method: request_.method,
		url: request_.path,
		query: request_.query,
	};

	try {
		return await request<JsonValue>(configWith(apiKey), requestOptions, {
			rateLimitConfig: HOTSPOTSYSTEM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new HotspotSystemAPIError(
				describeFailure(
					error.status,
					error.body,
					error.statusText || error.message,
				),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					method: request_.method,
				},
			);
		}
		const exception =
			error instanceof Error || error instanceof DOMException
				? error
				: undefined;
		if (exception) {
			throw new HotspotSystemTransportError(
				exception.message,
				exception.name === 'TimeoutError',
				exception,
			);
		}
		throw new HotspotSystemTransportError('Unknown HotspotSystem error', false);
	}
}

export type HotspotSystemPage = {
	// unknown: the page body is untyped until an endpoint's output schema parses it.
	body: unknown;
	/** The `offset` of the next page, when the `Link` header names one. */
	next_offset?: number;
};

/**
 * Fetches one page together with its next offset.
 *
 * `corsair/http` cannot serve this: reading a header discards the body, and
 * pagination needs both. So this makes the request with the same config the
 * shared client builds, and normalises every failure through the same two error
 * types, which is what the plugin's handlers match on.
 */
export async function makeHotspotSystemPageRequest(
	apiKey: string,
	request_: HotspotSystemRequest,
): Promise<HotspotSystemPage> {
	const config = configWith(apiKey);
	const url = new URL(`${config.BASE}${request_.path}`);
	for (const [key, value] of Object.entries(request_.query ?? {})) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}

	// `configWith` sets HEADERS as a plain object, so reading it back through
	// the union type on OpenAPIConfig is what needs narrowing here.
	const headers = config.HEADERS as Record<string, string>;
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers,
			signal: AbortSignal.timeout(20_000),
		});
	} catch (error) {
		const exception =
			error instanceof Error || error instanceof DOMException
				? error
				: undefined;
		if (exception) {
			throw new HotspotSystemTransportError(
				exception.message,
				exception.name === 'TimeoutError',
				exception,
			);
		}
		throw new HotspotSystemTransportError('Unknown HotspotSystem error', false);
	}

	let text: string;
	try {
		text = await response.text();
	} catch (error) {
		// The connection can drop after the headers arrive. A failed response is
		// still described by its status, so that is kept; a 2xx with no readable
		// body has nothing to return.
		if (response.ok) {
			const exception =
				error instanceof Error || error instanceof DOMException
					? error
					: undefined;
			throw new HotspotSystemTransportError(
				exception?.message ?? 'Unknown HotspotSystem error',
				exception?.name === 'TimeoutError',
				exception,
			);
		}
		text = '';
	}

	// unknown: the body is untyped until the caller's output schema parses it.
	let body: unknown;
	try {
		body = text.length > 0 ? JSON.parse(text) : undefined;
	} catch {
		body = text;
	}

	if (!response.ok) {
		throw new HotspotSystemAPIError(
			describeFailure(
				response.status,
				body as JsonValue,
				response.statusText || `request failed`,
			),
			{
				status: response.status,
				retryAfter: parseRetryAfter(response.headers.get('retry-after')),
				method: 'GET',
			},
		);
	}

	return {
		body,
		next_offset: nextOffsetFromLinkHeader(response.headers.get('link')),
	};
}

function parseRetryAfter(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;
}
