import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DatadogAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Using unknown because Datadog API error response bodies vary by endpoint
	// and API version (v1 returns { errors: string[] }, v2 returns
	// { errors: [{ detail }] }), making a strict type infeasible here.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'DatadogAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

/** Datadog region site, e.g. datadoghq.com (US1), datadoghq.eu (EU1), us3.datadoghq.com, us5.datadoghq.com, ap1.datadoghq.com. */
export const DEFAULT_DATADOG_SITE = 'datadoghq.com';

export type DatadogCredentials = {
	/** Datadog API key — required for every request (DD-API-KEY header). */
	apiKey: string;
	/** Datadog application key — required by most management endpoints (DD-APPLICATION-KEY header). */
	appKey?: string;
	/** Region site controlling the API host: https://api.<site>. Defaults to datadoghq.com. */
	site?: string;
};

/**
 * The keyBuilder packs both Datadog keys and the region site into a single
 * JSON string because ctx.key is a string. A bare (non-JSON) key is accepted
 * as an API key alone so `datadog({ key: '...' })` keeps working.
 */
export function packDatadogKey(credentials: DatadogCredentials): string {
	return JSON.stringify(credentials);
}

export function parseDatadogKey(key: string): DatadogCredentials {
	try {
		const parsed: unknown = JSON.parse(key);
		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			'apiKey' in parsed &&
			typeof parsed.apiKey === 'string'
		) {
			const credentials = parsed as DatadogCredentials;
			return {
				apiKey: credentials.apiKey,
				appKey: credentials.appKey,
				site: credentials.site,
			};
		}
	} catch {
		// Not JSON — treat the whole string as a bare API key below.
	}
	return { apiKey: key };
}

const DATADOG_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'X-RateLimit-Limit',
		remaining: 'X-RateLimit-Remaining',
		resetTime: 'X-RateLimit-Reset',
	},
};

export type DatadogQueryValue = string | number | boolean | undefined;

export type DatadogRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	query?: Record<string, DatadogQueryValue>;
	body?: Record<string, unknown>;
	/**
	 * Values for `{placeholder}` segments in the endpoint path. Endpoint paths
	 * stay constant strings and every value is URI-encoded by the HTTP layer,
	 * so user-supplied ids can never alter the URL structure.
	 */
	path?: Record<string, string | number>;
};

export async function makeDatadogRequest<T>(
	endpoint: string,
	key: string,
	options: DatadogRequestOptions = {},
): Promise<T> {
	const { apiKey, appKey, site } = parseDatadogKey(key);
	const { method = 'GET', query, body, path } = options;

	const config: OpenAPIConfig = {
		BASE: `https://api.${site || DEFAULT_DATADOG_SITE}`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeURIComponent,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'DD-API-KEY': apiKey,
			...(appKey ? { 'DD-APPLICATION-KEY': appKey } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType: 'application/json',
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: DATADOG_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DatadogAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new DatadogAPIError(error.message, undefined, { cause: error });
		}
		throw new DatadogAPIError('Unknown Datadog API error');
	}
}
