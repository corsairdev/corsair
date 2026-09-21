import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for any non-2xx Codacy response. Preserves the HTTP status,
 * response body, and Retry-After header from the underlying `ApiError` so
 * `error-handlers.ts` can inspect them without re-requesting.
 */
export class CodacyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/**
	 * The raw response body. Codacy returns JSON error payloads
	 * (`{ error: "...", ... }`) that don't map to a single known schema,
	 * so callers narrow it themselves (see error-handlers.ts).
	 */
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'CodacyAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/**
 * Safely reads a stored value from the account key manager.
 *
 * The underlying getter throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only
 * ever configure values via plugin options and never touch the key
 * manager, and must resolve to "not stored" rather than abort the request.
 */
export async function tryGetStoredValue(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && /no dek found/i.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/**
 * Builds the Codacy API v3 base URL.
 * See https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export function getCodacyBaseUrl(): string {
	return 'https://api.codacy.com/api/v3';
}

/**
 * The minimal context surface the client needs to resolve credentials.
 * Satisfied structurally by `CodacyContext` (the endpoint context) so
 * this module stays dependency-free and avoids an import cycle with
 * `index.ts`.
 */
export type CodacyRequestContext = {
	/** The resolved API token (populated by the plugin keyBuilder). */
	key?: string;
};

/**
 * Retrieves the Codacy API token from the context.
 * Throws when unavailable so endpoints fail fast with a clear message.
 */
export async function getCodacyCredentials(
	ctx: CodacyRequestContext,
): Promise<string> {
	if (!ctx.key) {
		throw new AuthMissingError('codacy', 'api_key');
	}
	return ctx.key;
}

/**
 * Performs a request against the Codacy API v3.
 *
 * Auth: account API token sent in the `api-token` request header, as
 * required by the Codacy docs (not a Bearer token):
 * https://docs.codacy.com/codacy-api/using-the-codacy-api/#authenticating-requests
 *
 * All implemented endpoints are reads, so only GET is supported here.
 * List endpoints take cursor-based pagination via query parameters.
 */
export async function makeCodacyRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', query } = options;

	const config: OpenAPIConfig = {
		BASE: getCodacyBaseUrl(),
		VERSION: '3.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		USERNAME: undefined,
		PASSWORD: undefined,
		HEADERS: {
			Accept: 'application/json',
			'api-token': token,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CodacyAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new CodacyAPIError(error.message, undefined, { cause: error });
		}
		throw new CodacyAPIError('Unknown error');
	}
}
