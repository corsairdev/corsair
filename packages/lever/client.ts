import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LeverAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'LeverAPIError';
	}
}

// Lever authenticates API keys with HTTP Basic (key as username, empty
// password) and OAuth 2.0 access tokens as bearer credentials.
export type LeverAuthType = 'api_key' | 'oauth_2';

const LEVER_API_BASE = 'https://api.lever.co/v1';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

const encodeBasicCredential = (apiKey: string): string => {
	const credentials = `${apiKey}:`;
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(credentials, 'utf8').toString('base64');
	}
	return btoa(credentials);
};

export const resolveLeverAuthorizationHeader = (
	credential: string,
	authType: LeverAuthType,
): string =>
	authType === 'oauth_2'
		? `Bearer ${credential}`
		: `Basic ${encodeBasicCredential(credential)}`;

export async function makeLeverRequest<T>(
	ctx: { key: string; options?: { authType?: LeverAuthType } },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Lever request bodies differ by operation and are validated by the
		// corresponding endpoint schema before reaching this transport boundary.
		// unknown: the endpoint schemas validate each provider-specific body.
		body?: Record<string, unknown>;
		query?: Record<string, string | string[] | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const authType: LeverAuthType = ctx.options?.authType ?? 'api_key';

	const config: OpenAPIConfig = {
		BASE: LEVER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: ctx.key,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: resolveLeverAuthorizationHeader(ctx.key, authType),
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new LeverAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new LeverAPIError(error.message);
		}
		throw new LeverAPIError('Unknown Lever API error');
	}
}
