import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type MixpanelRegion = 'us' | 'eu' | 'in';

/**
 * Mixpanel serves three APIs on three different host sets, one per data
 * residency region (https://docs.mixpanel.com/reference/overview):
 *
 * - ingestion (import events): api / api-eu / api-in .mixpanel.com
 * - query (cohorts, engage, insights, funnels, retention): mixpanel.com /
 *   eu.mixpanel.com / in.mixpanel.com + /api/query
 * - raw export: data / data-eu / data-in .mixpanel.com + /api/2.0
 */
const INGESTION_HOSTS: Record<MixpanelRegion, string> = {
	us: 'https://api.mixpanel.com',
	eu: 'https://api-eu.mixpanel.com',
	in: 'https://api-in.mixpanel.com',
};

const QUERY_HOSTS: Record<MixpanelRegion, string> = {
	us: 'https://mixpanel.com/api/query',
	eu: 'https://eu.mixpanel.com/api/query',
	in: 'https://in.mixpanel.com/api/query',
};

const EXPORT_HOSTS: Record<MixpanelRegion, string> = {
	us: 'https://data.mixpanel.com/api/2.0',
	eu: 'https://data-eu.mixpanel.com/api/2.0',
	in: 'https://data-in.mixpanel.com/api/2.0',
};

export type MixpanelService = 'ingestion' | 'query' | 'export';

/** The base URL for one API in one region. */
export function mixpanelHost(
	service: MixpanelService,
	region: MixpanelRegion,
): string {
	switch (service) {
		case 'ingestion':
			return INGESTION_HOSTS[region];
		case 'query':
			return QUERY_HOSTS[region];
		case 'export':
			return EXPORT_HOSTS[region];
	}
}

/**
 * The slice of the plugin context the client needs, declared structurally so
 * endpoints can pass the real context and tests can pass a fixture. The
 * project id lives beside the service account credentials because every
 * service-account request carries it as a query parameter.
 */
export type MixpanelCallContext = {
	key: string;
	options: { region?: MixpanelRegion; projectId?: number };
	keys: {
		get_project_id: () => Promise<string | null | undefined>;
	};
};

/**
 * Service account auth requires the project id on every wrapped operation
 * (spec marks it required). The inline option wins over the stored account
 * field; a missing value throws before a request is sent, because the API
 * would answer 401 and read like a bad secret.
 */
export async function resolveProjectId(
	ctx: MixpanelCallContext,
): Promise<number> {
	const value = ctx.options.projectId ?? (await ctx.keys.get_project_id());
	if (value === null || value === undefined || value === '') {
		throw new Error(
			'Mixpanel project_id is required: pass projectId in the plugin options or save it on the account.',
		);
	}
	const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new Error(
			`Mixpanel project_id must be a positive integer, got ${value}`,
		);
	}
	return parsed;
}

/**
 * Mixpanel error bodies come in three shapes:
 *
 * - query API: `{ request, status: 'error', error, error_code }`
 * - ingestion: `{ code, error, status }`, where `status` is the string
 *   `"Unauthorized"` in the docs but the number `0` on the wire, plus the
 *   400 validation body with `failed_records`
 * - raw export: a plain text string ("To authenticate your request, ...")
 */
export class MixpanelAPIError extends Error {
	readonly status?: number;
	/** The query API's `error_code`, e.g. `query_api.request.unauthenticated`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Mixpanel sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the failed request can be sent again after a 5xx. */
	readonly replayable?: boolean;
	// unknown: the body is JSON on ingestion and query, plain text on export.
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
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MixpanelAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.replayable = options.replayable;
		this.code = readErrorCode(this.body);
	}

	/** A query API body that says error, including one behind a 2xx. */
	get isQueryError(): boolean {
		return readString(asRecord(this.body), 'status') === 'error';
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** The query API's `error_code`; ingestion errors have no equivalent. */
function readErrorCode(body: unknown): string | undefined {
	return readString(asRecord(body), 'error_code');
}

// unknown: see MixpanelAPIError.
export function describeMixpanelError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	// The raw export answers errors as plain text, not JSON.
	if (typeof body === 'string' && body.trim().length > 0) {
		return status === undefined
			? `Mixpanel: ${body.trim()}`
			: `Mixpanel ${status}: ${body.trim()}`;
	}
	const record = asRecord(body);
	const text =
		readString(record, 'error') ?? readString(record, 'message') ?? fallback;
	const code = readErrorCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Mixpanel ${label}: ${text}` : text;
}

export type MixpanelQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MixpanelRequest = {
	service: MixpanelService;
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: MixpanelQuery;
	/**
	 * A string body is sent verbatim with `mediaType` (the query API takes
	 * form-encoded bodies); anything else is serialized as JSON.
	 */
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	mediaType?: string;
	/**
	 * True when a 5xx or a network drop can safely replay the request. Reads
	 * qualify; events.import qualifies because every event carries an
	 * $insert_id and Mixpanel deduplicates on (event, time, distinct_id,
	 * $insert_id).
	 */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Mixpanel does not document that header;
// it documents exponential backoff for 429, 502 and 503 instead.
const MIXPANEL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// Query and export calls are long-running: the query API caps concurrency at
// 5 for the whole project, so a queued query can wait far longer than the
// client's 20 second default before its own work even starts.
const MIXPANEL_TIMEOUT_MS = 60_000;

// unknown: callers parse the body with the endpoint's zod output schema; the
// raw export returns JSONL text that the endpoint parses itself.
export async function makeMixpanelRequest(
	ctx: MixpanelCallContext,
	{
		service,
		method,
		path,
		query,
		body,
		mediaType,
		replayable,
	}: MixpanelRequest,
): Promise<unknown> {
	const region = ctx.options.region ?? 'us';
	const apiKey = ctx.key;
	if (!apiKey) {
		throw new Error(
			'Mixpanel service account credentials are missing: the request would reach the API unauthenticated.',
		);
	}

	const config: OpenAPIConfig = {
		BASE: mixpanelHost(service, region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: MIXPANEL_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			// Mixpanel's basic auth accepts the plain `username:secret` pair
			// (https://docs.mixpanel.com/reference/service-accounts), so the
			// resolved key is sent as-is.
			Authorization: `Basic ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType,
	};

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: MIXPANEL_RATE_LIMIT_CONFIG,
		});
		// A query API 200 whose body still says error is a failure: engage has
		// historically answered selector problems this way.
		const record = asRecord(raw);
		if (record && readString(record, 'status') === 'error') {
			throw new MixpanelAPIError(
				describeMixpanelError(200, raw, 'Mixpanel request failed'),
				{ status: 200, body: raw, method, replayable },
			);
		}
		return raw;
	} catch (error) {
		// Rethrow our own error untouched: the generic branch below would
		// re-wrap it and hide the fields the handlers match on.
		if (error instanceof MixpanelAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new MixpanelAPIError(
				describeMixpanelError(error.status, error.body, error.message),
				{ cause: error, replayable },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MixpanelAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new MixpanelAPIError('Unknown Mixpanel error', {
			method,
			replayable,
		});
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
