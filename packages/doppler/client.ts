import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Doppler's REST v3 API - the documented, current surface for everything
 * except Doppler Share.
 * @see https://docs.doppler.com/reference/api
 */
const DOPPLER_V3_BASE = 'https://api.doppler.com/v3';

/**
 * Doppler Share - a legacy-versioned surface on the same host
 * (`https://api.doppler.com/v1/share/...`), not `/v3`. Its own OpenAPI
 * fragment declares HTTP Basic auth (`"scheme": "basic"`), but the same
 * `Authorization: Bearer <token>` used everywhere else on this plugin was
 * confirmed live to work here too (a 400 validation error, not a 401) - so
 * this is a second base URL, not a second auth code path. See
 * `error-handlers.test.ts` for the pinned confirmation.
 */
const DOPPLER_V1_SHARE_BASE = 'https://api.doppler.com/v1/share';

/**
 * Confirmed from `docs.doppler.com/reference/api` (not guessed): the
 * Developer plan's limits, tied to the API token. Reads/secret-reads/writes
 * are three separate buckets, and this plugin's own mix of operations spans
 * all three - the tightest bucket (`secret reads`, 120/min) is the one that
 * actually constrains anything, and is what the live suite paces against.
 *
 * `x-ratelimit-reset` is a Unix timestamp (confirmed by the docs, unlike
 * CircleCI's ambiguous same-named header) - not relied on here regardless,
 * since `retry-after` is the more direct signal and is only sent once a 429
 * has actually happened.
 */
const DOPPLER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export class DopplerAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'DopplerAPIError';
	}
}

/**
 * `VERSION` only ever feeds `corsair/http`'s `{api-version}` URL-template
 * substitution - a mechanism this plugin's endpoint paths never use (none
 * of them contain that placeholder), so its value has no effect on any
 * request this plugin sends today. Still set per-base rather than a shared
 * hardcoded `'3'`, so the config accurately states which API version each
 * transport actually is if that ever changes.
 */
function buildConfig(base: string, apiToken: string): OpenAPIConfig {
	if (!apiToken.trim()) {
		throw new DopplerAPIError('Doppler API token is required', 401);
	}
	return {
		BASE: base,
		VERSION: base === DOPPLER_V1_SHARE_BASE ? '1' : '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiToken}`,
		},
	};
}

export type DopplerRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function wrapError(error: unknown): DopplerAPIError {
	if (error instanceof DopplerAPIError) return error;
	if (error instanceof Error) {
		// The shared `request` helper throws `ApiError`, which carries `status`
		// and (when the server sent one) `retryAfter` in milliseconds. Read
		// structurally rather than importing `ApiError` for an `instanceof`
		// check, matching how `CircleCIAPIError`'s own `wrapError` treats the
		// shared transport's errors as an untyped carrier.
		const carrier = error as unknown as {
			status?: unknown;
			retryAfter?: unknown;
		};
		const status =
			typeof carrier.status === 'number' ? carrier.status : undefined;
		const retryAfter =
			typeof carrier.retryAfter === 'number' ? carrier.retryAfter : undefined;
		return new DopplerAPIError(error.message, status, retryAfter);
	}
	return new DopplerAPIError('Unknown error');
}

/**
 * Shared by both exported request functions below - only `base` differs
 * between them. Kept as a private helper parameterized by base URL, rather
 * than duplicated, since the two were otherwise byte-identical apart from
 * which constant they passed to `buildConfig`.
 */
async function callDoppler<T>(
	base: string,
	endpoint: string,
	apiToken: string,
	options: DopplerRequestOptions,
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// Several Doppler DELETE routes take their identifiers in a JSON body
		// rather than the query string (`projects.delete`,
		// `serviceTokens.delete`, `dynamicSecrets.revokeLease`) - confirmed
		// from each route's own spec fragment. Sending a body only for
		// POST/PUT/PATCH would silently drop it on those, turning a
		// deliberate call into a request Doppler rejects as missing required
		// fields. GET is the only method this plugin ever calls without a
		// body, so gate on that instead of enumerating the methods that do.
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(buildConfig(base, apiToken), requestOptions, {
			rateLimitConfig: DOPPLER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw wrapError(error);
	}
}

/** Issues a request against the documented REST v3 API. */
export async function makeDopplerRequest<T>(
	endpoint: string,
	apiToken: string,
	options: DopplerRequestOptions = {},
): Promise<T> {
	return callDoppler<T>(DOPPLER_V3_BASE, endpoint, apiToken, options);
}

/**
 * Issues a request against Doppler Share (`/v1/share/...`) - the same
 * transport shape as `makeDopplerRequest`, just a different base URL. Kept
 * as a separate exported function rather than a parameter on one public
 * function, matching how `client.ts` for other multi-base plugins in this
 * repo keep one function per base rather than branching inside a shared
 * one - both now delegate to the same private `callDoppler` helper instead
 * of duplicating its body.
 */
export async function makeDopplerShareRequest<T>(
	endpoint: string,
	apiToken: string,
	options: DopplerRequestOptions = {},
): Promise<T> {
	return callDoppler<T>(DOPPLER_V1_SHARE_BASE, endpoint, apiToken, options);
}

export { DOPPLER_RATE_LIMIT_CONFIG, DOPPLER_V1_SHARE_BASE, DOPPLER_V3_BASE };
