import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * CircleCI's REST v2 API - the documented, spec-published surface.
 * @see https://circleci.com/docs/api/v2/
 */
const CIRCLECI_V2_BASE = 'https://circleci.com/api/v2';

/**
 * CircleCI's REST v3 API - orb registry (packages, versions, categories),
 * namespaces, jobs, artifacts, test results and self-hosted runners.
 *
 * Not published as a spec alongside v2. Found by reading CircleCI's own
 * open-source CLI (`github.com/CircleCI-Public/circleci-cli`,
 * `internal/apiclient/*.go`) as ground truth and confirming every route live -
 * the same method used for Habitica's server source. Every route answered
 * with the same personal API token used for v2.
 *
 * JSON:API-shaped: a single entity is `{"data": {"id","attributes","references"}}`,
 * a list is `{"data": [...], "page": {"next","prev"}}`, pagination is
 * `page[cursor]=`/`page[limit]=`, and filters are `filter[key]=value` - all
 * confirmed live, none of it matches v2's plain `page-token=`/bare query
 * convention.
 */
const CIRCLECI_V3_BASE = 'https://circleci.com/api/v3';

/**
 * CircleCI's legacy v1.1 API.
 *
 * Superseded by v2 for almost everything, but still live and still the only
 * way to reach a job by its plain number rather than its v2/v3 UUID -
 * `GET /project/{vcs}/{org}/{project}/{build_num}` and its `/artifacts` and
 * `/tests` siblings. Confirmed live 2026-08-16.
 *
 * **The job-detail response embeds the triggering commit's author email**
 * under `all_commit_details[].author_email` - confirmed live, on this
 * project's own history. Never mirrored, never logged; the account holder's
 * email is a secret-scanner needle for this integration the same way
 * Habitica's `auth.local.email` was.
 */
const CIRCLECI_V1_BASE = 'https://circleci.com/api/v1.1';

/**
 * CircleCI's legacy GraphQL API.
 *
 * CircleCI's own current CLI has moved off it - `orb.go` and `namespace.go`
 * call `/api/v3` instead, and `graphql-unstable` appears nowhere in the CLI's
 * real code, only in a test fixture. But the server still answers real
 * queries with real data on the same personal API token, and several catalog
 * operations commit explicitly to this transport in their own description
 * ("using the GraphQL API", "via the `orbConfig` GraphQL query") - so those
 * are implemented against it rather than silently redirected to a REST
 * equivalent, honouring what the catalog specifies rather than only the
 * effect it produces.
 *
 * Introspection is disabled (`Cannot query field '__schema' on type
 * 'QueryRoot'`), so the schema used here was mapped by reading
 * `circleci-cli`'s historical usage plus live field-not-found and
 * missing-argument errors, which - unusually - name the real field, the
 * defined arguments, or an input type's full required-key set directly.
 */
const CIRCLECI_GRAPHQL_URL = 'https://circleci.com/graphql-unstable';

/** Same ceiling as the shared transport's default; stated for the raw-fetch GraphQL path, which does not inherit it automatically. */
const CIRCLECI_GRAPHQL_TIMEOUT_MS = 20_000;

/**
 * 300 requests per window, confirmed from live response headers
 * (`x-ratelimit-limit: 300`). The window's **length** is not configured here:
 * `x-ratelimit-reset` held steady at `1` across three rapid successive calls
 * rather than counting down, which is the shape of a window-length field, not
 * a countdown-to-reset field - the header name looks like the latter and
 * behaves like the former, so it is deliberately left unconfigured rather than
 * fed to `RateLimitConfig.headerNames.resetTime`, which expects a countdown.
 * A real 429 was not induced to find the true unit: this integration's build
 * needs the same 300-request budget the client itself will run on, and
 * spending it to pin down a value only relevant to a rare throttle was not
 * worth the trade. `retry-after` is honoured if CircleCI sends one; the
 * exponential backoff below stands on its own if not.
 */
const CIRCLECI_RATE_LIMIT_CONFIG: RateLimitConfig = {
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

export class CircleCIAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		/**
		 * Milliseconds, matching `ApiError.retryAfter`'s own unit
		 * (`packages/corsair/async-core/ApiError.ts`) - carried through so
		 * `error-handlers.ts` can honour the server's real backoff window
		 * instead of retrying blind. See `wrapError` and the GraphQL
		 * transport below for where this gets populated.
		 */
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CircleCIAPIError';
	}
}

/**
 * Raised by the GraphQL transport, which reports failure as a 200 carrying an
 * `errors[]` array rather than a non-2xx status - a v2 `ApiError` cannot
 * represent this shape, so it needs its own type and its own branch in
 * `error-handlers.ts`.
 */
export class CircleCIGraphQLError extends Error {
	constructor(
		message: string,
		public readonly errors: readonly { message: string }[],
	) {
		super(message);
		this.name = 'CircleCIGraphQLError';
	}
}

function buildConfig(base: string, apiToken: string): OpenAPIConfig {
	return {
		BASE: base,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			// The recommended scheme per CircleCI's own OpenAPI spec, confirmed
			// live to behave identically to the `Circle-Token` header and HTTP
			// Basic. A **personal** API token, not a project token - the spec's
			// own security-scheme descriptions warn "Project API tokens are not
			// supported for API v2. Use a personal API token," and that applies
			// to v3 and v1.1 too, confirmed live with the same personal token.
			Authorization: `Bearer ${apiToken}`,
		},
	};
}

export type CircleCIRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	/**
	 * An array value is serialised as a repeated key
	 * (`?branches=a&branches=b`), which is what CircleCI's own spec examples
	 * for `branches` and `project-names` document - confirmed to be exactly
	 * what the shared transport's query builder already does for an array
	 * value, so no special-casing is needed here.
	 */
	query?: Record<string, string | number | boolean | string[] | undefined>;
};

/** Issues a request against the documented REST v2 API. */
export async function makeCircleCIRequest<T>(
	endpoint: string,
	apiToken: string,
	options: CircleCIRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(
			buildConfig(CIRCLECI_V2_BASE, apiToken),
			requestOptions,
			{
				rateLimitConfig: CIRCLECI_RATE_LIMIT_CONFIG,
			},
		);
	} catch (error) {
		throw wrapError(error);
	}
}

/**
 * Issues a request against the undocumented REST v3 API and unwraps its
 * JSON:API envelope (`{"data": ...}`) to the caller's shape.
 *
 * A response that does not carry a top-level `data` key is returned as-is,
 * so a route this integration has not yet met does not silently come back
 * `undefined`.
 */
export async function makeCircleCIV3Request<T>(
	endpoint: string,
	apiToken: string,
	options: CircleCIRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		const response = await request<unknown>(
			buildConfig(CIRCLECI_V3_BASE, apiToken),
			requestOptions,
			{ rateLimitConfig: CIRCLECI_RATE_LIMIT_CONFIG },
		);
		if (
			response !== null &&
			typeof response === 'object' &&
			'data' in response
		) {
			return (response as { data: T }).data;
		}
		return response as T;
	} catch (error) {
		throw wrapError(error);
	}
}

/**
 * Issues a request against a REST v3 **list** route and preserves the
 * pagination cursor `makeCircleCIV3Request` above discards.
 *
 * The real envelope is `{"data": [...], "page": {"next": ..., "prev": ...}}`
 * - confirmed from `circleci-cli`'s own `v3List[T]` struct, since v3 has no
 * published spec. Reshaped to `{"items": [...], "page": {...}}` rather than
 * unwrapped to a bare array, so a caller can see whether more pages exist and
 * what cursor to ask for next. `makeCircleCIV3Request` stays as it is for the
 * single-entity v3 routes (`namespaces.ts`'s name lookups), which have no
 * `page` object to lose in the first place.
 *
 * A bare array response is also accepted, as `items` with no `page` -
 * `makeCircleCIV3Request` above extends the same tolerance to an unwrapped
 * single entity, for the same reason: a route this integration has not met
 * in exactly the confirmed shape should not be assumed to match it.
 *
 * **Anything else throws, rather than defaulting to an empty list.** An
 * earlier version of this function read `response.data ?? []`, so a
 * malformed or unexpected response - `null`, a validation-error object
 * shaped nothing like a list, a future API change - silently resolved to
 * zero items instead of surfacing a failure. A caller reading "0 results" as
 * "the account has none" has no way to tell that apart from "the response
 * could not be understood," which is a strictly worse outcome than a thrown
 * error naming what was actually received.
 */
export async function makeCircleCIV3ListRequest<T>(
	endpoint: string,
	apiToken: string,
	options: CircleCIRequestOptions = {},
): Promise<{
	items: T[];
	page?: { next?: string | null; prev?: string | null };
}> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		const response = await request<unknown>(
			buildConfig(CIRCLECI_V3_BASE, apiToken),
			requestOptions,
			{ rateLimitConfig: CIRCLECI_RATE_LIMIT_CONFIG },
		);

		if (Array.isArray(response)) {
			return { items: response as T[], page: undefined };
		}
		if (
			response !== null &&
			typeof response === 'object' &&
			Array.isArray((response as { data?: unknown }).data)
		) {
			const envelope = response as {
				data: T[];
				page?: { next?: string | null; prev?: string | null };
			};
			return { items: envelope.data, page: envelope.page };
		}

		throw new CircleCIAPIError(
			`CircleCI v3 list response did not match either the {"data": [...]} envelope or a bare array: received ${JSON.stringify(response)?.slice(0, 200)}`,
		);
	} catch (error) {
		throw wrapError(error);
	}
}

/**
 * Issues a request against the legacy v1.1 API.
 *
 * v1.1 predates the `corsair/http` request helper's assumptions least of any
 * transport here, but its response bodies are ordinary JSON, so the shared
 * helper is still used rather than a raw `fetch` - unlike Habitica's
 * non-JSON exports, there is no transport mismatch to work around, only an
 * older base URL and an older, flatter response shape.
 */
export async function makeCircleCIV1Request<T>(
	endpoint: string,
	apiToken: string,
	options: CircleCIRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(
			buildConfig(CIRCLECI_V1_BASE, apiToken),
			requestOptions,
			{
				rateLimitConfig: CIRCLECI_RATE_LIMIT_CONFIG,
			},
		);
	} catch (error) {
		throw wrapError(error);
	}
}

function wrapError(error: unknown): CircleCIAPIError {
	if (error instanceof CircleCIAPIError) return error;
	if (error instanceof Error) {
		// The shared `request` helper throws `ApiError`, which carries `status`
		// and (when the server sent one) `retryAfter` in milliseconds. Both are
		// read structurally rather than importing `ApiError` for an `instanceof`
		// check, matching how this file already treats the shared transport's
		// errors as an untyped carrier elsewhere.
		const carrier = error as unknown as {
			status?: unknown;
			retryAfter?: unknown;
		};
		const status =
			typeof carrier.status === 'number' ? carrier.status : undefined;
		const retryAfter =
			typeof carrier.retryAfter === 'number' ? carrier.retryAfter : undefined;
		return new CircleCIAPIError(error.message, status, undefined, retryAfter);
	}
	return new CircleCIAPIError('Unknown error');
}

/**
 * Issues a GraphQL request against `graphql-unstable`.
 *
 * Goes through raw `fetch` rather than the shared `request` helper: the shared
 * helper treats a non-2xx status as the failure signal, but GraphQL reports
 * failure as **200 with an `errors[]` array** in the body - a request can
 * even come back with both `data` (partial) and `errors` populated. Routing
 * this through `request()` would report every GraphQL-level failure as a
 * success.
 *
 * A network-level failure (the fetch itself rejecting, a non-200 the server
 * should never send here) still throws `CircleCIAPIError`, so callers only
 * need to handle one error type union across GraphQL and REST -
 * `CircleCIGraphQLError` for a GraphQL-level failure, `CircleCIAPIError` for
 * everything else.
 */
export async function makeCircleCIGraphQLRequest<T>(
	query: string,
	variables: Record<string, unknown> | undefined,
	apiToken: string,
): Promise<T> {
	let response: Response;
	try {
		response = await fetch(CIRCLECI_GRAPHQL_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiToken}`,
			},
			body: JSON.stringify({ query, variables }),
			signal: AbortSignal.timeout(CIRCLECI_GRAPHQL_TIMEOUT_MS),
		});
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new CircleCIAPIError(`CircleCI GraphQL request failed: ${reason}`);
	}

	if (!response.ok) {
		// This raw-fetch path does not go through the shared `request` helper,
		// so it does not inherit that helper's own `Retry-After` parsing -
		// re-supplied here explicitly, the same reasoning as the timeout above.
		// Seconds per RFC 9110, converted to milliseconds to match
		// `ApiError.retryAfter`'s unit and `CircleCIAPIError`'s own.
		const retryAfterHeader = response.headers.get('retry-after');
		const retryAfterSeconds = retryAfterHeader
			? Number.parseInt(retryAfterHeader, 10)
			: undefined;
		const retryAfter =
			retryAfterSeconds !== undefined && Number.isFinite(retryAfterSeconds)
				? retryAfterSeconds * 1000
				: undefined;
		throw new CircleCIAPIError(
			`CircleCI GraphQL returned HTTP ${response.status} ${response.statusText}`,
			response.status,
			undefined,
			retryAfter,
		);
	}

	let body: { data?: T; errors?: { message: string }[] };
	try {
		body = (await response.json()) as {
			data?: T;
			errors?: { message: string }[];
		};
	} catch (error) {
		// A malformed body on an ostensibly-200 response - a proxy or CDN
		// returning an HTML error page under a 200 status is the realistic
		// cause. Without this, `response.json()`'s raw `SyntaxError` would
		// leak past the `CircleCIAPIError`/`CircleCIGraphQLError` contract
		// every caller and `error-handlers.ts` classify against.
		const reason = error instanceof Error ? error.message : String(error);
		throw new CircleCIAPIError(
			`CircleCI GraphQL returned an unparseable response body: ${reason}`,
			response.status,
		);
	}

	if (body.errors && body.errors.length > 0) {
		throw new CircleCIGraphQLError(
			body.errors[0]?.message ?? 'GraphQL error',
			body.errors,
		);
	}

	return body.data as T;
}

export {
	CIRCLECI_GRAPHQL_URL,
	CIRCLECI_RATE_LIMIT_CONFIG,
	CIRCLECI_V1_BASE,
	CIRCLECI_V2_BASE,
	CIRCLECI_V3_BASE,
};
