import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for every failed Amara API call.
 *
 * The originating `ApiError` is kept as `cause`, and its status/rate-limit
 * fields are copied onto this error so `error-handlers.ts` can route 401/429
 * responses without needing an `instanceof ApiError` check.
 */
export class AmaraAPIError extends Error {
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
		this.name = 'AmaraAPIError';

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

/** Docs: https://apidocs.amara.org/ */
export const AMARA_API_BASE = 'https://amara.org/api';

export type AmaraQuery = Record<string, string | number | boolean | undefined>;

export type AmaraRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: AmaraQuery;
};

/**
 * Performs a request against the Amara API.
 *
 * Auth: the API key is sent in the `X-api-key` header. `TOKEN` is left unset
 * so the request layer does not add an `Authorization: Bearer` header.
 *
 * DELETE (and some action POSTs) may return an empty body — those are
 * normalised to `{ ok: true }`.
 */
export async function makeAmaraRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AmaraRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: AMARA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		const result = await request<T>(config, requestOptions);
		if (result === undefined || result === null || result === '') {
			return { ok: true } as T;
		}
		return result;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AmaraAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new AmaraAPIError(error.message, undefined, { cause: error });
		}
		throw new AmaraAPIError('Unknown error');
	}
}

/** Drop undefined values so we don't send `?foo=undefined` query noise. */
export function compactQuery(query: AmaraQuery): AmaraQuery {
	const out: AmaraQuery = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/**
 * Encode a path segment for Amara URLs.
 *
 * Amara user identifiers use an `id$…` prefix — `$` must stay literal in the
 * path (docs: `/api/users/id$…/`). `encodeURIComponent` turns `$` into `%24`,
 * which Amara 404s on, so we restore it after encoding.
 */
export function encodeAmaraPathSegment(value: string): string {
	return encodeURIComponent(value).replace(/%24/gi, '$');
}
