import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TIKHUB_API_BASE = 'https://api.tikhub.io';

// TikHub documents a 30-60s timeout window; upstream scrapes can be slow.
const TIKHUB_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const TIKHUB_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type TikHubQuery = Record<string, string | number | boolean | undefined>;

/**
 * TikHub error bodies look like
 * `{ detail: { code, request_id, message, message_zh, router, params, ... } }`.
 * Some upstream failures answer HTTP 200 with a non-2xx `code` in the
 * envelope instead; `fromEnvelope` covers those.
 */
export class TikHubAPIError extends Error {
	readonly status?: number;
	readonly code?: number;
	readonly requestId?: string;
	readonly router?: string;
	readonly retryAfter?: number;
	// unknown: error bodies are usually the `detail` object above, but a proxy
	// or Cloudflare can answer with text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TikHubAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const detail = detailOf(this.body);
		this.code = readNumber(detail, 'code');
		this.requestId = readString(detail, 'request_id');
		this.router = readString(detail, 'router');
	}
}

// unknown: the body is untrusted until these guards run.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// unknown: HTTP errors wrap fields in `detail`; envelope errors carry them
// at the top level.
function detailOf(body: unknown): Record<string, unknown> | undefined {
	const record = asRecord(body);
	if (!record) return undefined;
	return asRecord(record.detail) ?? record;
}

function readString(
	record: Record<string, unknown> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(
	record: Record<string, unknown> | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

// TikHub's 401 message echoes the first characters of the submitted token
// ("your submitted API token is abcd1234***"). Keep that out of error text.
export function redactTokenEcho(message: string): string {
	return message.replace(/(API token is )\S*\*{3}/gi, '$1[redacted]');
}

// unknown: see detailOf.
export function describeTikHubError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message = readString(detailOf(body), 'message');
	const text = redactTokenEcho(message ?? fallback);
	return status !== undefined ? `TikHub ${status}: ${text}` : text;
}

/**
 * A 2xx response whose envelope `code` is 400 or above is a failed call that
 * TikHub did not bill. Returns the error to throw, or undefined.
 */
// unknown: raw provider JSON before the endpoint's output schema parses it.
export function errorFromEnvelope(body: unknown): TikHubAPIError | undefined {
	const code = readNumber(asRecord(body), 'code');
	if (code === undefined || code < 400) return undefined;
	return new TikHubAPIError(
		describeTikHubError(code, body, 'TikHub request failed'),
		{ status: code, body },
	);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTikHubRequest(
	path: string,
	apiKey: string,
	query?: TikHubQuery,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TIKHUB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: TIKHUB_TIMEOUT_MS,
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TIKHUB_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new TikHubAPIError(
				describeTikHubError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new TikHubAPIError((error as Error).message, {
				cause: error as Error,
			});
		}
		throw new TikHubAPIError('Unknown TikHub API error');
	}
}
