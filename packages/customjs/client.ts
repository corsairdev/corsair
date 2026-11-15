/**
 * CustomJS ships two HTTP hosts. Rendering and code execution live on
 * `e.customjs.io`; hosted HTML pages live on `api.app.customjs.io`. Auth is the
 * key in an `x-api-key` header on both, verified against the live API.
 *
 * Everything here uses `fetch` rather than `corsair/http` because three of the
 * routes answer with a PDF or PNG. `corsair/http` reads any non-JSON body as
 * text, which corrupts the bytes.
 */
export const CUSTOMJS_RENDER_HOST = 'https://e.customjs.io';
export const CUSTOMJS_PAGES_HOST = 'https://api.app.customjs.io';

/** A Chromium render of a long page takes seconds, not milliseconds. */
const RENDER_TIMEOUT_MS = 120_000;
/**
 * The AI scraper drives a browser through up to `maxSteps` actions before it
 * answers, so it needs longer than a single render.
 */
export const SCRAPE_TIMEOUT_MS = 180_000;
const PAGES_TIMEOUT_MS = 30_000;

/**
 * CustomJS answers errors in five shapes, all verified against the live API:
 *
 * - `{ error: { message: 'Api Key is invalid' } }` on the render host
 * - `{ error: 'Invalid API Key' }` and `{ error: 'Page not found' }` on the pages host
 * - `{ message: 'Too Many Requests' }` and `{ message: 'Forbidden' }` on the pages host
 * - `{ error: 'Error: …' }` as text/plain when a script or template throws
 * - `{}` with a 500 when a route does not exist
 *
 * A 403 carries two unrelated meanings, so the body decides which one it is: the
 * key is wrong, or the account is out of requests for the window.
 */
export class CustomjsAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a `Retry-After` header, when CustomJS sent one. */
	readonly retryAfter?: number;
	readonly method: string;
	/** The provider's own message, when the body carried one. */
	readonly providerMessage?: string;
	/**
	 * True when replaying the same request cannot leave anything behind. Set by
	 * each endpoint rather than guessed from the method: every CustomJS call is a
	 * POST, and a render is safe to repeat while creating a page is not.
	 */
	readonly replayable: boolean;
	/** True for a 403 whose body says the key is bad, and for any 401. */
	readonly isAuthError: boolean;
	/** True for a 429, and for the 403 CustomJS uses for an exhausted window. */
	readonly isRateLimit: boolean;
	/** A connection that never reached CustomJS: reset, DNS failure, timeout. */
	readonly isTransportError: boolean;

	constructor(
		message: string,
		options: {
			method: string;
			replayable: boolean;
			status?: number;
			retryAfter?: number;
			providerMessage?: string;
			/**
			 * Marks the failure as a bad key whatever the status. The key lookup
			 * answers an unknown key with a 404, not a 401 or 403.
			 */
			authFailure?: boolean;
			cause?: Error;
		},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'CustomjsAPIError';
		this.method = options.method;
		this.replayable = options.replayable;
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.providerMessage = options.providerMessage;
		this.isTransportError = options.status === undefined;
		const text = options.providerMessage ?? '';
		// The body is read only on a 403, the one status CustomJS overloads. A 5xx
		// whose text mentions a rate limit (a script that threw one, say) is a
		// server failure: matching it here would retry a non-replayable call.
		this.isRateLimit =
			options.status === 429 ||
			(options.status === 403 && /too many requests|rate limit/i.test(text));
		this.isAuthError =
			options.authFailure === true ||
			options.status === 401 ||
			(options.status === 403 && !this.isRateLimit);
	}
}

// An error body is untyped until it is narrowed here. A body typed `text/plain`
// still has to be tried as JSON: a script that throws answers
// `{"error":"Error: …"}` with that content type.
function providerMessageFrom(
	body: unknown, // unknown: one of the five error shapes, narrowed below
): string | undefined {
	if (typeof body === 'string') {
		const parsed = tryParseJson(body);
		if (parsed !== undefined) return providerMessageFrom(parsed);
		const text = stripErrorPrefix(body);
		return text.length > 0 ? text : undefined;
	}
	if (!body || typeof body !== 'object') return undefined;
	const record = body as Record<
		string,
		unknown // unknown: the provider's own error keys, read one at a time
	>;
	const nested = record.error;
	if (typeof nested === 'string') {
		const text = stripErrorPrefix(nested);
		return text.length > 0 ? text : undefined;
	}
	if (nested && typeof nested === 'object') {
		const message = (nested as Record<string, string | undefined>).message;
		if (typeof message === 'string' && message.length > 0) return message;
	}
	const message = record.message;
	return typeof message === 'string' && message.length > 0
		? message
		: undefined;
}

/** Script and template failures arrive as `Error: …`. The prefix adds nothing. */
function stripErrorPrefix(text: string): string {
	return text.replace(/^Error:\s*/, '').trim();
}

/**
 * `JSON.parse` is typed as returning `any`. The two prefix checks mean only an
 * object or an array reaches the parse, so `object` is the honest type here.
 */
function tryParseJson(text: string): object | undefined {
	const trimmed = text.trim();
	if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return undefined;
	try {
		const parsed: object = JSON.parse(trimmed);
		return parsed;
	} catch {
		return undefined;
	}
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('retry-after');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

export type CustomjsRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	/** Each caller passes a body its own input schema has already validated. */
	body?: unknown; // unknown: validated per operation, then serialised as JSON
	/** Whether a replay is harmless. See `CustomjsAPIError.replayable`. */
	replayable: boolean;
	timeoutMs?: number;
};

export type CustomjsBinary = {
	/** The bytes, base64 encoded. */
	base64: string;
	contentType: string;
	byteLength: number;
};

/**
 * Sends one request and returns the raw `Response`. Both the `fetch` call and
 * the body read of a failure are normalised here, so a dropped connection on a
 * 5xx becomes a `CustomjsAPIError` the retry handlers can see instead of a bare
 * `TypeError` that `SERVER_ERROR` never matches.
 */
async function send(
	apiKey: string,
	request: CustomjsRequest,
): Promise<Response> {
	const headers: Record<string, string> = {
		'x-api-key': apiKey,
		// CustomJS uses this for per-integration usage stats. Optional, and a
		// request without it succeeds.
		'customjs-origin': 'corsair',
	};
	const init: RequestInit = {
		method: request.method,
		headers,
		signal: AbortSignal.timeout(request.timeoutMs ?? RENDER_TIMEOUT_MS),
	};
	if (request.body !== undefined) {
		headers['Content-Type'] = 'application/json';
		init.body = JSON.stringify(request.body);
	}

	let res: Response;
	try {
		res = await fetch(`${CUSTOMJS_RENDER_HOST}${request.path}`, init);
	} catch (error) {
		throw transportError(error, request);
	}

	if (!res.ok) throw await errorFromResponse(res, request);
	return res;
}

/** The same call against the pages host. */
async function sendToPages(
	apiKey: string,
	request: CustomjsRequest,
): Promise<Response> {
	const init: RequestInit = {
		method: request.method,
		headers: {
			'x-api-key': apiKey,
			'customjs-origin': 'corsair',
		},
		signal: AbortSignal.timeout(request.timeoutMs ?? PAGES_TIMEOUT_MS),
	};
	if (request.body !== undefined) {
		(init.headers as Record<string, string>)['Content-Type'] =
			'application/json';
		init.body = JSON.stringify(request.body);
	}

	let res: Response;
	try {
		res = await fetch(`${CUSTOMJS_PAGES_HOST}${request.path}`, init);
	} catch (error) {
		throw transportError(error, {
			...request,
			timeoutMs: request.timeoutMs ?? PAGES_TIMEOUT_MS,
		});
	}

	if (!res.ok) throw await errorFromResponse(res, request);
	return res;
}

function transportError(
	error: unknown, // unknown: fetch rejects with any value, so it has no static type
	request: CustomjsRequest,
) {
	const name = error instanceof Error ? error.name : '';
	const text =
		name === 'TimeoutError' || name === 'AbortError'
			? `CustomJS request timed out after ${(request.timeoutMs ?? RENDER_TIMEOUT_MS) / 1000}s`
			: error instanceof Error
				? error.message
				: 'CustomJS request failed';
	return new CustomjsAPIError(text, {
		method: request.method,
		replayable: request.replayable,
		cause: error instanceof Error ? error : undefined,
	});
}

async function errorFromResponse(
	res: Response,
	request: CustomjsRequest,
): Promise<CustomjsAPIError> {
	let providerMessage: string | undefined;
	try {
		const contentType = res.headers.get('content-type') ?? '';
		if (contentType.includes('json')) {
			providerMessage = providerMessageFrom(await res.json());
		} else {
			providerMessage = providerMessageFrom(await res.text());
		}
	} catch {
		// A body that cannot be read still leaves the status, which is enough to
		// classify the failure.
		providerMessage = undefined;
	}

	const label = providerMessage ?? res.statusText ?? 'request failed';
	return new CustomjsAPIError(`CustomJS ${res.status}: ${label}`, {
		method: request.method,
		replayable: request.replayable,
		status: res.status,
		retryAfter: retryAfterMs(res),
		providerMessage,
	});
}

/**
 * Reads a successful response body, normalising a dropped connection the same
 * way `send` does. A 200 whose body is cut off mid-transfer rejects from
 * `text()`/`arrayBuffer()`/`json()` with a native error, which no retry handler
 * matches; wrapping it here is what lets the transport handlers see it, and
 * `replayable` decides whether a retry is allowed.
 */
async function readBody<T>(
	res: Response,
	request: CustomjsRequest,
	read: (res: Response) => Promise<T>,
): Promise<T> {
	try {
		return await read(res);
	} catch (error) {
		throw transportError(error, request);
	}
}

/** For JSON routes: a 2xx body that is not JSON is a failure, not an empty result. */
export async function makeCustomjsJsonRequest<T>(
	apiKey: string,
	request: CustomjsRequest,
	options: { host?: 'render' | 'pages' } = {},
): Promise<T> {
	const res =
		options.host === 'pages'
			? await sendToPages(apiKey, request)
			: await send(apiKey, request);
	// A body read that times out reports the budget of the host it waited on.
	const effective =
		options.host === 'pages'
			? { ...request, timeoutMs: request.timeoutMs ?? PAGES_TIMEOUT_MS }
			: request;
	const text = await readBody(res, effective, (r) => r.text());
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new CustomjsAPIError(
			`CustomJS answered ${res.status} with a non-JSON body`,
			{
				method: request.method,
				replayable: request.replayable,
				status: res.status,
			},
		);
	}
}

/** For routes that answer inline JavaScript output as text. */
export async function makeCustomjsTextRequest(
	apiKey: string,
	request: CustomjsRequest,
): Promise<string> {
	const res = await send(apiKey, request);
	return readBody(res, request, (r) => r.text());
}

/** For the render routes, which answer with the bytes of a PDF or PNG. */
export async function makeCustomjsBinaryRequest(
	apiKey: string,
	request: CustomjsRequest,
): Promise<CustomjsBinary> {
	const res = await send(apiKey, request);
	// The content type comes from the headers, which arrived before the body, so
	// it survives a body failure.
	const contentType =
		res.headers.get('content-type') ?? 'application/octet-stream';
	const bytes = Buffer.from(
		await readBody(res, request, async (r) =>
			Buffer.from(await r.arrayBuffer()),
		),
	);
	if (bytes.length === 0) {
		// CustomJS can answer 200 with an empty body when rendering fails. An
		// empty file looks like a successful render to the caller.
		throw new CustomjsAPIError('CustomJS returned an empty file', {
			method: request.method,
			replayable: request.replayable,
			status: res.status,
		});
	}
	return {
		base64: bytes.toString('base64'),
		contentType,
		byteLength: bytes.length,
	};
}
