import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The Users API host in the US; the EU region is `api.eu.userflow.com`. */
export const USERFLOW_API_BASE = 'https://api.userflow.com';
export const USERFLOW_EU_API_BASE = 'https://api.eu.userflow.com';

/**
 * Userflow has released one dated version, and defaults every request to the
 * latest. Sending it explicitly is what the docs recommend, so a later version
 * cannot change the shape underneath the plugin.
 */
export const USERFLOW_API_VERSION = '2020-01-03';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const USERFLOW_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

/** Wrong key on the Users API. */
const INVALID_ENV_KEY = 'invalid_api_key';
/** Wrong key on the Accounts API — a different key type entirely. */
const INVALID_PERSONAL_KEY = 'invalid_pak';

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Userflow answers every failure with `{ error: { code, message, doc_url } }`.
 *
 * The two APIs have distinct key types, and so distinct codes for a bad key:
 * `invalid_api_key` on the Users API (an environment key) and `invalid_pak` on
 * the Accounts API (a personal key). Both are reported as auth errors, since to
 * a caller the fix is the same — supply the other key.
 */
export class UserflowAPIError extends Error {
	readonly status?: number;
	/** The stable Userflow code, e.g. `invalid_api_key`. */
	readonly code?: string;
	/** A link to the relevant part of Userflow's docs, when they sent one. */
	readonly docUrl?: string;
	/** Userflow's own request id, which their support asks for. */
	readonly requestId?: string;
	/** Milliseconds from a Retry-After header, when Userflow sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shape above, but a proxy can answer
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
		this.name = 'UserflowAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const error = asRecord(asRecord(this.body)?.error);
		this.code = readString(error, 'code');
		this.docUrl = readString(error, 'doc_url');
		// The live API nests request_id inside `error`; older docs put it at the top.
		this.requestId =
			readString(error, 'request_id') ??
			readString(asRecord(this.body), 'request_id');
	}

	/** True for either key type being wrong, missing or revoked. */
	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.code === INVALID_ENV_KEY ||
			this.code === INVALID_PERSONAL_KEY
		);
	}

	/** True when the key sent was a Users API key where a personal one was needed. */
	get isWrongKeyType(): boolean {
		return this.code === INVALID_PERSONAL_KEY;
	}
}

// unknown: see UserflowAPIError.
export function describeUserflowError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	const text = readString(error, 'message') ?? fallback;
	const code = readString(error, 'code');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Userflow ${label}: ${text}` : text;
}

export type UserflowQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

/**
 * Normalises a query before it is sent. Userflow accepts `order_by` as a bare field
 * or an array and expects the repeated-key form, so a scalar becomes a one-item
 * array here rather than at each of the call sites that build a query.
 */
function normaliseQuery(
	query: UserflowQuery | undefined,
): UserflowQuery | undefined {
	if (!query) return undefined;
	const orderBy = query.order_by;
	if (typeof orderBy === 'string') {
		return { ...query, order_by: [orderBy] };
	}
	return query;
}

export type UserflowRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: UserflowQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. IDs are user-supplied strings, so this matters. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

const REDACTED = '[redacted]';

/**
 * Userflow echoes a rejected key in its message ("Invalid API key provided:
 * ak_..."), so the key is cut out of the error before anything can log it.
 */
// unknown: an error body is arbitrary JSON or text.
export function redactKey(value: unknown, apiKey: string): unknown {
	if (!apiKey) return value;
	if (typeof value === 'string') return value.split(apiKey).join(REDACTED);
	if (value === null || typeof value !== 'object') return value;
	try {
		return JSON.parse(JSON.stringify(value).split(apiKey).join(REDACTED));
	} catch {
		return undefined;
	}
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeUserflowRequest(
	apiKey: string,
	{ method, path, query, body }: UserflowRequest,
	base: string = USERFLOW_API_BASE,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			'Userflow-Version': USERFLOW_API_VERSION,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: normaliseQuery(query),
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: USERFLOW_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The ApiError is not kept as the cause: its body holds the echoed key.
			const body = redactKey(error.body, apiKey);
			throw new UserflowAPIError(
				describeUserflowError(
					error.status,
					body,
					String(redactKey(error.message, apiKey)),
				),
				{
					status: error.status,
					body,
					retryAfter: error.retryAfter,
					method: error.request.method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new UserflowAPIError(String(redactKey(error.message, apiKey)), {
				cause: error,
				method,
			});
		}
		throw new UserflowAPIError('Unknown Userflow error', { method });
	}
}

/**
 * A Users API key starts `ak_` and a personal one `pak_`; the docs show both.
 * The prefix only decides a readable message — the wrong key type is already
 * reported by the API as its own code.
 */
export function describeKeyType(
	key: string,
): 'environment' | 'personal' | 'unknown' {
	if (key.startsWith('pak_')) return 'personal';
	if (key.startsWith('ak_')) return 'environment';
	return 'unknown';
}

/** Narrows a caught value to this plugin's error. */
export function isUserflowFailure(error: unknown): error is UserflowAPIError {
	return error instanceof UserflowAPIError;
}
