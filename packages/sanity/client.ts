import { ApiError } from 'corsair/http';

/**
 * The API version every call is pinned to. Sanity versions its API by date, and
 * a date pins the behaviour: this one has the Actions API, perspectives with
 * `published` as the default and the current history endpoints.
 */
export const SANITY_API_VERSION = 'v2025-02-19';

/** Project-independent API (projects, datasets, webhooks). */
export const SANITY_GLOBAL_API = 'https://api.sanity.io';

const DEFAULT_TIMEOUT_MS = 20_000;

export type SanityErrorCode =
	| 'invalid_key'
	| 'invalid_input'
	| 'missing_project'
	| 'network'
	| 'timeout'
	| 'bad_response';

/** A failure that isn't an HTTP answer from Sanity: bad input, settings or the network. */
export class SanityError extends Error {
	constructor(
		message: string,
		public readonly code: SanityErrorCode,
		/** The call that failed, on network and timeout errors. */
		public readonly request?: { method: SanityMethod; path: string },
	) {
		super(message);
		this.name = 'SanityError';
	}
}

/** An HTTP error answer from Sanity, with its error type and description kept. */
export class SanityAPIError extends ApiError {
	/** Sanity's `error.type`, for example `mutationError` or `queryParseError`. */
	public readonly errorType?: string;
	/** The request id Sanity answered with, for support. */
	public readonly requestId?: string;

	constructor(init: {
		method: SanityMethod;
		path: string;
		status: number;
		statusText: string;
		// unknown: the error body, parsed JSON or plain text.
		body: unknown;
		message: string;
		errorType?: string;
		requestId?: string;
		retryAfterMs?: number;
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
		this.name = 'SanityAPIError';
		this.errorType = init.errorType;
		this.requestId = init.requestId;
	}
}

// ── Names ───────────────────────────────────────────────────────────────────

/** Project ids are lowercase letters and digits. */
const PROJECT_ID_RE = /^[a-z0-9]{1,32}$/;
/**
 * Sanity's dataset name rule: 1 to 64 lowercase letters, digits, dashes and
 * underscores, starting and ending with a letter or digit. A leading `~` marks
 * an add-on dataset.
 */
const DATASET_RE = /^~?[a-z0-9](?:[a-z0-9_-]{0,62}[a-z0-9])?$/;

export function isValidProjectId(value: string): boolean {
	return PROJECT_ID_RE.test(value);
}

export function isValidDataset(value: string): boolean {
	return DATASET_RE.test(value);
}

export function requireProjectId(value: string | null | undefined): string {
	const projectId = (value ?? '').trim();
	if (!projectId) {
		throw new SanityError(
			'No Sanity project id is set. Store it with keys.set_project_id (find it at sanity.io/manage, or in sanity.config.ts), or pass sanity({ projectId }).',
			'missing_project',
		);
	}
	if (!isValidProjectId(projectId)) {
		throw new SanityError(
			'The Sanity project id must be lowercase letters and digits, for example abc123de.',
			'invalid_input',
		);
	}
	return projectId;
}

export function requireDataset(value: string): string {
	if (!isValidDataset(value)) {
		throw new SanityError(
			'The dataset name must be 1 to 64 lowercase letters, digits, dashes and underscores, starting and ending with a letter or digit.',
			'invalid_input',
		);
	}
	return value;
}

/** Encodes each id of a comma-separated document id list for a path. */
export function documentIdsPath(ids: readonly string[]): string {
	return ids.map((id) => encodeURIComponent(id)).join(',');
}

// ── Transport ───────────────────────────────────────────────────────────────

export type SanityMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Where a call goes: the project's own API host, or the global one. */
export type SanityHost = { projectId: string } | 'global';

export type SanityRequestInit = {
	method?: SanityMethod;
	query?: Record<
		string,
		string | number | boolean | readonly string[] | undefined
	>;
	// unknown: a JSON body of whatever shape the endpoint takes; only serialised here.
	body?: unknown;
	/** Raw bytes (asset uploads), sent with `contentType`. */
	bytes?: Uint8Array;
	contentType?: string;
	/** `ndjson` for the history transactions export, `text` for a raw body. */
	accept?: 'json' | 'ndjson' | 'text';
	timeoutMs?: number;
	/** Another API version for this call: Agent Actions run only on `vX`. */
	apiVersion?: string;
};

function baseUrl(host: SanityHost): string {
	return host === 'global'
		? SANITY_GLOBAL_API
		: `https://${requireProjectId(host.projectId)}.api.sanity.io`;
}

/** The bearer token, refused here when it can't be one, without repeating it. */
export function authorizationHeader(token: string): string {
	const value = token.trim();
	if (!value || /\s/.test(value)) {
		throw new SanityError(
			'No usable Sanity API token is stored. Create one under API > Tokens at sanity.io/manage and store it with keys.set_api_key.',
			'invalid_key',
		);
	}
	return `Bearer ${value}`;
}

// unknown: parsed JSON of any shape, narrowed by the caller.
function parseBody(text: string): unknown {
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

type ErrorDetail = { text: string; type?: string };

/**
 * Sanity answers errors in a few shapes: `{ error: { description, type, items } }`
 * from the data APIs, `{ error: 'Bad Request', message }` from the management
 * APIs, and plain text from the edge.
 */
// unknown: the error body, parsed JSON or plain text.
export function readErrorDetail(body: unknown): ErrorDetail {
	if (typeof body === 'string') return { text: body.trim().slice(0, 500) };
	if (!body || typeof body !== 'object') return { text: '' };
	// unknown: a JSON error object; each field is checked before use.
	const record = body as Record<string, unknown>;
	const error = record.error;
	if (error && typeof error === 'object' && !Array.isArray(error)) {
		// unknown: the nested error's fields, each checked before use.
		const nested = error as Record<string, unknown>;
		const type = typeof nested.type === 'string' ? nested.type : undefined;
		const parts = [
			typeof nested.description === 'string' ? nested.description : '',
		];
		if (Array.isArray(nested.items)) {
			for (const item of nested.items.slice(0, 5)) {
				// unknown: one mutation error item.
				const entry = (item ?? {}) as Record<string, unknown>;
				// unknown: the item's own error object.
				const itemError = (entry.error ?? {}) as Record<string, unknown>;
				if (typeof itemError.description === 'string') {
					parts.push(itemError.description);
				}
			}
		}
		return { text: parts.filter(Boolean).join(' '), type };
	}
	const message =
		typeof record.message === 'string'
			? record.message
			: typeof error === 'string'
				? error
				: '';
	return { text: message };
}

const STATUS_HINTS: Record<number, string> = {
	401: 'The token was refused: check it under API > Tokens at sanity.io/manage.',
	403: "The token's role doesn't allow this. Reads need Viewer, writes Editor, and datasets and webhooks need Administrator or Developer.",
	409: 'A conflict: the document changed (ifRevisionID) or already exists.',
	413: 'The request is too large.',
	429: 'Rate limited.',
};

function retryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
	const date = Date.parse(header);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function toApiError(
	method: SanityMethod,
	path: string,
	response: Response,
	// unknown: the error body, parsed JSON or plain text.
	body: unknown,
): SanityAPIError {
	const detail = readErrorDetail(body);
	const requestId = response.headers.get('x-request-id') ?? undefined;
	const retryAfter = retryAfterMs(response.headers.get('retry-after'));
	const parts = [
		`Sanity ${response.status}: ${detail.text || response.statusText || 'request failed'}${detail.type ? ` (${detail.type})` : ''}.`,
		STATUS_HINTS[response.status],
		retryAfter !== undefined
			? `Retry after ${Math.ceil(retryAfter / 1000)} s.`
			: undefined,
		requestId ? `Request id: ${requestId}.` : undefined,
	];
	return new SanityAPIError({
		method,
		path,
		status: response.status,
		statusText: response.statusText,
		body,
		message: parts.filter(Boolean).join(' '),
		errorType: detail.type,
		requestId,
		retryAfterMs: retryAfter,
	});
}

/**
 * Calls a Sanity HTTP API. `path` starts after the version, for example
 * `/data/query/production`. A plain fetch rather than `corsair/http`'s
 * `request`, so Sanity's error descriptions and request id survive. Redirects
 * are refused so the token can't follow one, and the transport makes one
 * attempt: retries are error-handlers.ts's call.
 */
export async function makeSanityRequest<T>(
	token: string,
	host: SanityHost,
	path: string,
	init: SanityRequestInit = {},
): Promise<T> {
	const { method = 'GET', query, body, bytes, contentType, accept } = init;
	const authorization = authorizationHeader(token);
	const origin = baseUrl(host);

	const url = new URL(
		`/${init.apiVersion ?? SANITY_API_VERSION}${path}`,
		origin,
	);
	if (url.origin !== origin) {
		throw new SanityError(
			'Refusing to send the Sanity token to another host.',
			'invalid_input',
		);
	}
	for (const [name, value] of Object.entries(query ?? {})) {
		if (value === undefined) continue;
		for (const item of Array.isArray(value) ? value : [value]) {
			url.searchParams.append(name, String(item));
		}
	}

	const headers: Record<string, string> = {
		Accept:
			accept === 'ndjson'
				? 'application/x-ndjson'
				: accept === 'text'
					? 'text/plain, application/json'
					: 'application/json',
		Authorization: authorization,
	};

	let payload: string | Uint8Array | undefined;
	if (bytes !== undefined) {
		payload = bytes;
		headers['Content-Type'] = contentType ?? 'application/octet-stream';
	} else if (body !== undefined) {
		try {
			payload = JSON.stringify(body);
		} catch {
			throw new SanityError(
				'The request body could not be serialized as JSON. A BigInt or a circular reference, for example, cannot be sent.',
				'invalid_input',
			);
		}
		headers['Content-Type'] = 'application/json';
	}

	let response: Response;
	let text: string;
	try {
		response = await fetch(url, {
			method,
			headers,
			body: payload,
			redirect: 'error',
			signal: AbortSignal.timeout(init.timeoutMs ?? DEFAULT_TIMEOUT_MS),
		});
		text = await response.text();
	} catch (error) {
		const timedOut = error instanceof Error && error.name === 'TimeoutError';
		throw new SanityError(
			timedOut
				? `Sanity did not answer ${method} ${path} in time.`
				: `Could not reach Sanity for ${method} ${path}.`,
			timedOut ? 'timeout' : 'network',
			{ method, path },
		);
	}

	if (!response.ok) throw toApiError(method, path, response, parseBody(text));
	if (accept === 'ndjson' || accept === 'text') return text as T;
	return parseBody(text) as T;
}
