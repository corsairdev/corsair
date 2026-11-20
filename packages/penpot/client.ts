import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Penpot documents no rate-limit retry contract, so 429s get core's
 * standard handling: up to three retries honouring Retry-After (R8: the
 * plugin adds no second retry layer). A 429 is refused before the call
 * runs, so a retry is safe for the writes too.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A failed call throws this: core's `ApiError` (R8: core and the handlers
 * read `status` and `retryAfter` from it), rebuilt without the request body
 * and query. Penpot errors are `{ type, code, hint }` with HTTP 4xx.
 */
export class PenpotAPIError extends ApiError {
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method: string;

	constructor(
		message: string,
		options: {
			method: string;
			/** Request path, without query. */
			path: string;
			status: number;
			statusText?: string;
			// unknown: error bodies can be the { type, code, hint } envelope
			// or transit-encoded from a proxy.
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(
			{
				method: options.method as ApiRequestOptions['method'],
				url: options.path,
			},
			{
				url: options.path,
				ok: false,
				status: options.status,
				statusText: options.statusText ?? '',
				body: options.body,
			},
			message,
			{ retryAfter: options.retryAfter },
		);
		this.name = 'PenpotAPIError';
		this.method = options.method;
	}
}

/**
 * Extracts the readable part of a Penpot error body. Errors are
 * `{"type":"authentication","code":"authentication-required","hint":"authentication required for this endpoint"}`
 * (verified live with an invalid token).
 */
export function describePenpotError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.hint === 'string' && record.hint.length > 0
			? record.hint
			: undefined) ??
		(typeof record?.code === 'string' && record.code.length > 0
			? record.code
			: undefined) ??
		fallback;
	return text;
}

export type PenpotRequest = {
	/** RPC name, e.g. create-team. */
	rpcName: string;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across RPC shapes.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Penpot RPC request. Every RPC is a POST to
 * `/api/rpc/command/<name>`; access tokens authenticate with
 * `Authorization: Token <token>`, and Accept: application/json gets plain
 * JSON back instead of transit-encoded data.
 * https://help.penpot.app/technical-guide/integration/
 */
export async function makePenpotRequest(
	apiKey: string,
	{ rpcName, body }: PenpotRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://design.penpot.app',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Token ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/api/rpc/command/${encodeURIComponent(rpcName)}`,
		body,
		mediaType: 'application/json',
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (file and comment content). Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status.
			const detail = describePenpotError(
				error.body,
				error.statusText || 'request failed',
			);
			throw new PenpotAPIError(`Penpot ${error.status}: ${detail}`, {
				method: 'POST',
				path: `/api/rpc/command/${rpcName}`,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
				retryAfter: error.retryAfter,
			});
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
