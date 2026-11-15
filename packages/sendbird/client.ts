import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import { z } from 'zod';

const appId = z
	.string()
	.regex(
		/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/,
		'Invalid Sendbird application ID',
	);
// Sendbird splits these filters on a raw comma and returns nothing for an encoded one (%2C),
// which core's query encoder produces, so the plugin writes the query string itself.
const commaLists = new Set([
	'user_ids',
	'metadatavalues_in',
	'custom_types',
	'channel_urls',
	'members_exactly_in',
	'members_include_in',
	'metadata_values',
	'metacounter_values',
	'sender_ids',
]);
function queryString(
	query: Record<string, string | number | boolean | undefined> = {},
): string {
	const pairs = Object.entries(query)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => {
			const text = String(value);
			const encoded = commaLists.has(key)
				? text.split(',').map(encodeURIComponent).join(',')
				: encodeURIComponent(text);
			return `${encodeURIComponent(key)}=${encoded}`;
		});
	return pairs.length ? `?${pairs.join('&')}` : '';
}

// Core's default retry schedule, reading Sendbird's documented `X-RateLimit-RetryAfter` header
// (seconds) instead of `Retry-After`, which Sendbird does not send. `X-RateLimit-Reset` is an epoch
// timestamp in Sendbird's example and keeps core's default handling.
export const sendbirdRateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'x-ratelimit-retryafter',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

// Responses cross an untrusted HTTP boundary and are parsed by each endpoint's output schema.
export async function makeSendbirdRequest(
	applicationId: string,
	apiKey: string,
	path: string,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		query?: Record<string, string | number | boolean | undefined>;
		// Each endpoint supplies a different schema-validated JSON object.
		body?: object;
	},
): Promise<unknown> {
	if (!apiKey?.trim()) throw new AuthMissingError('sendbird', 'api_key');
	const id = appId.parse(applicationId);
	const config: OpenAPIConfig = {
		BASE: `https://api-${id}.sendbird.com/v3`,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'Api-Token': apiKey },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path + queryString(options.query),
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	// Core's ApiError passes through unchanged (R8): its status and retryAfter drive the 429 handler,
	// and core retries a 429 three times, waiting for Sendbird's X-RateLimit-RetryAfter when sent.
	// The shared transport cannot validate the endpoint-specific response shape.
	const result = await request<unknown>(config, requestOptions, {
		rateLimitConfig: sendbirdRateLimitConfig,
	});
	// Empty non-JSON 200 responses are returned by the shared transport as ''.
	return options.method === 'DELETE' && result === '' ? undefined : result;
}
