import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/** Better Stack serves two hosts off one bearer token. */
export const BETTERSTACK_UPTIME_BASE = 'https://uptime.betterstack.com';
export const BETTERSTACK_TELEMETRY_BASE = 'https://telemetry.betterstack.com';

export type BetterstackApi = 'uptime' | 'telemetry';

export function baseUrlFor(api: BetterstackApi): string {
	return api === 'telemetry'
		? BETTERSTACK_TELEMETRY_BASE
		: BETTERSTACK_UPTIME_BASE;
}

/**
 * Better Stack sends no rate-limit headers on a successful response (verified
 * live 2026-08-16 - the 200 header set carries no `x-ratelimit-*` and no
 * `retry-after`). Throttling can therefore only be reactive: back off when a
 * 429 arrives, keyed off `Retry-After` on that response.
 */
const BETTERSTACK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type BetterstackRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	api?: BetterstackApi;
	/**
	 * Non-idempotent calls opt out of transport-level retries. Corsair replays
	 * the whole endpoint call on a network error, so retrying here would risk a
	 * duplicate create.
	 */
	idempotent?: boolean;
};

/**
 * Drops `undefined` so an omitted optional field is never sent as null, while
 * keeping an explicit `false` - which is what makes the fail-safe notification
 * defaults actually reach the API.
 */
export function compactBody(
	body: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (!body) return undefined;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

/** Same, for query strings. */
export function compactQuery(
	query: Record<string, string | number | boolean | undefined> | undefined,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export async function makeBetterstackRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BetterstackRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		api = 'uptime',
		idempotent = true,
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrlFor(api),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// The credential travels in a header, never the query string.
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? compactBody(body)
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: compactQuery(query),
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: idempotent
			? BETTERSTACK_RATE_LIMIT_CONFIG
			: { ...BETTERSTACK_RATE_LIMIT_CONFIG, maxRetries: 0 },
	});
}
