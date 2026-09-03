import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class PostmanAPIError extends Error {
	public readonly code?: string;
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number | string;

	constructor(message: string, options?: { code?: string; cause?: Error }) {
		super(message, options);
		this.name = 'PostmanAPIError';
		this.code = options?.code;
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const POSTMAN_API_BASE = 'https://api.getpostman.com';

const POSTMAN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type PostmanRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path?: Record<string, string | number>;
	body?: unknown;
	// Arrays serialize as repeated query keys (corsair/http getQueryString).
	query?: Record<string, string | number | boolean | string[] | undefined>;
};

export async function makePostmanRequest<T>(
	path: string,
	apiKey: string,
	options: PostmanRequestOptions = {},
): Promise<T> {
	const { method = 'GET', path: pathParams, body, query } = options;

	const config: OpenAPIConfig = {
		BASE: POSTMAN_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Api-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		path: pathParams,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: POSTMAN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof PostmanAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const bodyDetail =
				error.body == null
					? ''
					: typeof error.body === 'string'
						? error.body
						: JSON.stringify(error.body);
			const message = bodyDetail
				? `${error.statusText || 'API Error'}: ${bodyDetail}`
				: error.statusText || 'Unknown API Error';
			throw new PostmanAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new PostmanAPIError(error.message);
		}
		throw new PostmanAPIError('Unknown error');
	}
}

// Matches the "no DEK on this account" state from the account key manager.
// `ctx.keys.get_api_key()` throws (rather than returning null) in that
// state, which is valid for accounts that only configure the key via plugin
// options — it must resolve to "no stored key", not abort the request.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 * Anything other than the no-DEK state (decryption failure, database
 * error, ...) is a real operational problem and must propagate.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | null> {
	try {
		const res = await getter();
		return res ?? null;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return null;
		}
		throw error;
	}
}
