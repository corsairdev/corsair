import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * The versioned API base. The version is part of the path, not a header.
 *
 * @see https://habitica.com/apidoc/
 */
const HABITICA_API_BASE = 'https://habitica.com/api/v3';

/**
 * The three data-export operations sit on the same host but **outside** the
 * versioned base, at `/export/*`.
 *
 * They are reachable with ordinary header authentication. That is worth stating
 * because the server source routes them through `authWithSession` rather than
 * the `authWithHeaders` middleware every `/api/v3` route uses, which reads as
 * though a browser session were required. Checked live on 2026-08-15: all three
 * answered 200 to the same `x-api-user` / `x-api-key` pair used everywhere else.
 */
const HABITICA_ROOT_BASE = 'https://habitica.com';

/**
 * Habitica allows 30 authenticated requests per minute per user id, and answers
 * 429 `TooManyRequests` beyond that. Confirmed live on 2026-08-15 by firing
 * requests until throttled - the 30th was the one that failed, so the
 * documented figure is exact rather than approximate.
 *
 * Two details of the response headers shape this configuration, and both are
 * the reason it is not simply the default:
 *
 * - **`x-ratelimit-reset` is deliberately not configured.** Habitica sends a
 *   `Date.toString()` - `"Sat Aug 15 2026 16:43:00 GMT+0000 (Coordinated
 *   Universal Time)"` - where the shared helper expects a number it can
 *   `parseInt`. That parse yields `NaN`, which the helper discards, so naming
 *   the header would change no behaviour while implying the plugin paces itself
 *   from the reset time. It cannot; it reacts to `retry-after` instead.
 * - **`retry-after` is fractional seconds** - `"21.069"` was the observed
 *   value. The helper's `parseInt` truncates that to 21, so the first retry
 *   fires a fraction of a second early and can draw a second 429 before the
 *   exponential backoff spaces the attempts out. It converges within
 *   `maxRetries`; the extra 429 is expected, not a defect. The raw-`fetch`
 *   paths do not share this quirk - they parse the header themselves, see
 *   {@link parseRetryAfterMs}.
 */
const HABITICA_RATE_LIMIT_CONFIG: RateLimitConfig = {
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

/**
 * Identifies the caller to Habitica in the mandatory `x-client` header.
 *
 * Habitica's API usage guidelines document the form `UserID-AppName`, but the
 * server does not enforce it: `corsair` and a deliberately malformed
 * `not-a-uuid-at-all-xyz` were both accepted with 200 on 2026-08-15. Only an
 * empty value is rejected, and it is rejected exactly as an absent one is. A
 * stable application identifier is therefore both sufficient and honest - it
 * does not pretend to a format the server never checks, and it carries no user
 * id, so nothing account-specific is disclosed to request logs.
 */
const HABITICA_CLIENT_ID = 'corsair';

export type HabiticaRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/**
	 * The JSON request body, serialised as given.
	 *
	 * Typed as `unknown` values because bodies are assembled by the endpoints
	 * from their own already-validated input schemas, and those shapes vary
	 * widely - a task carries nested checklists and reminders, a group carries
	 * privacy and leader fields. Restating them here would duplicate every shape
	 * in a second place that could drift. Validation belongs to the endpoint
	 * input schemas in `endpoints/types.ts`; this type says only
	 * "already-checked JSON".
	 *
	 * An array is accepted because a few operations take a bare collection -
	 * `POST /tasks/user` creates either one task or many.
	 */
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
};

/**
 * Raised when a call needs the account's user id and none was available.
 *
 * Habitica's credential has two halves and the plugin cannot supply the missing
 * one for the caller, because no route can be reached without it - see
 * {@link makeHabiticaRequest}. Failing here with an explanation is better than
 * sending a request that is certain to come back as an opaque 401.
 */
export class HabiticaUserIdMissingError extends Error {
	constructor() {
		super(
			'Habitica requires the account user id alongside the API token. Set ' +
				'`userId` in the plugin options, or store one under the `user_id` key.',
		);
		this.name = 'HabiticaUserIdMissingError';
	}
}

/**
 * A failure from one of the raw-`fetch` paths.
 *
 * The four non-JSON operations cannot use the shared transport, so they also do
 * not get its `ApiError` - which is what normally carries the status and the
 * parsed `Retry-After` through to `error-handlers.ts`. Throwing a bare `Error`
 * would strip both, leaving a 429 to be retried on a blind exponential backoff
 * against a fixed one-minute window.
 *
 * The response body is deliberately **not** attached. A failed export can still
 * carry account data - `userdata.json` contains the account holder's email
 * address - and this error is exactly the object most likely to reach a log.
 */
export class HabiticaHttpError extends Error {
	constructor(
		message: string,
		readonly status: number,
		/** Milliseconds to wait, from `Retry-After`, when the server sent one. */
		readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'HabiticaHttpError';
	}
}

/**
 * Reads `Retry-After` into milliseconds.
 *
 * Habitica sends **fractional** seconds - `"21.069"` was the observed value on
 * a real 429. `parseFloat` keeps that precision where the shared transport's
 * `parseInt` truncates to 21 and retries a fraction of a second early; the
 * result is rounded up for the same reason, so a retry never fires inside the
 * window the server asked for.
 */
function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number.parseFloat(header);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return Math.ceil(seconds * 1000);
}

/**
 * Builds the request configuration for a base URL.
 *
 * `x-client` is set for every request, authenticated or not. The header is not
 * tied to authentication: `/api/v3/content` takes no credentials yet still
 * answers 400 `Missing x-client headers.` without it, while `/status` alone
 * tolerates its absence. Sending it unconditionally is correct on every route,
 * whereas sending it per-route would be a rule with one arbitrary exception.
 *
 * `TOKEN` is left `undefined` because Habitica does not use `Authorization`;
 * both credential halves travel as their own headers.
 */
function buildConfig(
	base: string,
	credentials?: HabiticaCredentials,
): OpenAPIConfig {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'x-client': HABITICA_CLIENT_ID,
	};

	if (credentials) {
		headers['x-api-user'] = credentials.userId;
		headers['x-api-key'] = credentials.apiToken;
	}

	return {
		BASE: base,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};
}

/**
 * The two halves of a Habitica credential.
 *
 * Both are checked by the server. A valid token with the wrong user id, and a
 * valid user id with the wrong token, are both answered 401 `There is no
 * account that uses those credentials.` - so the user id is a credential in its
 * own right, not a routing hint that the token could imply.
 */
export type HabiticaCredentials = {
	userId: string;
	apiToken: string;
};

/**
 * Issues an authenticated Habitica request against the versioned API.
 *
 * Habitica reports failures with real status codes - 400, 401, 403, 404, 429,
 * 500 - under a consistent `{"success":false,"error","message"}` envelope, so
 * success can be told from failure by status alone and the shared helper's
 * error handling applies unchanged.
 */
export async function makeHabiticaRequest<T>(
	endpoint: string,
	credentials: HabiticaCredentials,
	options: HabiticaRequestOptions = {},
): Promise<T> {
	if (!credentials.userId) throw new HabiticaUserIdMissingError();

	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json',
		query,
	};

	return await request<T>(
		buildConfig(HABITICA_API_BASE, credentials),
		requestOptions,
		{
			rateLimitConfig: HABITICA_RATE_LIMIT_CONFIG,
		},
	);
}

/**
 * Issues a request against a route that takes no credentials.
 *
 * A handful of operations - server status, the content catalogue, the model
 * path listings - are answered without authentication. They still travel
 * through this helper so they inherit the same timeout and retry behaviour, and
 * they still carry `x-client`, which they require.
 */
export async function makeHabiticaAnonymousRequest<T>(
	endpoint: string,
	options: HabiticaRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	return await request<T>(
		buildConfig(HABITICA_API_BASE),
		{
			method,
			url: endpoint,
			// The body matters here as much as on the authenticated path: the
			// three authentication routes are `authOptional` and POST their
			// credentials through this helper. Dropping it would send an empty
			// registration or login.
			body: method === 'POST' || method === 'PUT' ? body : undefined,
			mediaType: 'application/json',
			query,
		},
		{ rateLimitConfig: HABITICA_RATE_LIMIT_CONFIG },
	);
}

/**
 * Reads one of the three `/export/*` documents.
 *
 * Two things make these different from every other operation, and both are the
 * reason they need their own transport:
 *
 * - They live outside the versioned base, at `https://habitica.com/export/*`.
 * - Only one of the three answers with JSON. `history.csv` is `text/csv` and
 *   `inbox.html` is `text/html`, so the shared transport - which parses every
 *   body as JSON - cannot carry them. `fetch` is used directly and the body is
 *   returned as text for the endpoint to shape.
 *
 * The body is deliberately **not** included in the thrown error. A failed
 * export can still carry account data, and `userdata.json` in particular
 * contains the account holder's email address; a status line is enough to
 * diagnose a failure without copying personal data into an error message or a
 * log.
 */
export async function makeHabiticaExportRequest(
	document: 'userdata.json' | 'history.csv' | 'inbox.html',
	credentials: HabiticaCredentials,
): Promise<{ body: string; contentType: string }> {
	if (!credentials.userId) throw new HabiticaUserIdMissingError();

	let response: Response;
	try {
		response = await fetch(`${HABITICA_ROOT_BASE}/export/${document}`, {
			method: 'GET',
			headers: {
				'x-api-user': credentials.userId,
				'x-api-key': credentials.apiToken,
				'x-client': HABITICA_CLIENT_ID,
			},
			signal: AbortSignal.timeout(HABITICA_EXPORT_TIMEOUT_MS),
		});
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(`Habitica export ${document} request failed: ${reason}`);
	}

	if (!response.ok) {
		throw new HabiticaHttpError(
			`Habitica export ${document} returned HTTP ${response.status} ${response.statusText}`,
			response.status,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}

	return {
		body: await response.text(),
		contentType: response.headers.get('content-type') ?? '',
	};
}

/**
 * Reads a versioned-API route whose response is not JSON.
 *
 * There is exactly one: `GET /challenges/:challengeId/export/csv`. It is an
 * ordinary authenticated `/api/v3` route in every respect except that it
 * answers with CSV, which the shared JSON transport cannot carry - so it needs
 * `fetch` for the same reason the `/export/*` documents do, but against the
 * versioned base rather than the root.
 *
 * As with {@link makeHabiticaExportRequest}, the response body is kept out of
 * the thrown error: a challenge export names the challenge's participants.
 */
export async function makeHabiticaTextRequest(
	endpoint: string,
	credentials: HabiticaCredentials,
): Promise<{ body: string; contentType: string }> {
	if (!credentials.userId) throw new HabiticaUserIdMissingError();

	let response: Response;
	try {
		response = await fetch(`${HABITICA_API_BASE}/${endpoint}`, {
			method: 'GET',
			headers: {
				'x-api-user': credentials.userId,
				'x-api-key': credentials.apiToken,
				'x-client': HABITICA_CLIENT_ID,
			},
			signal: AbortSignal.timeout(HABITICA_EXPORT_TIMEOUT_MS),
		});
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(`Habitica request to ${endpoint} failed: ${reason}`);
	}

	if (!response.ok) {
		throw new HabiticaHttpError(
			`Habitica ${endpoint} returned HTTP ${response.status} ${response.statusText}`,
			response.status,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}

	return {
		body: await response.text(),
		contentType: response.headers.get('content-type') ?? '',
	};
}

/**
 * A longer ceiling than the shared transport's 20 seconds.
 *
 * An export is a whole-account document rather than a page of rows, so it is
 * the one place where a slow response is expected rather than a symptom. The
 * account used during development exported in well under a second, but that
 * account is small; a long-lived one with years of task history is not.
 */
const HABITICA_EXPORT_TIMEOUT_MS = 60_000;

export {
	HABITICA_API_BASE,
	HABITICA_CLIENT_ID,
	HABITICA_EXPORT_TIMEOUT_MS,
	HABITICA_RATE_LIMIT_CONFIG,
	HABITICA_ROOT_BASE,
};
