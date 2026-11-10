/**
 * ScrapingAnt REST client.
 *
 * This uses `fetch` directly rather than `corsair/http`, for one documented
 * reason: the scrape answer's real result is carried in response *headers*
 * (`Ant-page-status-code`) and its cost in `Ant-credits-cost`, and
 * `corsair/http` returns `responseHeader ?? responseBody`, so reading a header
 * there discards the body (the HTML or JSON the caller asked for). The
 * transport also parses `application/json` with `response.json()`, which loses
 * the raw text of a page.
 *
 * Reference: https://docs.scrapingant.com/request-response-format and
 * https://docs.scrapingant.com/errors
 */

export const SCRAPINGANT_API_BASE = 'https://api.scrapingant.com';

/**
 * The API's own `timeout` parameter allows up to 60 seconds for one scrape, so
 * a client timeout shorter than that aborts a request the provider is still
 * working on: the caller gets a transport failure for a scrape that may have
 * been charged, and the retry pays for it twice.
 */
const REQUEST_TIMEOUT_MS = 120_000;

export type ScrapingAntQueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| undefined;

export type ScrapingAntQuery = Record<string, ScrapingAntQueryValue>;

/** One scrape answer, before the endpoint's own schema parses it. */
export type ScrapingAntRawResponse = {
	/** The body exactly as sent: HTML for `scrape.html`, JSON for the rest. */
	body: string;
	/** Credits the request spent, from `Ant-credits-cost`. */
	creditsCost?: number;
	/** The target page's status, from `Ant-page-status-code`. */
	pageStatus?: number;
};

/** Exact `detail` strings ScrapingAnt sends, from https://docs.scrapingant.com/errors */
const DETAIL_QUOTA =
	'Requests quota limit reached. Please visit https://app.scrapingant.com/subscriptions to upgrade your plan and get more requests';
const DETAIL_IP_BLOCKED =
	'Access denied from this IP address. Please visit https://app.scrapingant.com/whitelist to manage your IP whitelist settings';
const DETAIL_CONCURRENCY =
	'Free user concurrency limit reached. Please visit https://app.scrapingant.com/subscriptions to upgrade your plan and get more requests';

/**
 * One entry of FastAPI's validation detail, read without trusting the rest of
 * the entry: the shape is `{ loc, msg, type }` but only `msg` is read here.
 */
type ValidationDetailEntry = { msg?: string };

/**
 * ScrapingAnt's error bodies are `{ detail }`, but a 422 from its own request
 * validation answers FastAPI's shape, where `detail` is an array of
 * `{ loc, msg, type }`. Both were observed: an unauthenticated call returns the
 * string form, and the published `HTTPValidationError` schema documents the
 * array form.
 */
function detailText(body: string): string | undefined {
	// unknown: the body came off the wire and has not been validated yet; every
	// read below narrows what it needs.
	let parsed: unknown;
	try {
		parsed = JSON.parse(body);
	} catch {
		return undefined;
	}
	if (typeof parsed !== 'object' || parsed === null || !('detail' in parsed)) {
		return undefined;
	}
	const detail = parsed.detail;
	if (typeof detail === 'string') return detail.length > 0 ? detail : undefined;
	if (!Array.isArray(detail)) return undefined;
	const messages = detail
		.map((entry: ValidationDetailEntry | undefined) =>
			typeof entry?.msg === 'string' ? entry.msg : undefined,
		)
		.filter((msg): msg is string => typeof msg === 'string');
	return messages.length > 0 ? messages.join('; ') : undefined;
}

function parseNumberHeader(value: string | null): number | undefined {
	if (value === null) return undefined;
	const parsed = Number.parseInt(value, 10);
	return Number.isNaN(parsed) ? undefined : parsed;
}

/** `Retry-After` in milliseconds, from either documented form. */
function retryAfterMs(value: string | null): number | undefined {
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const at = Date.parse(value);
	return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
}

export type ScrapingAntErrorOptions = {
	status?: number;
	detail?: string;
	retryAfter?: number;
	/** True when the request never reached ScrapingAnt. */
	transport?: boolean;
	/** True when the transport gave up on its own deadline. */
	timedOut?: boolean;
	/** The target page's status, when the outer response carried one. */
	pageStatus?: number;
	cause?: Error;
};

/**
 * One error for both layers: ScrapingAnt's own failures (403, 422, 500) and
 * transport failures (reset, DNS, timeout).
 *
 * The three readings of a 403 are exposed separately because the status alone
 * cannot tell them apart, and sending a caller to re-enter a working key when
 * the account is simply out of credits wastes a round.
 */
export class ScrapingAntAPIError extends Error {
	readonly status?: number;
	readonly detail?: string;
	/** Milliseconds from a `Retry-After` header, when one came back. */
	readonly retryAfter?: number;
	/** True when the request never reached ScrapingAnt, so a replay is safe. */
	readonly isTransport: boolean;
	/** True when the transport hit its own deadline. */
	readonly isTimeout: boolean;
	readonly pageStatus?: number;

	constructor(message: string, options: ScrapingAntErrorOptions = {}) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ScrapingAntAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.retryAfter = options.retryAfter;
		this.isTransport = options.transport === true;
		this.isTimeout = options.timedOut === true;
		this.pageStatus = options.pageStatus;
	}

	/** 403 "API token is wrong" — the key itself. */
	get isAuthError(): boolean {
		return this.status === 403 && /API token is wrong/i.test(this.detail ?? '');
	}

	/** 403 "Requests quota limit reached" — out of credits, which no retry fixes. */
	get isQuotaExhausted(): boolean {
		return this.status === 403 && this.detail === DETAIL_QUOTA;
	}

	/** 403 "Access denied from this IP address" — the account's IP allowlist. */
	get isIpBlocked(): boolean {
		return this.status === 403 && this.detail === DETAIL_IP_BLOCKED;
	}

	/**
	 * 409 on a free plan: one request at a time. The message is the same for
	 * every concurrency conflict, so the detail check keeps a paid plan's 409
	 * from being retried as though it were a queue.
	 */
	get isConcurrencyLimit(): boolean {
		return this.status === 409 && this.detail === DETAIL_CONCURRENCY;
	}

	/** 404 "This site can't be reached" — the target, not the route. */
	get isTargetUnreachable(): boolean {
		return (
			this.status === 404 &&
			/This site can't be reached/i.test(this.detail ?? '')
		);
	}

	/** 423 — the target detected the browser. */
	get isBotDetected(): boolean {
		return this.status === 423;
	}
}

function buildUrl(path: string, query: ScrapingAntQuery | undefined): string {
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
	return `${SCRAPINGANT_API_BASE}${path}${qs ? `?${qs}` : ''}`;
}

/**
 * Reads the answer as text, whatever its `Content-Type` says. `scrape.html`
 * returns raw HTML while the published spec labels that body
 * `application/json`, so a transport that trusted the content type would hand
 * back a parse failure instead of the page.
 */
async function readRaw(
	response: Response,
	transportMessage: string,
): Promise<ScrapingAntRawResponse> {
	let body: string;
	try {
		body = await response.text();
	} catch (error) {
		throw new ScrapingAntAPIError(
			`${transportMessage}: the response body could not be read`,
			{
				transport: true,
				cause: error instanceof Error ? error : undefined,
			},
		);
	}

	const pageStatus = parseNumberHeader(
		response.headers.get('Ant-page-status-code'),
	);
	const creditsCost = parseNumberHeader(
		response.headers.get('Ant-credits-cost'),
	);

	if (!response.ok) {
		const detail = detailText(body);
		throw new ScrapingAntAPIError(
			`ScrapingAnt ${response.status}${detail ? `: ${detail}` : ''}`,
			{
				status: response.status,
				detail,
				retryAfter: retryAfterMs(response.headers.get('Retry-After')),
				pageStatus,
			},
		);
	}

	return { body, pageStatus, creditsCost };
}

/**
 * Sends one request. `antHeaders` are forwarded to the target page; ScrapingAnt
 * trims the `Ant-` prefix before the target sees them.
 *
 * Both the `fetch` call and the body read are normalised into
 * `ScrapingAntAPIError`, so a dropped connection on a 5xx cannot escape as a
 * raw error that `SERVER_ERROR` never matches.
 *
 * Every request here is a GET, so replaying one cannot repeat a target-side
 * effect: the worst a replay does is pay for the same scrape twice. That is why
 * no per-request idempotency flag exists, and why the 500 and 423 handlers are
 * allowed to retry unconditionally.
 */
export async function makeScrapingAntRequest(
	apiKey: string,
	path: string,
	options: {
		query?: ScrapingAntQuery;
		antHeaders?: Record<string, string>;
	} = {},
): Promise<ScrapingAntRawResponse> {
	const headers = new Headers({ Accept: 'text/html,application/json' });
	headers.set('x-api-key', apiKey);
	for (const [name, value] of Object.entries(options.antHeaders ?? {})) {
		headers.set(`Ant-${name}`, value);
	}

	let response: Response;
	try {
		response = await fetch(buildUrl(path, options.query), {
			method: 'GET',
			headers,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		const name = error instanceof Error ? error.name : '';
		const timedOut = name === 'TimeoutError' || name === 'AbortError';
		const reason = error instanceof Error ? error.message : 'unknown failure';
		throw new ScrapingAntAPIError(
			timedOut
				? `ScrapingAnt did not answer within ${REQUEST_TIMEOUT_MS / 1000} seconds`
				: `ScrapingAnt request failed before a response: ${reason}`,
			{
				transport: true,
				timedOut,
				cause: error instanceof Error ? error : undefined,
			},
		);
	}

	return readRaw(response, 'ScrapingAnt response failed');
}

/**
 * Parses a JSON answer. A body that is not JSON means the route answered with
 * something else (an HTML error page from a proxy, an empty 200), so this
 * throws rather than handing the endpoint's schema an unusable value.
 *
 * unknown: JSON has no static type until an output schema parses it, and every
 * caller hands the result straight to one. The live smoke test parses through
 * `Outputs.*` for exactly that reason.
 */
export function parseJsonBody(raw: ScrapingAntRawResponse): unknown {
	try {
		return JSON.parse(raw.body);
	} catch {
		throw new ScrapingAntAPIError(
			`ScrapingAnt answered with a non-JSON body: ${raw.body.slice(0, 120)}`,
			{ status: undefined },
		);
	}
}

/**
 * Parses a JSON answer that has to be an object. An array or a bare scalar is
 * not an envelope, so it throws here with the body quoted rather than failing
 * later as a missing field.
 */
// unknown: JSON gives no per-key types, and each endpoint's output schema is
// what types them; the record shape is all that can be known before that parse.
export function parseJsonObject(
	raw: ScrapingAntRawResponse,
): Record<string, unknown> {
	const parsed = parseJsonBody(raw);
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
		throw new ScrapingAntAPIError(
			`ScrapingAnt answered with JSON that is not an object: ${raw.body.slice(0, 120)}`,
		);
	}
	return parsed as Record<string, unknown>;
}
