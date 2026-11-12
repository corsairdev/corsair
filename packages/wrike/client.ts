import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Wrike runs the same API v4 on three hosts, and an account lives on exactly
 * one of them. Nothing in a token says which, so the host is a plugin option.
 */
export const WRIKE_HOSTS = {
	www: 'https://www.wrike.com',
	eu: 'https://app-eu.wrike.com',
	us2: 'https://app-us2.wrike.com',
} as const;

export type WrikeHost = keyof typeof WRIKE_HOSTS;

export const WRIKE_API_BASE = `${WRIKE_HOSTS.www}/api/v4`;

const WRIKE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Wrike answers a failure as `{ error, errorDescription }`, where `error` is a
 * short name such as `not_authorized` or `invalid_parameter`.
 *
 * The auth message matters: `Authorization method unknown` means no header was
 * sent at all, and `Access token is unknown or invalid` means one was sent and
 * is wrong — both 401, but different fixes.
 */
export class WrikeAPIError extends Error {
	readonly status?: number;
	/** The short name, e.g. `not_authorized`. */
	readonly code?: string;
	/** Wrike's own description, which is usually more specific than the name. */
	readonly description?: string;
	/** Milliseconds from a Retry-After header, when Wrike sent one. */
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
		this.name = 'WrikeAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const record = asRecord(this.body);
		this.code = readString(record, 'error');
		this.description = readString(record, 'errorDescription');
	}

	/** True when no Authorization header was sent at all. */
	get isMissingToken(): boolean {
		return this.description === 'Authorization method unknown';
	}

	/** True when a token was sent but is unknown or expired. */
	get isInvalidToken(): boolean {
		return this.description === 'Access token is unknown or invalid';
	}

	/**
	 * True for either auth failure. A missing token and a bad one are different
	 * diagnoses, but both mean the credential needs fixing rather than the
	 * request, so no retry helps.
	 */
	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.code === 'not_authorized' ||
			this.isMissingToken ||
			this.isInvalidToken
		);
	}

	/** True when the token is valid but the scope does not cover the call. */
	get isForbidden(): boolean {
		return this.status === 403 || this.code === 'access_denied';
	}
}

// unknown: see WrikeAPIError.
export function describeWrikeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'errorDescription') ??
		readString(record, 'error') ??
		fallback;
	const code = readString(record, 'error');
	// The code is often redundant with the description, so it is only a label.
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Wrike ${label}: ${text}` : text;
}

export type WrikeQuery = Record<string, string | number | boolean | undefined>;

export type WrikeRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: WrikeQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Overrides the media type, for a form-encoded call. */
	mediaType?: string;
};

/** Encodes one path segment; ids come from the caller. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Wrike addresses ids with a prefix: `IEAAxxxx` for a task, `IEAxxxx` for a
 * folder, `KUxxxx` for a contact. The prefix is part of the id, so this only
 * encodes and never rewrites.
 */
export function id(value: string): string {
	return segment(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeWrikeRequest(
	apiKey: string,
	{ method, path, query, body, mediaType }: WrikeRequest,
	base: string = WRIKE_API_BASE,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '4.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// Wrike documents the scheme in lowercase, which it accepts.
			Authorization: `bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType:
			body === undefined ? undefined : (mediaType ?? 'application/json'),
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema parses
		// it; `request` cannot know the operation's shape.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WRIKE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new WrikeAPIError(
				describeWrikeError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WrikeAPIError(error.message, { cause: error, method });
		}
		throw new WrikeAPIError('Unknown Wrike error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isWrikeFailure(error: unknown): error is WrikeAPIError {
	return error instanceof WrikeAPIError;
}
