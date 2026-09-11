import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for any non-2xx Veriphone response. Preserves the HTTP status,
 * response body, and rate-limit headers from the underlying `ApiError` so
 * `error-handlers.ts` can inspect them without re-requesting.
 *
 * API reference: https://veriphone.io/docs/v3 (Error Responses table:
 * 400/401/402/403/404/500; 429 is handled via standard rate-limit headers).
 */
export class VeriphoneAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/** The raw response body. Deliberately `unknown` — Veriphone error
	 * payloads vary (`{ status, code, type, message }`) so callers narrow it
	 * themselves (see error-handlers.ts). */
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
		this.name = 'VeriphoneAPIError';

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
 * Veriphone API base URL. All endpoints live under this host.
 * Docs: https://veriphone.io/docs/v3
 */
export const VERIPHONE_API_BASE = 'https://api.veriphone.io';

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class
// exists for this state, so message matching is the only handle available;
// kept narrow on purpose so it can't accidentally swallow an unrelated
// failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only
 * ever configure the key via plugin options and never touch the key
 * manager, and must resolve to "no stored key" rather than abort the
 * request.
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

/**
 * Performs a request against the Veriphone API (v3).
 *
 * Auth: API key via `Authorization: Bearer <key>` (recommended method per
 * https://veriphone.io/docs/v3#authentication; `?key=` and cookie are
 * avoided so the key never lands in logs).
 *
 * All Veriphone endpoints accept GET and POST; this client uses GET with
 * query parameters exclusively, so the options type only exposes `query`.
 * Narrowing (rather than silently dropping `body` for some methods) fixes
 * the discarded-options finding.
 */
export async function makeVeriphoneRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { query } = options;

	const config: OpenAPIConfig = {
		BASE: VERIPHONE_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
			throw new VeriphoneAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new VeriphoneAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new VeriphoneAPIError('Unknown error');
	}
}
