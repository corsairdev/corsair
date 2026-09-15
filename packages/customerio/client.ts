import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CustomerioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'CustomerioAPIError';
	}
}

// Verified against https://docs.customer.io/integrations/api/app/,
// https://docs.customer.io/integrations/api/track/ and
// https://docs.customer.io/integrations/api/cdp/ (September 2026).
// App API lives on api.customer.io with Bearer app-key auth.
// Track API lives on track.customer.io with Basic siteId:apiKey auth.
// CDP/Pipelines API lives on cdp.customer.io with Basic writeKey: auth.
// A single plugin-level `api_key` string is reused for all three: it is sent
// as a Bearer token for App calls and base64-encoded as Basic credentials
// for Track/CDP calls. Track callers should therefore store
// "siteId:apiKey" in the key field; CDP callers store the write key.
export const CUSTOMERIO_APP_BASE = 'https://api.customer.io';
export const CUSTOMERIO_TRACK_BASE = 'https://track.customer.io';
export const CUSTOMERIO_CDP_BASE = 'https://cdp.customer.io';

// EU region bases. Docs: https://docs.customer.io/integrations/api/app/?region=eu,
// https://docs.customer.io/integrations/api/track?region=eu and
// https://docs.customer.io/integrations/data-in/connections/http-api
// (September 2026). EU workspaces must use these; US traffic sent to the
// default bases above would cross regions.
export const CUSTOMERIO_APP_BASE_EU = 'https://api-eu.customer.io';
export const CUSTOMERIO_TRACK_BASE_EU = 'https://track-eu.customer.io';
export const CUSTOMERIO_CDP_BASE_EU = 'https://cdp-eu.customer.io';

export type CustomerioRegion = 'us' | 'eu';

function resolveBaseUrl(
	usBase: string,
	euBase: string,
	region?: CustomerioRegion,
): string {
	return region === 'eu' ? euBase : usBase;
}

// Fully type-safe JSON value without `unknown` or `any`.
// Customer.io traits, properties and personalization data are free-form JSON,
// so every endpoint body reuses these explicit recursive types.
export type CustomerioJsonPrimitive = string | number | boolean | null;
export type CustomerioJsonValue =
	| CustomerioJsonPrimitive
	| Array<CustomerioJsonValue>
	| CustomerioJsonObject;
// The index signature admits `undefined` so that objects with optional
// properties (for example CDP batch calls with optional userId) remain
// assignable without type assertions. `undefined` values are stripped by
// JSON serialization before they reach the wire.
export type CustomerioJsonObject = {
	[key: string]: CustomerioJsonValue | undefined;
};

export type CustomerioHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type CustomerioRequestOptions = {
	method?: CustomerioHttpMethod;
	body?: CustomerioJsonObject;
	query?: Record<string, string | number | boolean | undefined>;
	// Account region. EU workspaces must pass 'eu' so requests stay in the
	// EU data center; defaults to 'us'. Endpoint handlers forward
	// ctx.options.region here (same pattern as gitlab's ctx.options.baseUrl).
	region?: CustomerioRegion;
};

const CUSTOMERIO_RATE_LIMIT: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function toBasicCredential(apiKey: string): string {
	// Track expects base64(siteId:apiKey); CDP expects base64(writeKey:).
	// When the stored key already contains a colon it is used verbatim,
	// otherwise a trailing colon supplies the empty password segment.
	const raw: string = apiKey.includes(':') ? apiKey : `${apiKey}:`;
	return Buffer.from(raw, 'utf-8').toString('base64');
}

function buildConfig(
	base: string,
	headers: Record<string, string>,
): OpenAPIConfig {
	return {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...headers,
		},
	};
}

function buildRequestOptions(
	options: CustomerioRequestOptions,
): ApiRequestOptions {
	const method: CustomerioHttpMethod = options.method ?? 'GET';
	return {
		method,
		url: '',
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? options.body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? options.query : undefined,
	};
}

async function runRequest<T>(
	config: OpenAPIConfig,
	endpoint: string,
	options: CustomerioRequestOptions,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		...buildRequestOptions(options),
		url: endpoint,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: CUSTOMERIO_RATE_LIMIT,
		});
	} catch (error) {
		// ApiError must propagate unwrapped: the plugin error handlers
		// discriminate on its status code (429 rate-limit handling per R7).
		// Only non-HTTP failures are mapped to CustomerioAPIError.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new CustomerioAPIError(error.message);
		}
		throw new CustomerioAPIError('Unknown Customer.io request failure');
	}
}

// App API request with Bearer app-key auth.
// Docs: https://docs.customer.io/integrations/api/app/
export async function makeAppRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CustomerioRequestOptions = {},
): Promise<T> {
	const config: OpenAPIConfig = buildConfig(
		resolveBaseUrl(CUSTOMERIO_APP_BASE, CUSTOMERIO_APP_BASE_EU, options.region),
		{
			Authorization: `Bearer ${apiKey}`,
		},
	);
	return runRequest<T>(config, endpoint, options);
}

// Track API request with Basic siteId:apiKey auth.
// Docs: https://docs.customer.io/integrations/api/track/
export async function makeTrackRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CustomerioRequestOptions = {},
): Promise<T> {
	const config: OpenAPIConfig = buildConfig(
		resolveBaseUrl(
			CUSTOMERIO_TRACK_BASE,
			CUSTOMERIO_TRACK_BASE_EU,
			options.region,
		),
		{
			Authorization: `Basic ${toBasicCredential(apiKey)}`,
		},
	);
	return runRequest<T>(config, endpoint, options);
}

// CDP/Pipelines API request with Basic writeKey auth.
// Docs: https://docs.customer.io/integrations/api/cdp/
// Without X-Strict-Mode the CDP API returns HTTP 200 for almost everything
// (auth/size/validation failures are only logged server-side), which would
// surface as false successes. Strict mode returns real 400/401 codes that
// runRequest and the error handlers can act on.
// See https://docs.customer.io/integrations/api/track-vs-cdp-api
export async function makeCdpRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CustomerioRequestOptions = {},
): Promise<T> {
	const config: OpenAPIConfig = buildConfig(
		resolveBaseUrl(CUSTOMERIO_CDP_BASE, CUSTOMERIO_CDP_BASE_EU, options.region),
		{
			Authorization: `Basic ${toBasicCredential(apiKey)}`,
			'X-Strict-Mode': '1',
		},
	);
	return runRequest<T>(config, endpoint, options);
}
