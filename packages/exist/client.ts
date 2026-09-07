import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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
	body?: readonly Record<string, unknown>[];
	query?: Record<string, ExistQueryValue>;
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

function wrapError(error: unknown): never {
	if (error instanceof ExistAPIError) throw error;
	if (error instanceof ApiError) {
		let message = error.message;
		if (error.body && typeof error.body === 'object') {
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
	const { method = 'GET', body, query } = options;

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
		return await request<T>(config, requestOptions);
	} catch (error) {
		wrapError(error);
	}
}

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
