import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for any non-2xx Clientary response. Preserves the HTTP status,
 * response body, and Retry-After header from the underlying `ApiError` so
 * `error-handlers.ts` can inspect them without re-requesting.
 */
export class ClientaryAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/**
	 * The raw response body. Clientary returns Rails-style error JSON
	 * (`{ error: "...", errors: { field: ["message"] } }` or a plain detail
	 * string) that doesn't map to a single known schema, so callers narrow
	 * it themselves (see error-handlers.ts).
	 */
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'ClientaryAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists
// for this state, so message matching is the only handle available; kept
// narrow on purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads a stored value from the account key manager.
 *
 * The underlying getter throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only
 * ever configure values via plugin options and never touch the key
 * manager, and must resolve to "not stored" rather than abort the request.
 *
 * Anything else thrown (decryption failure, database error, ...) is a real
 * operational problem, not an absent value, and must propagate.
 */
export async function tryGetStoredValue(
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
 * Builds the Clientary API v2 base URL for a given account subdomain.
 * Every Clientary account has its own subdomain:
 * `https://{yourdomain}.clientary.com/api/v2`.
 */
const CLIENTARY_SUBDOMAIN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

function assertClientarySubdomain(domain: string): void {
	if (!CLIENTARY_SUBDOMAIN.test(domain)) {
		throw new Error('Clientary subdomain is invalid');
	}
}

export function getClientaryBaseUrl(domain: string): string {
	assertClientarySubdomain(domain);
	return `https://${domain}.clientary.com/api/v2`;
}

/**
 * The minimal context surface the client needs to resolve credentials.
 * Satisfied structurally by `ClientaryContext` (the endpoint context) so
 * this module stays dependency-free and avoids an import cycle with
 * `index.ts`.
 */
export type ClientaryRequestContext = {
	/** The resolved API key (populated by the plugin keyBuilder). */
	key?: string;
	/** Plugin options (may carry a `domain` subdomain default). */
	options?: { domain?: string };
	/** Account key manager — holds the per-account subdomain when stored. */
	keys?: {
		get_domain?: () => Promise<string | null | undefined>;
	};
};

/**
 * Resolves the API key and account subdomain for a request.
 *
 * The key comes from `ctx.key` (set by the plugin keyBuilder from either
 * plugin options or the stored account API key). The subdomain is read from
 * the `domain` plugin option first, then from the stored per-account
 * `domain` field. Throws when either is unavailable so endpoints fail fast
 * with a clear message instead of issuing a malformed request.
 */
export async function getClientaryCredentials(
	ctx: ClientaryRequestContext,
): Promise<{ apiKey: string; domain: string }> {
	if (!ctx.key) {
		throw new AuthMissingError('clientary', 'api_key');
	}

	let domain = ctx.options?.domain;
	if (!domain) {
		domain = await tryGetStoredValue(async () => ctx.keys?.get_domain?.());
	}

	if (!domain) {
		throw new Error(
			'Clientary subdomain is not configured. Provide it via the `domain` plugin option or store the account subdomain.',
		);
	}

	assertClientarySubdomain(domain);

	return { apiKey: ctx.key, domain };
}

/**
 * Performs a request against the Clientary API v2.
 *
 * Auth: HTTP Basic with the API token used as BOTH the username and the
 * password (`-u {api-token}:{api-token}`), as required by the Clientary
 * docs. `OpenAPIConfig.USERNAME`/`PASSWORD` produce the
 * `Authorization: Basic ...` header.
 *
 * GET endpoints take query parameters; POST/PUT endpoints take a JSON body
 * and must send `Accept: application/json`.
 */
export async function makeClientaryRequest<T>(
	endpoint: string,
	apiKey: string,
	domain: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		query?: Record<string, string | number | boolean | undefined>;
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', query, body } = options;

	const config: OpenAPIConfig = {
		BASE: getClientaryBaseUrl(domain),
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		USERNAME: apiKey,
		PASSWORD: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType:
			method === 'POST' || method === 'PUT' ? 'application/json' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ClientaryAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new ClientaryAPIError(error.message, undefined, { cause: error });
		}
		throw new ClientaryAPIError('Unknown error');
	}
}
