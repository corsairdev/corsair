import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const HAPPYSCRIBE_API_BASE = 'https://www.happyscribe.com/api/v1';

// error-handlers.ts owns retries, so the transport makes one attempt.
// headerNames stay empty: HappyScribe signals its rate limit through a
// `retry_in_seconds` field in the 429 body, not a header.
const HAPPYSCRIBE_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {},
};

/**
 * HappyScribe error bodies are not prominently documented; observed and
 * documented fields are `message` and `error`, with a `retry_in_seconds`
 * number on the rate-limited transcription-creation answer.
 */
export class HappyScribeAPIError extends Error {
	readonly status?: number;
	// unknown: error bodies are not documented beyond message fields; a
	// proxy can answer with HTML or text.
	readonly body?: unknown;
	/**
	 * Seconds to wait before retrying, from `retry_in_seconds` on the 429
	 * body. Undefined on every other error.
	 */
	readonly retryInSeconds?: number;
	/** True when retrying the failed request cannot repeat its effect. */
	readonly replaySafe?: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryInSeconds?: number;
			replaySafe?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'HappyScribeAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryInSeconds =
			options.retryInSeconds ?? readRetryInSeconds(asRecord(this.body));
		this.replaySafe = options.replaySafe ?? false;
	}

	/** True for the rate-limited answer, with the wait the API asked for. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: the body is an untyped error body until asRecord narrows it.
function readRetryInSeconds(
	record: Record<string, unknown> | null | undefined,
): number | undefined {
	const value = record?.retry_in_seconds ?? record?.retryInSeconds;
	return typeof value === 'number' && value >= 0 ? value : undefined;
}

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function describeHappyScribeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'message') ??
		readString(record, 'error') ??
		fallback;
	const label = status === undefined ? '' : `HappyScribe ${status}`;
	const summary = label ? `${label}: ${text}` : text;
	const retry = readRetryInSeconds(record);
	return retry !== undefined
		? `${summary} (retry_in_seconds: ${retry})`
		: summary;
}

export type HappyScribeQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type HappyScribeRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: HappyScribeQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Marks reads whose 5xx failure can be retried without repeating an effect. */
	replaySafe?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeHappyScribeRequest(
	apiKey: string,
	{ method, path, query, body, replaySafe }: HappyScribeRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: HAPPYSCRIBE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Auth is a plain Bearer token; core renders it as
		// `Authorization: Bearer <key>`.
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const mediaType =
		body === undefined ? undefined : 'application/json';

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: HAPPYSCRIBE_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		// Rethrow first: the generic catch below would otherwise re-wrap
		// this error and drop body and status.
		if (error instanceof HappyScribeAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const record = asRecord(error.body);
			const retry = readRetryInSeconds(record);
			throw new HappyScribeAPIError(
				describeHappyScribeError(error.status, error.body, error.message),
				{ cause: error, retryInSeconds: retry, replaySafe },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new HappyScribeAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				replaySafe,
			});
		}
		throw new HappyScribeAPIError(
			`Unknown HappyScribe error: ${String(error)}`,
			{ replaySafe },
		);
	}
}
