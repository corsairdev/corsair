import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Official AMcards API v1.
 *
 * Base: https://amcards.com/api/v1/
 * Auth: Django REST TokenAuthentication — `Authorization: Token <api_access_token>`
 * The dashboard labels this "API Access Token".
 *
 * `OpenAPIConfig.TOKEN` is left unset so the shared transport does not emit
 * `Authorization: Bearer`.
 */
export const AMCARDS_API_BASE = 'https://amcards.com/api/v1';

const AMCARDS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export class AmcardsAPIError extends Error {
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
		this.name = 'AmcardsAPIError';

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

export type AmcardsQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type AmcardsRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: AmcardsQuery;
	/**
	 * Gifts and public templates are documented as unauthenticated. Pass
	 * `false` to omit the Token header; every other resource needs it.
	 */
	auth?: boolean;
};

/** Drop undefined values so we don't send `?foo=undefined`. */
export function compactQuery(query: AmcardsQuery): AmcardsQuery {
	const out: AmcardsQuery = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

export function encodeAmcardsPathId(id: number | string): string {
	return encodeURIComponent(String(id));
}

export async function makeAmcardsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AmcardsRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, auth = true } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	if (auth && !apiKey) {
		throw new AuthMissingError('amcards', 'api_key');
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	if (auth) {
		headers.Authorization = `Token ${apiKey}`;
	}

	const config: OpenAPIConfig = {
		BASE: AMCARDS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};

	const compact = query ? compactQuery(query) : undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query: compact && Object.keys(compact).length > 0 ? compact : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: AMCARDS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AmcardsAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new AmcardsAPIError(error.message, undefined, { cause: error });
		}
		throw new AmcardsAPIError('Unknown error');
	}
}
