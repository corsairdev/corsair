import { ApiError } from 'corsair/http';

/** The one host the API key is ever sent to. */
export const HIGGSFIELD_API_BASE = 'https://api.higgsfield.ai';

const DEFAULT_TIMEOUT_MS = 15_000;

export type HiggsfieldErrorCode =
	| 'invalid_key'
	| 'invalid_input'
	| 'network'
	| 'timeout'
	| 'bad_response'
	| 'not_found'
	| 'upload_failed';

/** A failure that isn't an HTTP answer from the API: bad input, the network, the upload. */
export class HiggsfieldError extends Error {
	/** Set on a failed submit: repeat with this key and no second charge is made. */
	public idempotencyKey?: string;

	constructor(
		message: string,
		public readonly code: HiggsfieldErrorCode,
	) {
		super(message);
		this.name = 'HiggsfieldError';
	}
}

/** An HTTP error answer from the API, with the detail text and correlation id kept. */
export class HiggsfieldAPIError extends ApiError {
	public readonly correlationId?: string;
	/** The `detail.code` of a structured error, for example account_queue_full. */
	public readonly detailCode?: string;
	/** The `detail.retryable` of a structured error. */
	public readonly retryable?: boolean;
	/** Set on a failed submit: repeat with this key and no second charge is made. */
	public idempotencyKey?: string;

	constructor(init: {
		method: 'GET' | 'POST' | 'DELETE';
		path: string;
		status: number;
		statusText: string;
		// unknown: the error body, parsed JSON or plain text.
		body: unknown;
		message: string;
		correlationId?: string;
		retryAfterMs?: number;
		detailCode?: string;
		retryable?: boolean;
	}) {
		super(
			{ method: init.method, url: init.path },
			{
				url: init.path,
				ok: false,
				status: init.status,
				statusText: init.statusText,
				body: init.body,
			},
			init.message,
			{ retryAfter: init.retryAfterMs },
		);
		this.name = 'HiggsfieldAPIError';
		this.correlationId = init.correlationId;
		this.detailCode = init.detailCode;
		this.retryable = init.retryable;
	}
}

// ── Credentials ─────────────────────────────────────────────────────────────

/**
 * `Authorization: Key <id>:<secret>`. A key with no colon is refused here, on
 * the way to every call, and the message never repeats any of it.
 */
export function authorizationHeader(apiKey: string): string {
	const key = apiKey.trim();
	const colon = key.indexOf(':');
	if (colon <= 0 || colon === key.length - 1 || /\s/.test(key)) {
		throw new HiggsfieldError(
			'The stored Higgsfield key is not in the form <key id>:<key secret>. Copy both parts from the API keys page of the Higgsfield Console.',
			'invalid_key',
		);
	}
	return `Key ${key}`;
}

// ── Paths ───────────────────────────────────────────────────────────────────

const MODEL_SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const REQUEST_ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;

// A model path is posted to as given, so it must not be able to name one of the
// API's other routes (cancelling a request, say).
const NON_MODEL_ROUTES = new Set([
	'requests',
	'files',
	'estimate',
	'models',
	'v1',
]);

/** Strips one surrounding slash; null when this cannot be a model path. */
export function normalizeModelPath(modelPath: string): string | null {
	const path = modelPath.trim().replace(/^\/|\/$/g, '');
	const segments = path.split('/');
	if (
		path.length === 0 ||
		path.length > 200 ||
		!segments.every((segment) => MODEL_SEGMENT_RE.test(segment)) ||
		NON_MODEL_ROUTES.has(segments[0] ?? '')
	) {
		return null;
	}
	return path;
}

function requireModelPath(modelPath: string): string {
	const path = normalizeModelPath(modelPath);
	if (!path) {
		throw new HiggsfieldError(
			'modelPath must be a relative model path such as higgsfield-ai/soul/v2/standard: letters, digits, dots, dashes and underscores in slash-separated parts, with no scheme, query or "..". Find paths with models.list.',
			'invalid_input',
		);
	}
	return path;
}

/** The path a generation is submitted to. */
export function submitPath(modelPath: string): string {
	return `/${requireModelPath(modelPath)}`;
}

/** The path a generation is priced at. */
export function estimatePath(modelPath: string): string {
	return `/estimate/${requireModelPath(modelPath)}`;
}

export function isValidRequestId(requestId: string): boolean {
	return REQUEST_ID_RE.test(requestId);
}

/**
 * Built from the request id, not from the status_url or cancel_url a response
 * carries: those are the same paths today, and following a URL out of a
 * response could send the key to another host.
 */
export function requestPath(requestId: string, action?: 'status' | 'cancel') {
	if (!isValidRequestId(requestId)) {
		throw new HiggsfieldError(
			'requestId must be the request_id a submit returned, for example 01a1ba6f-8564-7838-b5fb-1e861bcd22e8.',
			'invalid_input',
		);
	}
	const base = `/requests/${encodeURIComponent(requestId)}`;
	return action ? `${base}/${action}` : base;
}

// ── Transport ───────────────────────────────────────────────────────────────

export type HiggsfieldRequestInit = {
	method?: 'GET' | 'POST' | 'DELETE';
	query?: Record<
		string,
		string | number | boolean | readonly string[] | undefined
	>;
	// unknown: the JSON body is whatever the endpoint takes (each model has its own input); it is only serialised here.
	body?: unknown;
	headers?: Record<string, string | undefined>;
	timeoutMs?: number;
};

// unknown: parsed JSON of any shape, narrowed by the caller.
function parseBody(text: string): unknown {
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

type ErrorDetail = {
	text: string;
	code?: string;
	retryable?: boolean;
	retryAfterSeconds?: number;
};

/** Reads the FastAPI `detail`, which is a string, a validation list or an object. */
// unknown: the error body, parsed JSON or plain text.
export function readErrorDetail(body: unknown): ErrorDetail {
	if (typeof body === 'string') return { text: body.trim() };
	if (!body || typeof body !== 'object') return { text: '' };
	// unknown: `detail` has three shapes; each branch below narrows it.
	const detail = (body as { detail?: unknown }).detail;
	if (typeof detail === 'string') return { text: detail };
	if (Array.isArray(detail)) {
		const parts = detail.map((item) => {
			// unknown: loc mixes field names and list indexes.
			const entry = (item ?? {}) as { loc?: unknown[]; msg?: unknown };
			const loc = Array.isArray(entry.loc) ? entry.loc.join('.') : '';
			const msg = typeof entry.msg === 'string' ? entry.msg : 'invalid';
			return loc ? `${loc}: ${msg}` : msg;
		});
		return { text: parts.join('; ') };
	}
	if (detail && typeof detail === 'object') {
		// unknown: a structured error's fields, each checked before use.
		const entry = detail as Record<string, unknown>;
		const code = typeof entry.code === 'string' ? entry.code : undefined;
		const message = typeof entry.message === 'string' ? entry.message : '';
		return {
			text: [code, message].filter(Boolean).join(': '),
			code,
			retryable:
				typeof entry.retryable === 'boolean' ? entry.retryable : undefined,
			retryAfterSeconds:
				typeof entry.retry_after_seconds === 'number'
					? entry.retry_after_seconds
					: undefined,
		};
	}
	return { text: '' };
}

const STATUS_HINTS: Record<number, string> = {
	401: 'The key was refused: check both parts in the Higgsfield Console.',
	403: 'The account balance is too low for this. Add funds in the Higgsfield Console.',
	409: 'The request is still running. Try again once it has finished.',
	423: 'The model is temporarily blocked. Nothing ran; try later.',
	429: 'Nothing was created.',
	503: 'The model is disabled or not ready, or the queue is briefly unavailable. Nothing ran; try later.',
};

function retryAfterMs(
	header: string | null,
	fromDetail?: number,
): number | undefined {
	if (header) {
		const seconds = Number(header);
		if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
		const date = Date.parse(header);
		if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
	}
	return fromDetail !== undefined ? fromDetail * 1000 : undefined;
}

function toApiError(
	method: 'GET' | 'POST' | 'DELETE',
	path: string,
	response: Response,
	// unknown: the error body, parsed JSON or plain text.
	body: unknown,
): HiggsfieldAPIError {
	const detail = readErrorDetail(body);
	const correlationId = response.headers.get('x-correlation-id') ?? undefined;
	const retryAfter = retryAfterMs(
		response.headers.get('retry-after'),
		detail.retryAfterSeconds,
	);
	const parts = [
		`Higgsfield ${response.status}: ${detail.text || response.statusText || 'request failed'}.`,
		STATUS_HINTS[response.status],
		retryAfter !== undefined
			? `Retry after ${Math.ceil(retryAfter / 1000)} s.`
			: undefined,
		correlationId ? `X-Correlation-ID: ${correlationId}.` : undefined,
	];
	return new HiggsfieldAPIError({
		method,
		path,
		status: response.status,
		statusText: response.statusText,
		body,
		message: parts.filter(Boolean).join(' '),
		correlationId,
		retryAfterMs: retryAfter,
		detailCode: detail.code,
		retryable: detail.retryable,
	});
}

/**
 * Calls the API. A plain fetch rather than `corsair/http`'s `request`, whose
 * errors drop the response headers: support needs X-Correlation-ID, and its
 * fixed status messages would replace Higgsfield's detail text. Redirects are
 * refused so the key cannot follow one, and the transport makes one attempt:
 * retries are error-handlers.ts's call.
 */
export async function makeHiggsfieldRequest<T>(
	apiKey: string,
	path: string,
	init: HiggsfieldRequestInit = {},
): Promise<T> {
	const { method = 'GET', query, body, headers, timeoutMs } = init;
	const authorization = authorizationHeader(apiKey);

	const url = new URL(path, HIGGSFIELD_API_BASE);
	if (url.origin !== HIGGSFIELD_API_BASE) {
		throw new HiggsfieldError(
			'Refusing to send the Higgsfield key to another host.',
			'invalid_input',
		);
	}
	for (const [name, value] of Object.entries(query ?? {})) {
		if (value === undefined) continue;
		for (const item of Array.isArray(value) ? value : [value]) {
			url.searchParams.append(name, String(item));
		}
	}

	const requestHeaders: Record<string, string> = {
		Accept: 'application/json',
		Authorization: authorization,
	};
	for (const [name, value] of Object.entries(headers ?? {})) {
		if (value !== undefined) requestHeaders[name] = value;
	}
	if (body !== undefined) requestHeaders['Content-Type'] = 'application/json';

	// Outside the fetch's try: bad input isn't a network failure, and retrying
	// the same input can't help.
	let serialized: string | undefined;
	try {
		serialized = body !== undefined ? JSON.stringify(body) : undefined;
	} catch {
		throw new HiggsfieldError(
			'The request body could not be serialized as JSON. A BigInt or a circular reference, for example, cannot be sent.',
			'invalid_input',
		);
	}

	let response: Response;
	let text: string;
	try {
		response = await fetch(url, {
			method,
			headers: requestHeaders,
			body: serialized,
			redirect: 'error',
			signal: AbortSignal.timeout(timeoutMs ?? DEFAULT_TIMEOUT_MS),
		});
		text = await response.text();
	} catch (error) {
		const timedOut = error instanceof Error && error.name === 'TimeoutError';
		throw new HiggsfieldError(
			timedOut
				? `Higgsfield did not answer ${method} ${path} in time.`
				: `Could not reach Higgsfield for ${method} ${path}.`,
			timedOut ? 'timeout' : 'network',
		);
	}

	const parsed = parseBody(text);
	if (!response.ok) throw toApiError(method, path, response, parsed);
	return parsed as T;
}

// ── Upload ──────────────────────────────────────────────────────────────────

/**
 * PUTs bytes to the presigned URL files/generate-upload-url returned, with
 * every header it asked for. The URL carries its own signature, so no
 * Higgsfield credentials go with it, and the URL stays out of errors.
 */
export async function putToPresignedUrl(
	uploadUrl: string,
	bytes: Uint8Array,
	headers: Record<string, string>,
): Promise<void> {
	if (!uploadUrl.startsWith('https://')) {
		throw new HiggsfieldError(
			'Higgsfield returned an upload URL that is not https.',
			'upload_failed',
		);
	}
	// One minute, plus a second for every 512 KB (100 MB gets about four and a half).
	const timeoutMs = 60_000 + Math.ceil(bytes.byteLength / (512 * 1024)) * 1000;
	let response: Response;
	try {
		response = await fetch(uploadUrl, {
			method: 'PUT',
			body: bytes,
			headers,
			redirect: 'error',
			signal: AbortSignal.timeout(timeoutMs),
		});
	} catch (error) {
		throw new HiggsfieldError(
			error instanceof Error && error.name === 'TimeoutError'
				? 'The upload to Higgsfield storage timed out.'
				: 'Could not reach Higgsfield storage for the upload.',
			'upload_failed',
		);
	}
	if (!response.ok) {
		await response.body?.cancel().catch(() => undefined);
		throw new HiggsfieldError(
			`Higgsfield storage refused the upload with HTTP ${response.status}.`,
			'upload_failed',
		);
	}
}
