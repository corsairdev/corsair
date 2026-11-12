/**
 * SatisMeter REST client.
 *
 * Unlike every other read in this plugin, the write endpoints sit on a
 * different base: the survey reads are versioned under `/api/v3`, while the
 * users API is unversioned under `/api`. Both were confirmed live — a
 * `DELETE /api/v3/users/abc` answers `404 Not Found` (no route), while
 * `DELETE /api/users/abc` answers `404 {"errors":[{"title":"User not found"}]}`,
 * which is the route's own message.
 *
 * Auth is one key for both bases: `Authorization: Bearer <key>`. The write key
 * from the browser snippet is *not* accepted by the users API — the provider's
 * own article says such a request returns 403
 * (https://support.satismeter.com/hc/en-us/articles/48846544018323).
 *
 * Error bodies are always `{ errors: [{ title }] }`.
 * Spec: https://app.satismeter.com/apidoc
 */

export const SATISMETER_API_V3 = 'https://app.satismeter.com/api/v3';
export const SATISMETER_API_WRITE = 'https://app.satismeter.com/api';

/**
 * A full page of 100 responses, plus the provider's own aggregation for a
 * statistics call, can take longer than a typical HTTP client default. The
 * provider documents no timeout of its own, so this is the only deadline a
 * request has.
 */
const REQUEST_TIMEOUT_MS = 60_000;

export type SatisMeterQueryValue = string | number | boolean | undefined;

export type SatisMeterQuery = Record<string, SatisMeterQueryValue>;

/** One error body entry. Only `title` is read, which is all the API documents. */
type ErrorEntry = { title?: string };

/**
 * Reads the `title` out of `{ errors: [{ title }] }`. The API sends no code and
 * no numeric status inside the body, so this string is the only detail there is.
 */
// unknown: the body came off the wire and has not been validated; each read
// below narrows the one field it needs.
function errorTitle(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null || !('errors' in body)) {
		return undefined;
	}
	const errors = (body as { errors?: ErrorEntry[] }).errors;
	if (!Array.isArray(errors)) return undefined;
	const titles = errors
		.map((entry) =>
			typeof entry?.title === 'string' ? entry.title : undefined,
		)
		.filter((title): title is string => typeof title === 'string');
	return titles.length > 0 ? titles.join('; ') : undefined;
}

function retryAfterMs(value: string | null): number | undefined {
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const at = Date.parse(value);
	return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
}

export type SatisMeterErrorOptions = {
	status?: number;
	title?: string;
	retryAfter?: number;
	/** The HTTP method of the failed request, so a write is never replayed. */
	method?: string;
	/** True when the request never reached SatisMeter. */
	transport?: boolean;
	/** True when the transport gave up on its own deadline. */
	timedOut?: boolean;
	/**
	 * True when the answer's headers arrived but its body could not be read: the
	 * request ran, so this is never a transport failure.
	 */
	bodyReadFailed?: boolean;
	cause?: Error;
};

/**
 * One error for the API's `{ errors: [{ title }] }` envelope and for transport
 * failures.
 *
 * SatisMeter looks the project or survey up *before* it checks the key, so a
 * read that fails auth answers **404 "Project not found"**, not 403. There is no
 * field in that response that separates "wrong key" from "wrong project id", so
 * nothing here pretends to: `isResourceNotFound` reports what the API said, and
 * `title` carries the sentence a caller needs to read.
 */
export class SatisMeterAPIError extends Error {
	readonly status?: number;
	/** The API's own sentence, e.g. `Project not found` or `Not authorized`. */
	readonly title?: string;
	readonly retryAfter?: number;
	readonly method?: string;
	readonly isTransport: boolean;
	readonly isTimeout: boolean;
	/** True when the request ran but its answer could not be read. */
	readonly isBodyReadFailure: boolean;

	constructor(message: string, options: SatisMeterErrorOptions = {}) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SatisMeterAPIError';
		this.status = options.status;
		this.title = options.title;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.isTransport = options.transport === true;
		this.isTimeout = options.timedOut === true;
		this.isBodyReadFailure = options.bodyReadFailed === true;
	}

	/** 403 with `Not authorized` or `Forbidden`: the key itself was refused. */
	get isAuthError(): boolean {
		return (
			this.status === 403 &&
			(this.title === 'Not authorized' || this.title === 'Forbidden')
		);
	}

	/**
	 * 400 `No write key`: no usable credential reached the users API at all.
	 * Distinct from a wrong key, which is a 403.
	 */
	get isMissingWriteKey(): boolean {
		return this.status === 400 && this.title === 'No write key';
	}

	/** 404 for a project, survey or user that the account cannot see. */
	get isResourceNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A replay is only safe for a GET. Tracking the same event twice counts twice
	 * and upserting a user twice re-applies traits, so a 5xx on a write must not
	 * be retried: the write may have landed.
	 */
	get isReplayable(): boolean {
		return this.method === 'GET';
	}
}

export function isReplayable(error: Error): boolean {
	return error instanceof SatisMeterAPIError && error.isReplayable;
}

function buildUrl(
	base: string,
	path: string,
	query: SatisMeterQuery | undefined,
): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value === undefined) continue;
		params.append(key, String(value));
	}
	const qs = params.toString();
	return `${base}${path}${qs ? `?${qs}` : ''}`;
}

/**
 * Parses a JSON answer. A body that is not JSON means the route answered with
 * something else (a proxy's HTML error page, an empty 200), so this throws
 * rather than handing an endpoint's schema an unusable value.
 *
 * unknown: JSON has no static type until an output schema parses it, and every
 * caller hands the result to one.
 */
export function parseJsonBody(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		// The body stays out of the message: a cut-off users.list answer starts
		// with a user's email, and callers log error messages.
		throw new SatisMeterAPIError(
			`SatisMeter answered with a non-JSON body (${text.length} characters)`,
		);
	}
}

/** True for a 204 or an empty 200, where there is no body to parse. */
export function isEmptyBody(text: string): boolean {
	return text.trim().length === 0;
}

export type SatisMeterRequest = {
	base: string;
	path: string;
	method: 'GET' | 'POST' | 'DELETE';
	query?: SatisMeterQuery;
	// unknown: each endpoint's own input schema validated the fields, and the
	// provider's write bodies are open maps (traits), so no narrower shared type
	// fits every caller.
	body?: unknown;
};

/**
 * Sends one request and returns the raw text, so each endpoint decides whether
 * it expects JSON or a bodyless success.
 *
 * Both the `fetch` call and the body read are normalised into
 * `SatisMeterAPIError`, so a dropped connection on a 5xx cannot escape as a raw
 * error that `SERVER_ERROR` never matches.
 */
export async function makeSatisMeterRequest(
	apiKey: string,
	{ base, path, method, query, body }: SatisMeterRequest,
): Promise<string> {
	const headers = new Headers({ Accept: 'application/json' });
	headers.set('Authorization', `Bearer ${apiKey}`);
	if (body !== undefined) headers.set('Content-Type', 'application/json');

	let response: Response;
	try {
		response = await fetch(buildUrl(base, path, query), {
			method,
			headers,
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		const name = error instanceof Error ? error.name : '';
		const timedOut = name === 'TimeoutError' || name === 'AbortError';
		const reason = error instanceof Error ? error.message : 'unknown failure';
		throw new SatisMeterAPIError(
			timedOut
				? `SatisMeter did not answer within ${REQUEST_TIMEOUT_MS / 1000} seconds`
				: `SatisMeter request failed before a response: ${reason}`,
			{
				transport: true,
				timedOut,
				method,
				cause: error instanceof Error ? error : undefined,
			},
		);
	}

	let text: string;
	try {
		text = await response.text();
	} catch (error) {
		// Headers arrived, so SatisMeter already handled the request and this is
		// not a transport failure: claiming it was would let a write be replayed
		// on a request that landed. A read still cannot confirm what came back,
		// so it is reported as a body-read failure and left to the caller.
		const timedOut =
			error instanceof Error &&
			(error.name === 'TimeoutError' || error.name === 'AbortError');
		throw new SatisMeterAPIError(
			'the response body could not be read after the headers arrived, so the request ran',
			{
				bodyReadFailed: true,
				timedOut,
				method,
				cause: error instanceof Error ? error : undefined,
			},
		);
	}

	if (!response.ok) {
		const title =
			text.trim().length > 0 ? errorTitle(parseJsonSoft(text)) : undefined;
		throw new SatisMeterAPIError(
			`SatisMeter ${response.status}${title ? `: ${title}` : ''}`,
			{
				status: response.status,
				title,
				retryAfter: retryAfterMs(response.headers.get('Retry-After')),
				method,
			},
		);
	}

	return text;
}

/**
 * Parses JSON when the body is JSON. A non-JSON body carries no `title` to read,
 * so the status alone is what the error then reports.
 */
// unknown: a non-JSON error body has no shape to type, and the only question
// asked of it is whether it parsed at all.
function parseJsonSoft(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}
