import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Neutrino API runs the same service behind several endpoints with cloud
 * failover: the multicloud `neutrinoapi.net` host first, then single-cloud and
 * geofenced hosts. The multicloud host is the documented default.
 */
export const NEUTRINO_API_BASE = 'https://neutrinoapi.net';

// Retries belong to error-handlers.ts. Neutrino documents no Retry-After, so
// the name is kept only so a proxy that sends one is honoured.
const NEUTRINO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Neutrino takes two credentials on every call: the account's `user-id` and one
 * of its API keys. Its own docs allow combining them in one `API-Key` header as
 * `user-id:api-key`, which is what this plugin sends, so neither credential
 * lands in a query string that a proxy would log.
 */
export type NeutrinoCredentials = { userId: string; apiKey: string };

/** The code Neutrino sends when the credentials are wrong or missing. */
const ACCESS_DENIED = 43;

// unknown: the record is an untyped error body; one field is read at a time.
function readNumber(
	record: Record<string, unknown> | null | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' ? value : undefined;
}

// unknown: see readNumber.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Every error is `{ "api-error": <number>, "api-error-msg": "..." }` with a
 * non-200 status. The numeric code is what distinguishes a bad credential (43)
 * from a bad parameter, and the message is always upper case.
 */
export class NeutrinoAPIError extends Error {
	readonly status?: number;
	/** Neutrino's own numeric code, e.g. 43 for a bad user id or key. */
	readonly code?: number;
	/**
	 * True for a route whose success includes a side effect that cannot be
	 * repeated, so a 5xx must not be replayed.
	 */
	readonly sendsMessage: boolean;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			sendsMessage?: boolean;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NeutrinoAPIError';
		this.status = options.status;
		this.code = options.code;
		this.sendsMessage = options.sendsMessage ?? false;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/**
	 * 43 is the only credential code. A 403 with another code is a plan or
	 * permission limit, which the handlers separate.
	 */
	get isAuthError(): boolean {
		return this.code === ACCESS_DENIED || this.status === 401;
	}
}

// unknown: see NeutrinoAPIError.
export function describeNeutrinoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'api-error-msg') ??
		(typeof body === 'string' && body.length > 0
			? body.slice(0, 200)
			: undefined) ??
		fallback;
	const code = readNumber(record, 'api-error');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Neutrino ${label}: ${text}` : text;
}

export type NeutrinoQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type NeutrinoRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: NeutrinoQuery;
	/**
	 * True when a success sends a message, which cannot be repeated safely on a
	 * 5xx. Set by messaging.smsVerify and carried onto the error.
	 */
	sendsMessage?: boolean;
	/** A urlencoded body, which is the form Neutrino documents for POST. */
	form?: Record<string, string | number | boolean | undefined>;
};

// unknown: callers parse the body with the endpoint's zod output schema. Several
// Neutrino methods answer a file rather than JSON, so a caller checks first.
export async function makeNeutrinoRequest(
	credentials: NeutrinoCredentials,
	{ method, path, query, form, sendsMessage }: NeutrinoRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NEUTRINO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'API-Key': `${credentials.userId}:${credentials.apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		// Neutrino takes POST parameters urlencoded, and `corsair/http` passes a
		// string body through with whatever media type it is given.
		body: form
			? new URLSearchParams(form as Record<string, string>).toString()
			: undefined,
		mediaType: form ? 'application/x-www-form-urlencoded' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NEUTRINO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new NeutrinoAPIError(
				describeNeutrinoError(error.status, error.body, error.message),
				{
					status: error.status,
					code: readNumber(asRecord(error.body), 'api-error'),
					sendsMessage,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NeutrinoAPIError(error.message, { cause: error, method });
		}
		throw new NeutrinoAPIError('Unknown Neutrino error', { method });
	}
}
