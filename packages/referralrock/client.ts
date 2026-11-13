import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The only host. */
export const REFERRALROCK_API_BASE = 'https://api.referralrock.com';

/**
 * Referral Rock authenticates with **HTTP Basic**: the account's **public** API
 * key is the username and its **private** key the password. The dashboard shows
 * both keys and a ready-made "Basic Auth Key" (`Basic <base64>`).
 *
 * The plugin stores one secret, so it takes either form:
 * - `publicKey:privateKey`, which is base64-encoded here, or
 * - the Basic Auth Key as shown, with or without the leading `Basic `.
 */
export function basicAuthHeader(apiKey: string): string {
	const key = apiKey.trim();
	if (/^basic\s+/i.test(key)) return `Basic ${key.replace(/^basic\s+/i, '')}`;
	if (key.includes(':')) {
		return `Basic ${Buffer.from(key).toString('base64')}`;
	}
	return `Basic ${key}`;
}

/**
 * Referral Rock has **two** failure shapes, and which one arrives depends on how
 * far the request got:
 *
 * - **Before routing**, as a bare 401: a text or HTML body such as
 *   `You do not have permission to view this directory or page.`
 * - **From the app**, wrapped: `{ response: { status_code, status_message, body } }`
 *
 * A 404 for a path the router does not know is `{ Message: "No HTTP resource was
 * found …" }`. A successful collection also carries a `message` field, which the
 * docs say to read for error information. A refused create (a duplicate email,
 * an unknown referral code) answers **400** with `{ message, <key>: null }`.
 */
export class ReferralrockAPIError extends Error {
	readonly status?: number;
	/** The status the app reported in `response.status_code`, when present. */
	readonly bodyStatus?: number;
	/** The `status_message` or `Message` the body carried. */
	readonly detail?: string;
	/** Milliseconds from a Retry-After header, when one arrived. */
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
			bodyStatus?: number;
			detail?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ReferralrockAPIError';
		this.status = options.status;
		this.bodyStatus = options.bodyStatus;
		this.detail = options.detail;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The API key is missing or rejected. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The member, referral or reward does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body Referral Rock refused. It validates on write, so this is a 400. */
	get isValidationError(): boolean {
		return this.status === 400;
	}

	/**
	 * A reward create Referral Rock refused. That route answers 200 with
	 * `resultInfo.Status: "Failed"`, and only that refusal raises an error with
	 * status 200, whether or not it carries a message.
	 */
	get isRejected(): boolean {
		return this.status === 200;
	}
}

/**
 * Reads the message out of either envelope.
 * unknown: the body may be parsed JSON, or raw text when the host answered
 * before routing.
 */
function detailOf(body: unknown): {
	statusCode?: number;
	statusMessage?: string;
	inner?: string;
} {
	if (typeof body === 'string') {
		const trimmed = body.trim();
		// A bare text or HTML body is the pre-routing refusal; it is not JSON.
		return { statusMessage: trimmed.length > 0 ? trimmed : undefined };
	}
	const record = asRecord(body);
	if (!record) return {};

	const wrapped = asRecord(record.response);
	if (wrapped) {
		const code = wrapped.status_code;
		const message = wrapped.status_message;
		const inner = wrapped.body;
		return {
			statusCode: typeof code === 'number' ? code : undefined,
			statusMessage: typeof message === 'string' ? message : undefined,
			inner: typeof inner === 'string' ? inner : undefined,
		};
	}

	// A 404 the router raised spells the key `Message`.
	const message = record.Message ?? record.message;
	return {
		statusMessage: typeof message === 'string' ? message : undefined,
	};
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `detailOf` narrows it.
 */
export function describeReferralrockError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { statusMessage, inner } = detailOf(body);
	// The wrapper's `status_message` is the category and `body` the detail, so
	// both are kept when they differ.
	const text =
		statusMessage !== undefined && inner !== undefined
			? `${statusMessage}: ${inner}`
			: (statusMessage ?? inner ?? fallback);
	const label = status !== undefined ? `${status}` : undefined;
	return label ? `Referral Rock ${label}: ${text}` : text;
}

export type ReferralrockQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type ReferralrockRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	/** Path below the host, starting with `/api`. */
	path: string;
	query?: ReferralrockQuery;
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
 * Referral Rock documents no throughput window, so this config exists only to
 * read a `Retry-After` if a gateway adds one; the handler owns the retry count.
 */
const REFERRALROCK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: REFERRALROCK_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: basicAuthHeader(apiKey),
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeReferralrockRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: ReferralrockRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: REFERRALROCK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { statusCode, statusMessage } = detailOf(error.body);
			// The cause holds the request, and with it the Basic credential, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new ReferralrockAPIError(
				describeReferralrockError(error.status, error.body, error.message),
				{
					status: error.status,
					bodyStatus: statusCode,
					detail: statusMessage,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ReferralrockAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new ReferralrockAPIError('Unknown Referral Rock error', {
			method,
			replayable,
		});
	}
}
