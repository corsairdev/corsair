import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LitescrapeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LitescrapeAPIError';
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists for
// this state, so message matching is the only handle available; kept narrow on
// purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only ever
 * configure the key via plugin options and never touch the key manager, and
 * must resolve to "no stored key" rather than abort the call. Anything else
 * thrown (decryption failure, database error, ...) is a real operational
 * problem, not an absent key, and must propagate.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/**
 * LiteScrape REST gateway. Every data endpoint takes a `GET` query or a JSON `POST` body under `/api` and takes
 * `Authorization: Bearer <key>` (keys look like `ls_live_...`). Reference:
 * https://litescrape.com/docs/reference and https://litescrape.com/docs.
 */
export const LITESCRAPE_API_BASE = 'https://api.litescrape.com';

/** The longest `timeout` the API accepts, in seconds. */
export const LITESCRAPE_MAX_BUDGET_SECONDS = 90;
const CLIENT_TIMEOUT_MARGIN_SECONDS = 5;

/**
 * The transport's own retry loop is disabled (`maxRetries: 0`) so the plugin's
 * error handlers are the single owner of retries (core drives them in
 * `core/endpoints/bind.ts`); this keeps a sustained 429 to one request per
 * handler attempt instead of stacking the transport's default retries on top.
 * `isRateLimitError` also treats 503 as retryable so the transport still
 * attaches `Retry-After` to the `ApiError` for service-unavailable responses,
 * which the 503 handler needs.
 */
const TRANSPORT_RETRY_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
	isRateLimitError: (status) => status === 429 || status === 503,
};

export async function makeLitescrapeRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic
		// over a JSON record instead of a closed per-endpoint union.
		// `unknown` is necessary because bodies are endpoint-specific JSON, validated by each endpoint's input schema before send.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		/** Litescrape's own budget for the call, in seconds (the `timeout` query field). */
		budgetSeconds?: number;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, budgetSeconds } = options;

	// LiteScrape authenticates every public endpoint with a bearer key
	// (https://litescrape.com/docs/reference). An empty key means no
	// credentials are configured, so fail fast with Corsair's missing-auth
	// error instead of sending a keyless request that the provider answers
	// with `401 missing_api_key`. Defense in depth: keyBuilder already
	// throws AuthMissingError before the key reaches the client.
	if (apiKey.length === 0) {
		throw new AuthMissingError('litescrape', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: LITESCRAPE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Scrapes routinely take longer than the transport's 20 s default; the
		// API stops a call at its `timeout` (90 s at most), so wait that long
		// plus a margin for the response to arrive.
		// Whole milliseconds: AbortSignal.timeout rejects a fractional delay,
		// and `timeout` may be fractional (10.0005).
		TIMEOUT: Math.ceil(
			((budgetSeconds ?? LITESCRAPE_MAX_BUDGET_SECONDS) +
				CLIENT_TIMEOUT_MARGIN_SECONDS) *
				1000,
		),
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: TRANSPORT_RETRY_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new LitescrapeAPIError('Unknown error');
	}
}

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body on `ApiError.request` and only scrubs the URL and
 * query. A Litescrape body is user content: search terms, URLs, session
 * cookies (`set_cookies`), injected scripts. A validation error can also echo
 * the rejected value back (`details[].input` / FastAPI's `detail[].input`). This rebuilds the error without
 * either, keeping the status, message and rate-limit fields the error
 * handlers and core's retries read (the same rebuild the encodian and e2b clients do).
 */
function withoutRequestData(error: ApiError): ApiError {
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
		},
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: withoutEchoedInput(error.body),
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// `unknown` is necessary because an error body is whatever JSON (or text) the API sent.
function withoutEchoedInput(body: unknown): unknown {
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		return body;
	}
	// `unknown` is necessary because error lists (`details` from Litescrape, `detail` from FastAPI) have no fixed item shape.
	const result: Record<string, unknown> = { ...body };
	for (const key of ['detail', 'details']) {
		const list = result[key];
		if (!Array.isArray(list)) continue;
		result[key] = list.map((item) =>
			typeof item === 'object' && item !== null
				? { ...item, input: undefined, ctx: undefined }
				: item,
		);
	}
	return result;
}
