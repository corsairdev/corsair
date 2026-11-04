import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Elasticsearch is self-hosted: every account points at its own cluster
 * (for example `https://es.internal.example:9200` or an Elastic Cloud
 * endpoint). The cluster URL lives in the account `baseUrl` field; the
 * plugin option overrides it in solo mode.
 * https://www.elastic.co/docs/api/doc/elasticsearch/authentication
 */

// Elasticsearch answers that "some requests can take several minutes" and
// recommends against short response timeouts; 60s covers slow searches
// without hanging forever. https://www.elastic.co/docs/reference/elasticsearch/rest-apis/api-conventions
const ELASTICSEARCH_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const ELASTICSEARCH_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type ElasticsearchQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Elasticsearch error bodies are `{ error: { type, reason, caused_by?, ... },
 * status }` (OpenAPI `_types.ErrorResponseBase`). Some statuses also matter
 * without a body (proxies answer 502/504 with HTML), so `status` can stand
 * alone.
 */
export class ElasticsearchAPIError extends Error {
	readonly status?: number;
	readonly errorType?: string;
	readonly reason?: string;
	readonly retryAfter?: number;
	// unknown: error bodies are the `error` object above, but a proxy or a
	// security layer can answer with plain text.
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
		this.name = 'ElasticsearchAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const errorCause = asRecord(asRecord(this.body)?.error);
		this.errorType = readString(errorCause, 'type');
		this.reason = readString(errorCause, 'reason');
	}
}

// unknown: the body is untrusted until these guards run.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// unknown: error payloads are untyped at the boundary; these helpers narrow
// one field at a time instead of trusting the shape.
function readString(
	record: Record<string, unknown> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: see readString.
function describeElasticsearchError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const errorCause = asRecord(record?.error);
	const reason = readString(errorCause, 'reason');
	const errorType = readString(errorCause, 'type');
	const text = reason ?? errorType ?? fallback;
	return status !== undefined ? `Elasticsearch ${status}: ${text}` : text;
}

/**
 * Turn a stored credential into the `Authorization` header value the docs
 * specify. Accepted inputs, in order:
 *
 * 1. A full header value (`ApiKey ...`, `Basic ...`, `Bearer ...`) passes
 *    through verbatim — covers HTTP Basic self-hosted clusters and Elastic
 *    Cloud bearer tokens alongside API keys.
 * 2. A raw `id:api_key` pair is base64-encoded; the base64 alphabet cannot
 *    contain `:`, so a value that has one is always the raw pair.
 * 3. Anything else is the `encoded` string the Create API key API returns,
 *    sent as `Authorization: ApiKey <encoded>`.
 * https://www.elastic.co/docs/api/doc/elasticsearch/authentication
 */
export function buildAuthorizationHeader(apiKey: string): string {
	const trimmed = apiKey.trim();
	const scheme = /^(apikey|basic|bearer)\s+/i.exec(trimmed);
	if (scheme) {
		const rest = trimmed.slice(scheme[0].length).trim();
		// The regex guarantees one of the three schemes.
		const schemeName = scheme[0].trim().toLowerCase();
		const canonical = schemeName.startsWith('apikey')
			? 'ApiKey'
			: schemeName.startsWith('basic')
				? 'Basic'
				: 'Bearer';
		return `${canonical} ${rest}`;
	}
	if (trimmed.includes(':')) {
		const encoded = Buffer.from(trimmed, 'utf8').toString('base64');
		return `ApiKey ${encoded}`;
	}
	return `ApiKey ${trimmed}`;
}

/** Resolve the per-account cluster endpoint, or name the missing field. */
export async function resolveBaseUrl(ctx: {
	options?: { baseUrl?: string };
	keys?: { get_baseUrl?: () => Promise<string | null | undefined> };
}): Promise<string> {
	const fromOptions = ctx.options?.baseUrl;
	if (fromOptions) return fromOptions.replace(/\/+$/, '');
	const getter = ctx.keys?.get_baseUrl;
	if (getter) {
		const fromAccount = await getter();
		if (fromAccount) return fromAccount.replace(/\/+$/, '');
	}
	throw new AuthMissingError('elasticsearch', 'baseUrl');
}

/**
 * Percent-encode a multi-target index expression (`logs-*,-logs-dev`,
 * `cluster:logs-*`) one comma-separated segment at a time, so list and
 * wildcard syntax survives while `/`, `?`, `#` and spaces cannot smuggle a
 * second path segment. `encodeURIComponent` keeps `*`, `.` and `-` literal.
 * https://www.elastic.co/docs/reference/elasticsearch/rest-apis/api-conventions#multi-target-syntax
 */
export function encodeIndexTarget(index: string): string {
	return index
		.split(',')
		.map((segment) => encodeURIComponent(segment.trim()))
		.filter((segment) => segment.length > 0)
		.join(',');
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeElasticsearchRequest(
	baseUrl: string,
	authorization: string,
	options: {
		method?: 'GET' | 'POST';
		path: string;
		query?: ElasticsearchQuery;
		body?: Record<string, unknown>;
	},
): Promise<unknown> {
	const { method = 'GET', path, query, body } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: ELASTICSEARCH_TIMEOUT_MS,
		// TOKEN would become `Authorization: Bearer ...`; Elasticsearch uses
		// its own ApiKey scheme, so the whole header goes through HEADERS.
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			Authorization: authorization,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: ELASTICSEARCH_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ElasticsearchAPIError(
				describeElasticsearchError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new ElasticsearchAPIError((error as Error).message, {
				cause: error as Error,
			});
		}
		throw new ElasticsearchAPIError('Unknown Elasticsearch API error');
	}
}
