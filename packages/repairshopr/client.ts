import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * RepairShopr is multi-tenant by **subdomain**: every account lives at
 * `https://<subdomain>.repairshopr.com/api/v1`. The subdomain therefore travels
 * with the account beside the key, and a request without one cannot be built.
 */
export const REPAIRSHOPR_HOST = 'repairshopr.com';
export const REPAIRSHOPR_API_PATH = '/api/v1';

/** Builds the base URL for one account. */
export function apiBase(subdomain: string): string {
	return `https://${subdomain}.${REPAIRSHOPR_HOST}${REPAIRSHOPR_API_PATH}`;
}

/**
 * A subdomain becomes a DNS label, so it is validated rather than trusted:
 * anything outside letters, digits and hyphens would silently become a
 * different host, and a leading or trailing hyphen is not a legal label.
 */
export function isValidSubdomain(value: string): boolean {
	if (value.length < 1 || value.length > 63) return false;
	if (value.startsWith('-') || value.endsWith('-')) return false;
	return /^[a-z0-9-]+$/i.test(value);
}

/**
 * RepairShopr has two error shapes:
 *
 * - **401** before the account is resolved: `{ "error": "Failed to authenticate account" }`
 * - **422** on a rejected body: `{ success: false, message: [...], params: {…} }`
 *
 * A 404 answers either a JSON `{ error }` or an HTML page, depending on whether
 * the path reached the app, so the message falls back to the HTTP text.
 */
export class RepairshoprAPIError extends Error {
	readonly status?: number;
	/** Every message the API sent, in order. */
	readonly errors: string[];
	/** The field values RepairShopr echoed back on a validation failure. */
	// unknown: a validation echo is the caller's own body, whose values vary
	// per endpoint and have no shared type.
	readonly params?: Record<string, unknown>;
	/** Milliseconds from a Retry-After header, when RepairShopr sent one. */
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
			errors?: string[];
			// unknown: same open echo as the field above.
			params?: Record<string, unknown>;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RepairshoprAPIError';
		this.status = options.status;
		this.errors = options.errors ?? [];
		this.params = options.params;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * The account could not be resolved. RepairShopr answers this with 401 for a
	 * bad key, a wrong subdomain, or a key belonging to another account, so the
	 * distinction is not available.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The record does not exist on this account. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body RepairShopr refused; the response lists every field at fault. */
	get isValidationError(): boolean {
		return this.status === 422 || this.status === 400;
	}
}

/**
 * Reads the messages and the echoed parameters out of an error body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function errorBody(body: unknown): {
	messages: string[];
	params?: Record<string, unknown>;
} {
	const record = asRecord(body);
	const messages: string[] = [];

	const single = record?.error;
	if (typeof single === 'string' && single.length > 0) messages.push(single);

	// A validation body carries `message` as an array of strings.
	const list = record?.message;
	if (Array.isArray(list)) {
		for (const entry of list) {
			if (typeof entry === 'string' && entry.length > 0) messages.push(entry);
		}
	} else if (typeof list === 'string' && list.length > 0) {
		messages.push(list);
	}

	const params = asRecord(record?.params);
	return params ? { messages, params } : { messages };
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `errorBody` narrows it.
 */
export function describeRepairshoprError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { messages } = errorBody(body);
	const text = messages[0] ?? fallback;
	const label = status !== undefined ? `${status}` : undefined;
	const summary = label ? `RepairShopr ${label}: ${text}` : text;
	// A validation response lists every field at fault; the rest join the first.
	return messages.length > 1
		? `${summary} (${messages.slice(1).join('; ')})`
		: summary;
}

export type RepairshoprQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RepairshoprRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path below `/api/v1`, starting with a slash. */
	path: string;
	query?: RepairshoprQuery;
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
 * RepairShopr documents no throughput window and no `Retry-After`, so this
 * config exists only to read the header if a gateway adds one; the handler owns
 * the retry count.
 */
const REPAIRSHOPR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key travels as the `api_key` query parameter, which is one of the four
 * names `ApiError` redacts. The cause is still dropped rather than relying on
 * that, and the subdomain travels in the host.
 */
function configWith(subdomain: string, apiKey: string): OpenAPIConfig {
	return {
		BASE: apiBase(subdomain),
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema, so the
// client cannot name a return type.
export async function makeRepairshoprRequest(
	subdomain: string,
	apiKey: string,
	{ method, path, query, body, replayable }: RepairshoprRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, api_key: apiKey },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(
			configWith(subdomain, apiKey),
			requestOptions,
			{ rateLimitConfig: REPAIRSHOPR_RATE_LIMIT_CONFIG },
		);
	} catch (error) {
		if (error instanceof ApiError) {
			const { messages, params } = errorBody(error.body);
			// The cause holds the query string, and with it the key, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RepairshoprAPIError(
				describeRepairshoprError(error.status, error.body, error.message),
				{
					status: error.status,
					errors: messages,
					params,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RepairshoprAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RepairshoprAPIError('Unknown RepairShopr error', {
			method,
			replayable,
		});
	}
}
