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

export async function makeRequest(
	ctx: MakeContext,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		path: string;
		query?: Record<
			string,
			string | number | boolean | string[] | number[] | undefined
		>;
		body?: unknown;
	},
): Promise<unknown> {
	if (!ctx.key) throw new Error('Make API token is required');
	const zone = ctx.options.zone;
	if (!zone || !Object.hasOwn(zones, zone)) {
		throw new Error('A supported Make zone is required');
	}
	const base = zones[zone];
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
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
