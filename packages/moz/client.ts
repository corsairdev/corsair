import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The Moz API exposes one universal JSON-RPC 2.0 endpoint; the method name in
 * the body picks the operation.
 * https://moz.com/api/docs/guides/getting-started
 */
const MOZ_JSONRPC_URL = 'https://api.moz.com';
const MOZ_JSONRPC_PATH = '/jsonrpc';

export type MozCallContext = {
	key: string;
};

/**
 * The request id must be at least 24 characters of letters, numbers and
 * hyphens (dots and underscores are rejected); a V4 UUID satisfies both the
 * length and the character rules.
 */
export function mozRequestId(): string {
	return crypto.randomUUID();
}

/**
 * Moz errors: every failure carries a JSON-RPC 2.0 error member with a stable
 * `code`, an HTTP status repeated as `status` or `httpStatus` depending on the
 * layer that produced it, and a `data` object whose `issue` field is meant for
 * branching. https://moz.com/api/docs/guides/error-handling
 */
export class MozAPIError extends Error {
	/** JSON-RPC error code, e.g. -32651 for a failed authentication. */
	readonly code?: number;
	/** HTTP status, normalised from the envelope's `status`/`httpStatus`. */
	readonly status?: number;
	/** Machine-readable category from `error.data.issue`, e.g. rate_limited. */
	readonly issue?: string;
	/** Dot path to the offending request field, from `error.data.key`. */
	readonly key?: string;
	/** Seconds from a Retry-After header on a per-method rate limit (-32658). */
	readonly retryAfter?: number;
	/** The JSON-RPC method of the failed request. */
	readonly method?: string;
	/** True when a 5xx or a network drop can replay the request. */
	readonly replayable?: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			code?: number;
			status?: number;
			issue?: string;
			key?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MozAPIError';
		this.code = options.code;
		this.status = options.status;
		this.issue = options.issue;
		this.key = options.key;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable;
	}
}

/**
 * Prefers the envelope's message over the HTTP fallback; keeps the wording
 * stable even when Moz changes messages, because callers branch on `code`.
 */
export function describeMozError(
	code: number | undefined,
	// unknown: the error body is an untyped JSON-RPC envelope until narrowed.
	body: unknown,
	fallback: string,
): string {
	const error = asRecord(asRecord(body)?.error);
	const message =
		typeof error?.message === 'string' && error.message.length > 0
			? error.message
			: fallback;
	const label = [code].filter((part) => part !== undefined).join(' ');
	return label ? `Moz ${label}: ${message}` : `Moz: ${message}`;
}

/** The JSON-RPC error member, as documented in the error handling guide. */
type MozErrorMember = {
	code?: number;
	status?: number;
	httpStatus?: number;
	message?: string;
	data?: {
		issue?: unknown;
		// unknown: the guide says key and value echo the offending request
		// field "where echoing it back is useful", so they can be anything.
		key?: unknown;
		value?: unknown;
		explanation?: unknown;
	};
};

export type MozRequest = {
	/** The JSON-RPC method name, e.g. `data.site.metrics.fetch`. */
	method: string;
	/** The method-specific payload, sent as `params.data`. */
	// unknown: each endpoint's input schema has already validated the payload.
	data?: unknown;
	/** True when a 5xx or a network drop can replay the request: reads only. */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. The docs define both edge limits (no
// window) and per-method limits (Retry-After).
const MOZ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one JSON-RPC request and returns the `result` member. A body that
 * carries an `error` member is a failure regardless of the HTTP status.
 */
export async function makeMozRequest(
	ctx: MozCallContext,
	{ method, data, replayable }: MozRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.moz.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-moz-token': ctx.key,
		},
	};

	const requestId = mozRequestId();
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: MOZ_JSONRPC_PATH,
		body: {
			jsonrpc: '2.0',
			id: requestId,
			method,
			params: { data: data ?? {} },
		},
		mediaType: 'application/json',
	};

	try {
		// unknown: the response body is an untyped JSON-RPC envelope until the
		// branches below narrow it.
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: MOZ_RATE_LIMIT_CONFIG,
		});
		const envelope = asRecord(raw);
		const errorMember = asRecord(envelope?.error) as MozErrorMember | undefined;
		if (errorMember) {
			// A 2xx body that still says error is a failure: report it rather
			// than returning a result the caller cannot trust.
			throw new MozAPIError(
				describeMozError(
					errorMember.code,
					raw,
					'The Moz API reported an error.',
				),
				{
					code: errorMember.code,
					status: errorMember.status ?? errorMember.httpStatus,
					issue:
						typeof errorMember.data?.issue === 'string'
							? errorMember.data.issue
							: undefined,
					key:
						typeof errorMember.data?.key === 'string'
							? errorMember.data.key
							: undefined,
					method,
					replayable,
				},
			);
		}
		if (!envelope || !('result' in envelope)) {
			throw new MozAPIError(`Moz API returned no result for ${method}.`, {
				method,
				replayable,
			});
		}
		return envelope.result;
	} catch (caught) {
		// Rethrow our own error untouched so handlers see code and issue.
		if (caught instanceof MozAPIError) {
			throw caught;
		}
		if (caught instanceof ApiError) {
			const envelope = asRecord(caught.body);
			const errorMember = asRecord(envelope?.error) as
				| MozErrorMember
				| undefined;
			throw new MozAPIError(
				describeMozError(errorMember?.code, caught.body, caught.message),
				{
					// The token rides in a header that only the cause carries; drop
					// the cause so no error path can print it. The envelope itself
					// never echoes the token.
					code: errorMember?.code,
					status:
						errorMember?.status ?? errorMember?.httpStatus ?? caught.status,
					issue:
						typeof errorMember?.data?.issue === 'string'
							? errorMember.data.issue
							: undefined,
					key:
						typeof errorMember?.data?.key === 'string'
							? errorMember.data.key
							: undefined,
					retryAfter: caught.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		// A transport failure never reached Moz, so the cause is safe to keep.
		if (caught instanceof Error || caught instanceof DOMException) {
			throw new MozAPIError(caught.message, {
				cause: caught instanceof Error ? caught : undefined,
				method,
				replayable,
			});
		}
		throw new MozAPIError('Unknown Moz error', { method, replayable });
	}
}
