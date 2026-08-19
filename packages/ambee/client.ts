import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for every failed Ambee API call.
 *
 * The originating `ApiError` is kept as `cause`, and its status/rate-limit
 * fields are copied onto this error so `error-handlers.ts` can route 401/429
 * responses without needing an `instanceof ApiError` check.
 */
export class AmbeeAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
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
		this.name = 'AmbeeAPIError';

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

/**
 * Every Ambee product (air quality, weather, pollen, fire, geocoding) is
 * served from the same host; only the path prefix differs, so a single base
 * URL covers the whole plugin.
 *
 * Docs: https://docs.ambeedata.com/
 */
export const AMBEE_API_BASE = 'https://api.ambeedata.com';

export type AmbeeQuery = Record<string, string | number | boolean | undefined>;

/**
 * Performs a request against the Ambee API.
 *
 * Auth: the API key is sent in the `x-api-key` header — Ambee does not accept
 * bearer tokens or a query-parameter key, so `TOKEN` is deliberately left
 * unset (setting it would add an unwanted `Authorization: Bearer` header).
 *
 * Every Ambee endpoint currently exposed by this plugin is a GET with its
 * parameters in the query string.
 */
export async function makeAmbeeRequest<T>(
	endpoint: string,
	apiKey: string,
	options: { query?: AmbeeQuery } = {},
): Promise<T> {
	const { query } = options;

	const config: OpenAPIConfig = {
		BASE: AMBEE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AmbeeAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new AmbeeAPIError(error.message, undefined, { cause: error });
		}
		throw new AmbeeAPIError('Unknown error');
	}
}

/**
 * Ambee expects timestamps as `YYYY-MM-DD hh:mm:ss` (UTC, space-separated) on
 * every `from`/`to` parameter. Accepts either an already-formatted string or
 * anything `Date` can parse (ISO 8601 included) so callers — and agents — do
 * not have to know the provider's format.
 */
export function toAmbeeTimestamp(value: string): string {
	if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
		return value;
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		throw new AmbeeAPIError(
			`Invalid timestamp: "${value}". Expected "YYYY-MM-DD hh:mm:ss" or an ISO 8601 date.`,
		);
	}

	return parsed.toISOString().replace('T', ' ').slice(0, 19);
}
