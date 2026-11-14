import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import type { MakeContext } from './index';

const zones = {
	eu1: 'https://eu1.make.com/api/v2',
	eu2: 'https://eu2.make.com/api/v2',
	us1: 'https://us1.make.com/api/v2',
	us2: 'https://us2.make.com/api/v2',
	'celonis-eu1': 'https://eu1.make.celonis.com/api/v2',
	'celonis-us1': 'https://us1.make.celonis.com/api/v2',
} as const;

type MakeZone = keyof typeof zones;

const zoneByHost = new Map<string, MakeZone>(
	Object.entries(zones).map(([zone, url]) => [
		new URL(url).host,
		zone as MakeZone,
	]),
);

/**
 * The zone option wins; otherwise the connected account's stored `zone` field.
 * A stored value may be the zone id (`eu1`) or its host (`eu1.make.com`, with or
 * without https://), since that is what the Make UI shows. Anything else is
 * rejected before the token is sent anywhere.
 */
async function resolveZone(ctx: MakeContext): Promise<MakeZone> {
	const raw = ctx.options.zone ?? (await ctx.keys.get_zone());
	if (!raw) {
		throw new AuthMissingError(
			'make',
			'api_key',
			'Make zone is not set: connect the account with its zone (for example eu1) or set the zone option.',
		);
	}
	const value = raw.trim().toLowerCase();
	if (Object.hasOwn(zones, value)) return value as MakeZone;
	const host = value.replace(/^https?:\/\//, '').split('/')[0] ?? '';
	const zone = zoneByHost.get(host);
	if (zone) return zone;
	throw new Error(
		`Unsupported Make zone; use one of ${Object.keys(zones).join(', ')}`,
	);
}

export async function makeRequest(
	ctx: MakeContext,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		path: string;
		query?: Record<
			string,
			string | number | boolean | string[] | number[] | undefined
		>;
		// Different operations supply different validated, provider-defined JSON bodies.
		body?: unknown;
		// Milliseconds; core's default is 20 s, shorter than a responsive run's 40 s window.
		timeout?: number;
	},
	// HTTP responses are untrusted and vary by operation; callers parse the result
	// with their own output schema before exposing it.
): Promise<unknown> {
	if (!ctx.key) throw new Error('Make API token is required');
	const base = zones[await resolveZone(ctx)];
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: options.timeout,
		HEADERS: { Authorization: `Token ${ctx.key}`, Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		query: options.query,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	// Make's IM310 indicates an exhausted operations or transfer quota. Core's
	// default 429 retry cannot distinguish it from a per-minute limit, so never
	// replay an operation automatically; preserve Retry-After on the ApiError.
	return request<unknown>(config, requestOptions, {
		rateLimitConfig: {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 1000,
			backoffMultiplier: 2,
			headerNames: { retryAfter: 'retry-after' },
		},
	});
}
