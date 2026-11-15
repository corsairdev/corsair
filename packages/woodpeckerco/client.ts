import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const WOODPECKERCO_API_BASE = 'https://api.woodpecker.co/rest';

// A queued request can wait 15 seconds before Woodpecker starts on it, and one
// add_prospects_campaign call can carry 20,000 prospects, so corsair/http's
// 20 second default is too tight.
const WOODPECKERCO_TIMEOUT_MS = 60_000;

/** The code v1 sends with a 409 where v2 sends a 429. */
const V1_RATE_LIMIT_CODE = 'E_TOO_MANY_REQUESTS';

// unknown: the body is an untyped error body until asRecord narrows it.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	return (
		readString(asRecord(record?.status), 'code') ?? readString(record, 'code')
	);
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Woodpecker does not document that header.
// The status alone cannot identify a v1 rate limit: on v2, 409 also means a
// campaign that fails validation or a step that cannot be deleted.
const WOODPECKERCO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 409 && readCode(body) === V1_RATE_LIMIT_CODE,
};

/**
 * Woodpecker error bodies come in four shapes, depending on API version and
 * status:
 *
 * - v1: `{ status: { status: 'ERROR', code, msg } }`
 * - v2 default: `{ title, status, detail, timestamp }`
 * - v2 domain errors: `{ code, message, details }`
 * - v2 unknown errors: `{ type, message, details }`
 *
 * prospects.addToCampaign also keeps a `prospects` array in its v1 body when
 * none of the prospects were added, so read `body` for per-prospect reasons.
 */
export class WoodpeckerCoAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code when present, e.g. `E_TOO_MANY_REQUESTS`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Woodpecker sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shapes above, but a proxy can
	// answer with HTML or text.
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
		this.name = 'WoodpeckerCoAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = readCode(this.body);
	}

	/** True for a 429 from v2 and for v1's 409 E_TOO_MANY_REQUESTS. */
	get isRateLimit(): boolean {
		return this.status === 429 || this.code === V1_RATE_LIMIT_CODE;
	}
}

// unknown: see WoodpeckerCoAPIError.
export function describeWoodpeckerCoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const v1 = asRecord(record?.status);
	const text =
		readString(v1, 'msg') ??
		readString(record, 'detail') ??
		readString(record, 'message') ??
		fallback;
	// `details` adds to `message`; on v2's `{ title, detail }` shape it is unset.
	const details = readString(record, 'details');
	const code = readCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const summary = label ? `Woodpecker ${label}: ${text}` : text;
	return details ? `${summary} (${details})` : summary;
}

export type WoodpeckerCoQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type WoodpeckerCoRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: WoodpeckerCoQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless answers: 200 on run, pause and stop, and 204 on
// v1/campaign_list.
export async function makeWoodpeckerCoRequest(
	apiKey: string,
	{ method, path, query, body }: WoodpeckerCoRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: WOODPECKERCO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: WOODPECKERCO_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
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
			rateLimitConfig: WOODPECKERCO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new WoodpeckerCoAPIError(
				describeWoodpeckerCoError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WoodpeckerCoAPIError(error.message, { cause: error, method });
		}
		throw new WoodpeckerCoAPIError('Unknown Woodpecker error', { method });
	}
}
