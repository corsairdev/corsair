import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

/**
 * Error thrown for any non-2xx Pushbullet response. Pushbullet returns a JSON
 * `error` object with `type`, `message` and sometimes `param`; the HTTP status
 * is preserved from the underlying `ApiError` so `error-handlers.ts` can
 * classify without re-issuing the request.
 */
export class PushbulletAPIError extends Error {
	public readonly status?: number;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	/**
	 * HTTP method of the failed request. The error policy needs it to decide
	 * whether a retry is safe: replaying a POST that Pushbullet may already
	 * have applied would create a duplicate push, device or chat.
	 */
	public readonly method?: string;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'PushbulletAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.method = options.cause.request?.method;
		}
	}
}

// Matches only corsair's "no DEK on this account" state, which is valid for
// accounts that pass the key through plugin options and never touch the key
// manager. Kept narrow so it cannot swallow a real fault.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads the stored API key, treating "this account has no encryption key" as
 * "no stored key" rather than an error. Anything else propagates.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/** Pushbullet REST API v2 root. */
export const PUSHBULLET_API_BASE = 'https://api.pushbullet.com/v2';

/**
 * Performs a request against the Pushbullet API.
 *
 * Auth: Pushbullet uses its own `Access-Token` header rather than
 * `Authorization: Bearer`, so the token is set as an explicit header and
 * `TOKEN` is left unset — passing it as a bearer token would authenticate
 * nothing.
 */
export async function makePushbulletRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		/**
		 * Output schema for the response. Pushbullet can drift or return a
		 * partial object, and nothing downstream re-checks the shape, so
		 * validating here stops malformed data escaping under the declared
		 * return type and being written into the local cache.
		 */
		schema?: ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, schema } = options;

	const config: OpenAPIConfig = {
		BASE: PUSHBULLET_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Access-Token': apiKey,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
		query,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return schema ? schema.parse(response) : response;
	} catch (error) {
		if (error instanceof ApiError) {
			// Surface Pushbullet's structured error message when present.
			const detail = (
				error.body as { error?: { message?: string } } | undefined
			)?.error?.message;
			throw new PushbulletAPIError(detail ?? error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new PushbulletAPIError(error.message, undefined, { cause: error });
		}
		throw new PushbulletAPIError('Unknown error');
	}
}
