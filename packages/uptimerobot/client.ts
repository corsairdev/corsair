import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const UPTIMEROBOT_API_BASE = 'https://api.uptimerobot.com/v3';

/**
 * The free plan allows 10 requests a minute and paid plans monitorLimit * 2
 * (max 5,000), so a 429 is a real wait rather than a burst to ride out.
 */
const UPTIMEROBOT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 2000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

/** The stable code from `{ code, message }`, e.g. `003-005` for a bad token. */
const INVALID_TOKEN_CODE = '003-005';

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * UptimeRobot answers every failure with `{ code, message }`, where `code` is a
 * stable identifier such as `003-005` (invalid token) or `009-002` (not found).
 * A validation failure also carries `statusCode` and `error`, and `message` is
 * then an array of per-field strings rather than one string.
 */
export class UptimeRobotAPIError extends Error {
	readonly status?: number;
	/** The stable UptimeRobot code, e.g. `003-005`. */
	readonly code?: string;
	/** Per-field validation messages, when UptimeRobot sent an array. */
	readonly details?: readonly string[];
	/** Milliseconds from a Retry-After header, when UptimeRobot sent one. */
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
		this.name = 'UptimeRobotAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const record = asRecord(this.body);
		this.code = readString(record, 'code');
		const fieldMessages = record?.message;
		this.details = Array.isArray(fieldMessages)
			? fieldMessages.filter((part): part is string => typeof part === 'string')
			: undefined;
	}

	/** True for an expired, revoked or wrong token. */
	get isAuthError(): boolean {
		return this.status === 401 || this.code === INVALID_TOKEN_CODE;
	}

	/** True when the monitor, status page or other resource is gone. */
	get isNotFound(): boolean {
		// UptimeRobot documents 404 for a missing resource. The numeric code for
		// it is not published alongside the status, so this reads the status.
		return this.status === 404;
	}
}

// unknown: see UptimeRobotAPIError.
export function describeUptimeRobotError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message = record?.message;
	// A validation failure sends an array of per-field messages.
	const text = Array.isArray(message)
		? message.filter((part) => typeof part === 'string').join('; ')
		: (readString(record, 'message') ?? fallback);
	const code = readString(record, 'code');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `UptimeRobot ${label}: ${text}` : text;
}

/** Narrows a caught value to this plugin's error. */
export function isUptimeRobotFailure(
	error: unknown,
): error is UptimeRobotAPIError {
	return error instanceof UptimeRobotAPIError;
}

export type UptimeRobotQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type UptimeRobotRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: UptimeRobotQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the 204s: deleting a monitor, a tag or a status page.
export async function makeUptimeRobotRequest(
	apiKey: string,
	{ method, path, query, body }: UptimeRobotRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: UPTIMEROBOT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: UPTIMEROBOT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new UptimeRobotAPIError(
				describeUptimeRobotError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new UptimeRobotAPIError(error.message, { cause: error, method });
		}
		throw new UptimeRobotAPIError('Unknown UptimeRobot error', { method });
	}
}
