import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for any non-2xx or `{ success: false }` Kraken.io response.
 */
export class KrakenAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		/** Milliseconds to wait before retrying, from `ApiError.retryAfter`. */
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'KrakenAPIError';
	}
}

export type KrakenCredentials = {
	apiKey: string;
	apiSecret: string;
};

/**
 * `ctx.key` carries both credentials as `api_key:api_secret` (see
 * index.ts#keyBuilder) because Kraken.io authenticates via `auth.api_key`
 * / `auth.api_secret` JSON body fields, not a bearer/header token.
 */
export function parseKrakenCredentials(key: string): KrakenCredentials {
	const separator = key.indexOf(':');
	if (separator === -1) {
		throw new KrakenAPIError(
			'Kraken.io credentials must be in api_key:api_secret format',
		);
	}
	return {
		apiKey: key.slice(0, separator),
		apiSecret: key.slice(separator + 1),
	};
}

const KRAKEN_API_BASE = 'https://api.kraken.io';

/**
 * All Kraken.io API operations are POST-only JSON endpoints. Auth is sent
 * as an `auth: { api_key, api_secret }` field on every request body rather
 * than a header, per https://kraken.io/docs/getting-started.
 *
 * Kraken.io's own path scheme is not uniformly versioned: `v1/url` is
 * versioned but `user_status` is not (verified directly against the live
 * API — `v1/user_status` 404s). Callers pass the exact path Kraken expects.
 */
export async function makeKrakenRequest<T>(
	endpoint: string,
	credentials: KrakenCredentials,
	body: Record<string, unknown> = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: KRAKEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: endpoint,
		body: {
			...body,
			auth: {
				api_key: credentials.apiKey,
				api_secret: credentials.apiSecret,
			},
		},
		mediaType: 'application/json; charset=utf-8',
	};

	let response: T;
	try {
		response = await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const errBody = error.body as { message?: string } | undefined;
			throw new KrakenAPIError(
				errBody?.message ?? error.message,
				undefined,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new KrakenAPIError(error.message);
		}
		throw new KrakenAPIError('Unknown error');
	}

	// Kraken.io returns HTTP 200 with `{ success: false, message: "..." }`
	// for request-level failures (e.g. bad URL, invalid quota), so success
	// must be checked in the body, not just the HTTP status.
	if (
		response &&
		typeof response === 'object' &&
		'success' in response &&
		(response as { success: unknown }).success === false
	) {
		const message =
			(response as { message?: string }).message ?? 'Kraken.io request failed';
		throw new KrakenAPIError(message);
	}

	return response;
}
