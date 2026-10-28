import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const INSTANTLY_API_BASE = 'https://api.instantly.ai/api/v2';

const INSTANTLY_TIMEOUT_MS = 30_000;

// error-handlers.ts owns retries and only retries reads, so the client makes
// one attempt and reads Retry-After into the error. Left at corsair/http's
// default, a 429 on emails.reply or leads.addBulk would be replayed here.
const INSTANTLY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Instantly error bodies are Fastify's `{ statusCode, error, message, code? }`,
 * e.g. `{ statusCode: 404, error: 'Not Found', message: 'Campaign not found' }`
 * or `{ statusCode: 400, code: 'FST_ERR_VALIDATION', error: 'Bad Request',
 * message: 'querystring/limit must be <= 100' }` (both seen live 2026-10-28).
 */
export class InstantlyAPIError extends Error {
	readonly status?: number;
	/** Fastify's short reason, e.g. `Bad Request`. */
	readonly reason?: string;
	/** Machine-readable code when present, e.g. `FST_ERR_VALIDATION`. */
	readonly code?: string;
	/** Milliseconds from the Retry-After header, when Instantly sent one. */
	readonly retryAfter?: number;
	// unknown: error bodies are usually the shape above, but a proxy or
	// Cloudflare can answer with HTML or text.
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
		this.name = 'InstantlyAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const record = asRecord(this.body);
		this.reason = readString(record, 'error');
		this.code = readString(record, 'code');
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// What a status usually means on Instantly, for errors whose body says little.
const STATUS_HINTS: Record<number, string> = {
	401: 'the API key is missing, invalid or revoked',
	402: 'the workspace has no active paid plan for this feature',
	403: "the API key's scopes or the workspace's plan do not cover this endpoint (webhooks need Hypergrowth or higher)",
	429: 'rate limited (the workspace shares 100 requests/second and 6,000/minute; emails.list allows 20/minute)',
};

// unknown: see InstantlyAPIError.
export function describeInstantlyError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'message') ?? readString(record, 'error') ?? fallback;
	if (status === undefined) return text;
	const hint = STATUS_HINTS[status];
	return hint
		? `Instantly ${status}: ${text} (${hint})`
		: `Instantly ${status}: ${text}`;
}

export type InstantlyQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type InstantlyRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: InstantlyQuery;
	// Bodiless POSTs (activate, pause, mark as read) send no body and no
	// Content-Type, as Instantly's SDK does: Fastify rejects an empty body
	// labelled application/json.
	body?: Record<string, unknown>;
};

/** Encodes one path segment, e.g. an account email or a UUID. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeInstantlyRequest(
	apiKey: string,
	{ method, path, query, body }: InstantlyRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: INSTANTLY_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: INSTANTLY_TIMEOUT_MS,
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
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
			rateLimitConfig: INSTANTLY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new InstantlyAPIError(
				describeInstantlyError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new InstantlyAPIError((error as Error).message, {
				cause: error as Error,
			});
		}
		throw new InstantlyAPIError('Unknown Instantly error');
	}
}
