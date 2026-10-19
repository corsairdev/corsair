import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import { z } from 'zod';

export class MinimaxAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MinimaxAPIError';
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists for
// this state, so message matching is the only handle available; kept narrow on
// purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only ever
 * configure the key via plugin options and never touch the key manager, and
 * must resolve to "no stored key" rather than abort the call. Anything else
 * thrown (decryption failure, database error, ...) is a real operational
 * problem, not an absent key, and must propagate.
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
 * The transport's own retry loop is disabled (`maxRetries: 0`) so the plugin's
 * error handlers are the single owner of retries (core drives them in
 * `core/endpoints/bind.ts`); this keeps a sustained 429 to one request per
 * handler attempt instead of stacking the transport's default retries on top.
 * `isRateLimitError` also treats 503 as retryable so the transport still
 * attaches `Retry-After` to the `ApiError` for service-unavailable responses,
 * which the 503 handler needs.
 */
const TRANSPORT_RETRY_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
	isRateLimitError: (status) => status === 429 || status === 503,
};

export const MINIMAX_API_BASE = 'https://api.minimax.io';

// Query values are flat scalars or shallow nested objects: the V2 task-list
// endpoints take `filter[...]` keys, which the shared transport expands from a
// nested object, while repeated keys are expressed as arrays.
export type MinimaxQueryValue =
	| string
	| number
	| boolean
	| undefined
	| readonly (string | number)[]
	| { readonly [key: string]: MinimaxQueryValue };

export type MinimaxRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Bodies are endpoint-specific JSON (already validated by the zod input
	// schemas before send), so the shared transport stays generic over a JSON
	// record instead of a closed per-endpoint union.
	body?: Record<string, unknown>;
	query?: Record<string, MinimaxQueryValue>;
};

// MiniMax answers many endpoints with HTTP 200 plus a non-zero
// `base_resp.status_code` (see the error-code reference). This envelope lets
// the client turn those into real errors without type assertions; only
// `base_resp` is inspected, the rest of the wire body stays unbounded.
const BaseRespEnvelopeSchema = z
	.object({
		base_resp: z
			.object({
				status_code: z.number(),
				status_msg: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export async function makeMinimaxRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: MinimaxRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// An explicitly empty key means no credentials are configured. Every
	// MiniMax endpoint requires the key, so fail fast with Corsair's
	// missing-auth error instead of sending a request that the provider answers
	// with 401 / status_code 1004. The keyBuilder already throws
	// AuthMissingError when nothing is stored; this stays as a guard for
	// callers that pass an empty key directly.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('minimax', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: MINIMAX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Video, music and audio generation are long-running requests that can
		// exceed the shared 20s default.
		TIMEOUT: 60_000,
		HEADERS: {
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: body !== undefined ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: TRANSPORT_RETRY_CONFIG,
		});

		const envelope = BaseRespEnvelopeSchema.safeParse(response);
		if (envelope.success && envelope.data.base_resp.status_code !== 0) {
			const { status_code, status_msg } = envelope.data.base_resp;
			throw new MinimaxAPIError(
				status_msg ?? 'MiniMax request failed',
				String(status_code),
			);
		}

		return response;
	} catch (error) {
		// Rethrow transport errors (ApiError, MinimaxAPIError) untouched so
		// retry-after metadata survives for the plugin's error handlers.
		if (error instanceof Error) {
			throw error;
		}
		throw new MinimaxAPIError('Unknown error');
	}
}
