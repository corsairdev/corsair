import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Every Pointagram call goes to the same versioned base. Custom Api 2.0 is the
 * current one: the docs' server entry is `https://app.pointagram.com/api/20`,
 * and `api.pointagram.com` does not resolve.
 */
export const POINTAGRAM_API_BASE = 'https://app.pointagram.com/api/20';

/** The two headers Pointagram authenticates with, documented in its API header section. */
export const POINTAGRAM_KEY_HEADER = 'Api-Key';
export const POINTAGRAM_USER_HEADER = 'Api-User';

/**
 * Pointagram documents no rate limit and sends no Retry-After, so this keeps the
 * defaults intact (a partial object replaces them wholesale) and lets
 * `error-handlers.ts` own retries.
 */
const POINTAGRAM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type PointagramCredentials = {
	/** The Custom Integration key, `Api-Key`. */
	apiKey: string;
	/** The Pointagram login the key belongs to, `Api-User`. */
	apiUser: string;
};

/**
 * Pointagram answers a missing or wrong key with HTTP 404 and the body
 * `{ "status": "Error", "message": "Invalid Credentials", "data": {} }`, not
 * with a 401. That body is the only thing distinguishing an auth failure from a
 * genuinely missing route, so the check lives here and the handlers match on the
 * resolved flag instead of re-deriving it.
 */
const INVALID_CREDENTIALS = /invalid credentials/i;

// untrusted: error bodies are untyped JSON until narrowed one field at a time.
// The guard returns a record whose members stay untyped, because only the caller
// knows which field it is about to read.
function asRecord(
	value: unknown, // unknown: untrusted JSON, narrowed below.
): Record<string, unknown> | undefined {
	// unknown: untrusted JSON, narrowed by the guard above; members stay untyped.
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>) // unknown: narrowed by the guard above.
		: undefined;
}

function readString(
	// unknown: an asRecord() result, whose values have no static type.
	record: Record<string, unknown> | undefined, // unknown: see asRecord above.
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** `status` is `"Ok"` on success and `"Error"` on failure. */
export function readEnvelopeStatus(
	body: unknown, // unknown: the provider's response body before validation.
): string | undefined {
	return readString(asRecord(body), 'status');
}

export function readEnvelopeMessage(
	body: unknown, // unknown: the provider's response body before validation.
): string | undefined {
	return readString(asRecord(body), 'message');
}

/** True when the envelope's message is Pointagram's credential rejection. */
export function reportsInvalidCredentials(
	body: unknown, // unknown: the provider's response body before validation.
): boolean {
	const message = readEnvelopeMessage(body);
	return message !== undefined && INVALID_CREDENTIALS.test(message);
}

/** True when the response is Pointagram's credential rejection. */
export function isCredentialRejection(
	status: number | undefined,
	body: unknown, // unknown: the provider's response body before validation.
): boolean {
	if (status !== 404 && status !== 401 && status !== 403) return false;
	return reportsInvalidCredentials(body);
}

/**
 * The failure shapes core's `ApiError` cannot carry: a dropped connection, and a
 * 2xx body with `status: "Error"`, which has no HTTP status at all. Both build
 * this error; a real HTTP failure keeps core's `ApiError` (see
 * {@link makePointagramRequest}) so its status and Retry-After stay readable.
 */
export class PointagramAPIError extends Error {
	/** Unset on an envelope failure, which arrived over HTTP 200. */
	readonly status?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached Pointagram (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when Pointagram rejected the key, which it reports as a 404. */
	readonly credentialsRejected: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			method?: string;
			transport?: boolean;
			credentialsRejected?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PointagramAPIError';
		this.status = options.status;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
	}
}

/**
 * A 2xx envelope whose `status` is `"Error"` is a failed call: create player
 * answers an existing player this way, and Pointagram's own delete docs say an
 * absent player comes back "http ok and an error message".
 */
export function errorFromEnvelope(
	body: unknown, // unknown: raw provider JSON before the output schema parses it.
	method: string,
): PointagramAPIError | undefined {
	const status = readEnvelopeStatus(body);
	if (status === undefined || !/^error$/i.test(status)) return undefined;
	return new PointagramAPIError(
		readEnvelopeMessage(body) ?? 'Pointagram reported an error',
		{ method },
	);
}

/** Rejects credentials that would break the header they travel in. */
export function assertHeaderSafe(value: string, label: string): void {
	if (/[\r\n]/.test(value)) {
		throw new PointagramAPIError(
			`${label} must not contain newline characters`,
			{ transport: false },
		);
	}
}

export type PointagramQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type PointagramRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: PointagramQuery;
	body?: unknown; // unknown: already validated by the endpoint's input schema.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Reads `Api-User`. It is a second credential rather than part of the key, so it
 * lives on the account next to `api_key` and is read through the account key
 * manager; the client never reads a credential from `ctx.options`.
 */
export async function resolvePointagramApiUser(ctx: {
	keys?: { get_api_user?: () => Promise<string | null | undefined> };
}): Promise<string> {
	const stored = ctx.keys?.get_api_user ? await ctx.keys.get_api_user() : null;
	const trimmed = stored?.trim();
	if (!trimmed) {
		throw new AuthMissingError('pointagram', 'api_key');
	}
	return trimmed;
}

// The body is returned untyped: callers parse it with the endpoint's zod
// output schema, which is the only thing that knows its shape.
export async function makePointagramRequest(
	credentials: PointagramCredentials,
	{ method, path, query, body }: PointagramRequest,
): Promise<unknown> {
	// unknown: the body is parsed by the caller's output schema.
	if (!credentials.apiKey.trim() || !credentials.apiUser.trim()) {
		throw new AuthMissingError('pointagram', 'api_key');
	}
	assertHeaderSafe(credentials.apiKey, 'Api-Key');
	assertHeaderSafe(credentials.apiUser, 'Api-User');

	const config: OpenAPIConfig = {
		BASE: POINTAGRAM_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			[POINTAGRAM_KEY_HEADER]: credentials.apiKey,
			[POINTAGRAM_USER_HEADER]: credentials.apiUser,
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
		// request() returns the parsed body, which no schema has seen yet.
		return await request<unknown>(config, requestOptions, {
			// unknown: the caller's output schema parses the body returned here.
			rateLimitConfig: POINTAGRAM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// A real HTTP failure keeps core's ApiError: its status and Retry-After are
		// what the handlers match and what core reads. Only a failure core cannot
		// express becomes a PointagramAPIError below.
		if (error instanceof ApiError) throw error;
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PointagramAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PointagramAPIError('Unknown Pointagram error', {
			method,
			transport: true,
		});
	}
}
