import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';

/**
 * Exist API v2 base URL.
 * @see https://developer.exist.io/guide/
 */
export const EXIST_API_BASE = 'https://exist.io/api/2';

/**
 * OAuth2 authorization endpoint.
 * @see https://developer.exist.io/reference/authentication/oauth2/
 */
export const EXIST_OAUTH_AUTHORIZE_URL = 'https://exist.io/oauth2/authorize';

/**
 * OAuth2 token endpoint, used for both `authorization_code` and
 * `refresh_token` grants. Client credentials are sent in the request body.
 * @see https://developer.exist.io/reference/authentication/oauth2/
 */
export const EXIST_OAUTH_TOKEN_URL = 'https://exist.io/oauth2/access_token';

/**
 * Exist rate-limits at 300 requests per hour per user token and answers an
 * exceeded quota with `429 Too Many Requests` and no body.
 * @see https://developer.exist.io/guide/
 */
export const EXIST_RATE_LIMIT_PER_HOUR = 300;

const EXIST_GET_RATE_LIMIT: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

const EXIST_WRITE_RATE_LIMIT: RateLimitConfig = {
	...EXIST_GET_RATE_LIMIT,
	enabled: false,
	maxRetries: 0,
};

/**
 * Write endpoints (`acquire`, `release`, `update`, `increment`) accept at most
 * 35 objects per array.
 * @see https://developer.exist.io/reference/writing_data/
 */
export const EXIST_MAX_BATCH_SIZE = 35;

export class ExistAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		// unknown is necessary because Exist error payloads vary by endpoint; a closed error body union is infeasible because the API publishes no single failure schema
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ExistAPIError';
	}
}

export type ExistQueryValue = string | number | boolean | undefined;

export type ExistRequestOptions = {
	method?: 'GET' | 'POST';
	/**
	 * Exist write endpoints take a top-level JSON array of objects; read
	 * endpoints take no body at all.
	 */
	// unknown is necessary because write batch entries differ per operation; a closed entry union is infeasible because acquire, update and increment each accept different fields
	body?: readonly Record<string, unknown>[];
	query?: Record<string, ExistQueryValue>;
	outputSchema?: z.ZodType<any>;
};

/** Serializes a `groups`/`attributes`/`templates` filter as Exist expects it. */
export function toCommaList(values?: readonly string[]): string | undefined {
	if (!values || values.length === 0) return undefined;
	return values.join(',');
}

/**
 * `strong`, `confident` and `include_historical` are documented as flags that
 * are switched on by sending `1`; sending `0` is not documented, so a false
 * value drops the parameter entirely.
 */
export function toFlag(value?: boolean): 1 | undefined {
	return value === true ? 1 : undefined;
}

/** Drops undefined entries so they never reach the query string. */
export function compactQuery(
	query: Record<string, ExistQueryValue>,
): Record<string, ExistQueryValue> {
	const out: Record<string, ExistQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

// unknown is necessary because the transport can throw any value; a closed error union is infeasible because fetch-level failures are untyped
function wrapError(error: unknown): never {
	if (error instanceof ExistAPIError) throw error;
	if (error instanceof ApiError) {
		let message = error.message;
		if (error.body && typeof error.body === 'object') {
			// unknown is necessary because error detail payloads are provider-defined; a closed detail union is infeasible across endpoints
			const body = error.body as Record<string, unknown>;
			const detail = body.error ?? body.detail ?? body.message;
			if (typeof detail === 'string' && detail.length > 0) message = detail;
		}
		throw new ExistAPIError(
			message,
			error.status,
			error.body,
			error.retryAfter,
		);
	}
	if (error instanceof Error) throw new ExistAPIError(error.message);
	throw new ExistAPIError('Unknown error');
}

/**
 * Issues a request against the Exist API v2 with an OAuth2 bearer token.
 * @see https://developer.exist.io/reference/authentication/oauth2/
 */
export async function makeExistRequest<T>(
	endpoint: string,
	accessToken: string,
	options: ExistRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, outputSchema } = options;

	const config: OpenAPIConfig = {
		BASE: EXIST_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json',
		query: query && Object.keys(query).length > 0 ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig:
				method === 'GET' ? EXIST_GET_RATE_LIMIT : EXIST_WRITE_RATE_LIMIT,
		});
		if (outputSchema) {
			const parsed = outputSchema.safeParse(response);
			if (!parsed.success) {
				throw new ExistAPIError(
					`Exist response failed schema validation: ${parsed.error.message}`,
				);
			}
			return parsed.data as T;
		}
		return response;
	} catch (error) {
		wrapError(error);
	}
}

// unknown is necessary because callers pass arbitrary thrown values for classification; a closed error union is infeasible at this boundary
export function isUnauthorizedError(error: unknown): boolean {
	if (error instanceof ExistAPIError) return error.status === 401;
	if (error instanceof ApiError) return error.status === 401;
	return false;
}

export type ExistRequestContext = {
	key: string;
	/**
	 * Installed by `getOAuthAccessToken` so a token that was revoked or expired
	 * server-side can be re-minted once before the call is retried.
	 */
	_refreshAuth?: () => Promise<string>;
};

/**
 * Runs a request and, on a 401, mints a fresh access token once and retries.
 */
export async function makeAuthenticatedExistRequest<T>(
	endpoint: string,
	ctx: ExistRequestContext,
	options: ExistRequestOptions = {},
): Promise<T> {
	try {
		return await makeExistRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeExistRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
