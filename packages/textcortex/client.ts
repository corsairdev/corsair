import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TEXTCORTEX_API_BASE = 'https://api.textcortex.com/v1';

/**
 * TextCortex speaks the OpenAI shape, so a failure carries `error.message` and
 * `error.type` on the chat routes. Its own endpoints answer `{ detail }` or a
 * service error with `status` and `message` instead, and a validation failure
 * can put an array in `detail`. All three are read here.
 * https://docs.textcortex.com/api
 */
export class TextCortexAPIError extends Error {
	readonly status?: number;
	/** The OpenAI-style error type or code, when TextCortex sent one. */
	readonly code?: string;
	/**
	 * The validation messages, one per rejected field, when `detail` arrived as
	 * an array. Empty for the single-message shapes.
	 */
	readonly details: Array<{ location?: string; message: string }>;
	/** Milliseconds from a Retry-After header, when TextCortex sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			details?: Array<{ location?: string; message: string }>;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TextCortexAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code;
		this.details = options.details ?? [];
	}

	/** True for a 402, which means the account has no funding left. */
	get isInsufficientCredits(): boolean {
		return this.status === 402;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. TextCortex honours Retry-After when it
// sends one and promises no fixed rate-limit header otherwise.
const TEXTCORTEX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

type TextCortexErrorDetails = {
	message?: string;
	code?: string;
	details: Array<{ location?: string; message: string }>;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of a JSON envelope.
function readErrorDetails(body: unknown): TextCortexErrorDetails {
	const record = asRecord(body);
	if (!record) return { details: [] };

	const details: Array<{ location?: string; message: string }> = [];
	const rawDetail = record.detail;
	if (Array.isArray(rawDetail)) {
		for (const entry of rawDetail) {
			const item = asRecord(entry);
			const message = item?.msg;
			if (typeof message !== 'string' || message.length === 0) continue;
			const loc = item?.loc;
			details.push({
				location: Array.isArray(loc) ? loc.map(String).join('.') : undefined,
				message,
			});
		}
	}

	const error = asRecord(record.error);
	const message =
		(typeof error?.message === 'string' && error.message.length > 0
			? error.message
			: undefined) ??
		(typeof record.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof rawDetail === 'string' && rawDetail.length > 0
			? rawDetail
			: undefined);

	const type = error?.type;
	const code = error?.code;
	return {
		message,
		code:
			typeof type === 'string'
				? type
				: typeof code === 'string'
					? code
					: undefined,
		details,
	};
}

// unknown: same open error body as readErrorDetails.
export function describeTextCortexError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const details = readErrorDetails(body);
	const text = details.message ?? details.details[0]?.message ?? fallback;
	const label = [status, details.code].filter((p) => p !== undefined).join(' ');
	return label ? `TextCortex ${label}: ${text}` : text;
}

export type TextCortexQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TextCortexRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: TextCortexQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTextCortexRequest(
	apiKey: string,
	{ method, path, query, body }: TextCortexRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TEXTCORTEX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TextCortex reads the key from a bearer header.
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
		// unknown: the response shape is the endpoint's concern; the caller
		// parses it with its zod output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TEXTCORTEX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const details = readErrorDetails(error.body);
			throw new TextCortexAPIError(
				describeTextCortexError(error.status, error.body, error.message),
				{
					cause: error,
					code: details.code,
					details: details.details,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TextCortexAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TextCortexAPIError('Unknown TextCortex error', { method });
	}
}
