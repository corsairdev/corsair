/**
 * Scrape.do client.
 *
 * Scrape.do is three surfaces with three auth styles and three error shapes,
 * all confirmed against the live API:
 *
 * 1. **Scrape** — `https://api.scrape.do/?token=…&url=…`. The token rides in the
 *    query string. A success is the target page itself, whatever its content
 *    type, so the body is read as text.
 * 2. **Async jobs** — `https://q.scrape.do/api/v1`, authenticated with an
 *    `X-Token` header. Answers JSON.
 * 3. **Account info** — `https://api.scrape.do/info?token=…`. This one is the
 *    trap: a bad token answers **HTTP 200** with `IsActive: false` and zeros,
 *    not an error status, so a status check alone cannot tell a live account
 *    from a rejected key. See `parseAccountInfo`.
 *
 * Two error envelopes exist and they differ in case:
 * - scrape: `{ URL, StatusCode, Message: string[], PossibleCauses, Contact }`
 * - `/info` and async: `{ message }` or `{ Error, Code }`
 *
 * Docs: https://scrape.do/documentation/
 */

export const SCRAPEDO_API_BASE = 'https://api.scrape.do';
export const SCRAPEDO_ASYNC_BASE = 'https://q.scrape.do/api/v1';

/**
 * Scrape.do's own `timeout` parameter allows up to 120 seconds and its retry
 * mechanism can add more, so a shorter client deadline would abort a request
 * that is still running — and a successful request is the one that is billed.
 */
const REQUEST_TIMEOUT_MS = 150_000;

export type ScrapeDoQueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| undefined;

export type ScrapeDoQuery = Record<string, ScrapeDoQueryValue>;

export type ScrapeDoRawResponse = {
	/** The body exactly as sent: the target page, JSON, or a screenshot. */
	body: string;
	status: number;
	/** The target page's content type, from the response. */
	contentType?: string;
};

/** One error entry from the scrape envelope's `Message` array. */
type ScrapeErrorBody = {
	URL?: string;
	StatusCode?: number;
	Message?: string[];
	PossibleCauses?: string[];
};

function retryAfterMs(value: string | null): number | undefined {
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const at = Date.parse(value);
	return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
}

/**
 * Reads the message out of either envelope. The scrape envelope lists its
 * messages in a `Message` array; `/info` and the async API use a lowercase
 * `message` string or `{ Error }`. Both are checked because one client serves
 * all three surfaces.
 */
// unknown: the body came off the wire and has not been validated; each branch
// below narrows the one field it reads.
export function errorMessage(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null) return undefined;
	const record = body as ScrapeErrorBody & {
		message?: string;
		Error?: string;
	};
	if (Array.isArray(record.Message) && record.Message.length > 0) {
		return record.Message.filter((m) => typeof m === 'string').join('; ');
	}
	if (typeof record.message === 'string' && record.message.length > 0) {
		return record.message;
	}
	if (typeof record.Error === 'string' && record.Error.length > 0) {
		return record.Error;
	}
	return undefined;
}

export type ScrapeDoErrorOptions = {
	status?: number;
	message?: string;
	/** `PossibleCauses` from the scrape envelope, when one was sent. */
	causes?: string[];
	retryAfter?: number;
	/** The HTTP method of the failed request, so a write is never replayed. */
	method?: string;
	/** True when the request never reached Scrape.do. */
	transport?: boolean;
	/** True when the transport gave up on its own deadline. */
	timedOut?: boolean;
	cause?: Error;
};

/**
 * One error for all three surfaces.
 *
 * Scrape.do documents one status that means two unrelated things: **400 is both
 * "bad request for Scrape.do"** (no message consumed) **and "bad request for the
 * target website"** (a credit is consumed). The body is the only way to tell
 * them apart, and `isTargetRejection` reports which this was so a caller does
 * not retry a parameter mistake or skip retrying a target the site refused.
 */
export class ScrapeDoAPIError extends Error {
	readonly status?: number;
	/** The provider's own sentence, from `Message`, `message` or `Error`. */
	readonly detail?: string;
	/** `PossibleCauses` from the scrape envelope, when it was sent. */
	readonly causes: string[];
	readonly retryAfter?: number;
	readonly method?: string;
	readonly isTransport: boolean;
	readonly isTimeout: boolean;

	constructor(message: string, options: ScrapeDoErrorOptions = {}) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ScrapeDoAPIError';
		this.status = options.status;
		this.detail = options.message;
		this.causes = options.causes ?? [];
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.isTransport = options.transport === true;
		this.isTimeout = options.timedOut === true;
	}

	/** 401: the token is inactive or the subscription is suspended. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/**
	 * 429: the account's concurrency limit. The docs call this "sending requests
	 * too quickly" and say a credit is not consumed, so the documented fix is to
	 * wait and send the same request again.
	 */
	get isConcurrencyLimit(): boolean {
		return this.status === 429;
	}

	/**
	 * 400 carrying `PossibleCauses`: the target site answered with a bad request,
	 * which does consume a credit. A 400 without them is Scrape.do rejecting the
	 * request itself (a bad parameter, a missing token), which does not.
	 */
	get isTargetRejection(): boolean {
		return this.status === 400 && this.causes.length > 0;
	}

	/** 502: Scrape.do says the request failed and asks for a retry. */
	get isRetryableServerError(): boolean {
		return this.status === 502 || (this.status ?? 0) >= 500;
	}

	/**
	 * 510: the caller's own HTTP client cancelled the request. No credit is
	 * consumed and there is nothing to retry.
	 */
	get isClientCancelled(): boolean {
		return this.status === 510;
	}

	/**
	 * A replay is only safe for a GET. A POST through the proxy forwards its body
	 * to the target site, so a 5xx may mean the write landed.
	 */
	get isReplayable(): boolean {
		return this.method === 'GET';
	}
}

export function isReplayable(error: Error): boolean {
	return error instanceof ScrapeDoAPIError && error.isReplayable;
}

function buildUrl(
	base: string,
	path: string,
	query: ScrapeDoQuery | undefined,
): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) params.append(key, String(item));
			continue;
		}
		params.append(key, String(value));
	}
	const qs = params.toString();
	return `${base}${path}${qs ? `?${qs}` : ''}`;
}

/**
 * Parses JSON when the body is JSON. A non-JSON body on an error carries no
 * message to read, so the status alone is what the error then reports.
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

/**
 * Parses a JSON object answer. The async API and the JSON scrape mode both send
 * a flat object whose fields are renamed one at a time by the endpoint, so this
 * is the one place that states why the shape cannot be typed before the output
 * schema runs: the provider's field names are PascalCase and the plugin's are
 * not, and only the schema knows the target shape.
 *
 * unknown: JSON gives no per-key types, and each caller renames the fields it
 * needs into the shape its own output schema validates.
 */
export function parseJsonObject(text: string): Record<string, unknown> {
	const parsed = parseJsonBody(text);
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
		throw new ScrapeDoAPIError(
			`Scrape.do answered with a body that is not an object: ${text.slice(0, 120)}`,
		);
	}
	// unknown: the guard above proved it is a non-array object; its keys stay
	// untyped because the provider's PascalCase names are renamed by each caller.
	return parsed as Record<string, unknown>;
}

/** Parses a JSON answer that must be JSON, for the async and info surfaces. */
// unknown: JSON has no static type until an output schema parses it; each
// caller hands the result straight to one.
// unknown: JSON has no static type until an output schema parses it; every
// caller hands the result to one, and `parseJsonObject` narrows when it is an
// object.
// unknown: JSON has no static type until an output schema parses it; every
// caller hands the result to one, and `parseJsonObject` narrows the object case.
export function parseJsonBody(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		throw new ScrapeDoAPIError(
			`Scrape.do answered with a non-JSON body: ${text.slice(0, 120)}`,
		);
	}
}

async function readBody(response: Response, method: string): Promise<string> {
	try {
		return await response.text();
	} catch (error) {
		// Headers arrived, so the request ran and may have been billed. Reporting
		// it as transport would make a caller replay a request that landed.
		throw new ScrapeDoAPIError(
			'the response body could not be read after the headers arrived, so the request ran',
			{
				status: response.status,
				method,
				cause: error instanceof Error ? error : undefined,
			},
		);
	}
}

export type ScrapeDoRequest = {
	/** Which surface: absent means the scrape API. */
	kind: 'scrape' | 'async' | 'info';
	path: string;
	method: 'GET' | 'POST' | 'DELETE';
	query?: ScrapeDoQuery;
	// unknown: each endpoint's own input schema validated the fields, and the
	// job bodies are open PascalCase maps, so no narrower shared type fits.
	body?: unknown;
	/** Extra headers for the scrape passthrough (`extraHeaders` support). */
	headers?: Record<string, string>;
};

function baseFor(kind: ScrapeDoRequest['kind']): string {
	if (kind === 'async') return SCRAPEDO_ASYNC_BASE;
	return SCRAPEDO_API_BASE;
}

/**
 * Sends one request and returns the raw text plus its status.
 *
 * The scrape surface needs the status even on a success: a target that answers
 * 404 still returns its page, and Scrape.do consumes a credit for it, so the
 * status is part of the answer rather than a failure.
 *
 * Auth differs per surface: the scrape API and `/info` take the token in the
 * query, the async API in an `X-Token` header.
 */
export async function makeScrapeDoRequest(
	apiKey: string,
	{ kind, path, method, query, body, headers }: ScrapeDoRequest,
): Promise<ScrapeDoRawResponse> {
	const requestHeaders = new Headers({ Accept: '*/*' });
	if (kind === 'async') {
		requestHeaders.set('X-Token', apiKey);
	}
	if (body !== undefined)
		requestHeaders.set('Content-Type', 'application/json');
	for (const [name, value] of Object.entries(headers ?? {})) {
		requestHeaders.set(name, value);
	}

	// The token travels as a query parameter on the two api.scrape.do surfaces,
	// which is what the provider documents. `ApiError`-style redaction does not
	// exist here, so the token is kept out of every error by construction: no
	// error below carries the URL.
	const fullQuery: ScrapeDoQuery =
		kind === 'async' ? (query ?? {}) : { token: apiKey, ...(query ?? {}) };

	let response: Response;
	try {
		response = await fetch(buildUrl(baseFor(kind), path, fullQuery), {
			method,
			headers: requestHeaders,
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		const name = error instanceof Error ? error.name : '';
		const timedOut = name === 'TimeoutError' || name === 'AbortError';
		const reason = error instanceof Error ? error.message : 'unknown failure';
		throw new ScrapeDoAPIError(
			timedOut
				? `Scrape.do did not answer within ${REQUEST_TIMEOUT_MS / 1000} seconds`
				: `Scrape.do request failed before a response: ${reason}`,
			{
				transport: true,
				timedOut,
				method,
				cause: error instanceof Error ? error : undefined,
			},
		);
	}

	const text = await readBody(response, method);

	// A 404 on the scrape surface is the *target* answering, not Scrape.do: the
	// body is the target's page and a credit was spent. It is returned, not
	// thrown, so the caller sees what the site said.
	const isTargetStatus =
		kind === 'scrape' && (response.status === 404 || response.status === 410);
	if (!response.ok && !isTargetStatus) {
		const parsed = parseJsonSoft(text);
		const causes = readCauses(parsed);
		const message = errorMessage(parsed);
		throw new ScrapeDoAPIError(
			`Scrape.do ${response.status}${message ? `: ${message}` : ''}`,
			{
				status: response.status,
				message,
				causes,
				retryAfter: retryAfterMs(response.headers.get('Retry-After')),
				method,
			},
		);
	}

	return {
		body: text,
		status: response.status,
		contentType: response.headers.get('content-type') ?? undefined,
	};
}

/** `PossibleCauses` from the scrape envelope, which distinguishes a target 400. */
// unknown: the envelope is unvalidated; only this one array is read.
// unknown: the error envelope is unvalidated here; only PossibleCauses is read.
// unknown: the error envelope is unvalidated here; only PossibleCauses is read.
function readCauses(body: unknown): string[] {
	if (typeof body !== 'object' || body === null) return [];
	const causes = (body as ScrapeErrorBody).PossibleCauses;
	if (!Array.isArray(causes)) return [];
	return causes.filter((cause): cause is string => typeof cause === 'string');
}
