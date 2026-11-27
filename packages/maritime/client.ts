import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Maritime's REST API (https://maritime.sh/docs/api, OpenAPI spec at
 * https://api.maritime.sh/openapi.json). Every route takes
 * `Authorization: Bearer mk_...`, an account API key minted with
 * `maritime keys create` or apiKeys.create; its scopes (provision, deploy,
 * secrets, manage, sandboxes) decide which operations work.
 *
 * A virtual machine's commands and files go to its own data plane instead,
 * `https://api-<id>.sb.mtm.sh/v1`, with the machine's `secret` in
 * `X-Maritime-Token` (read with `GET /v1/sandboxes/{id}`, never the account key).
 */
export const MARITIME_API_BASE = 'https://api.maritime.sh';

export const MARITIME_DEFAULT_TIMEOUT_MS = 60_000;

/** Largest file the upload and write routes send (Maritime caps transfers at 100 MB). */
export const MARITIME_UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

/** Data plane hosts: `https://api-<sandbox id>.<host>.sb.mtm.sh/v1` (live 11-27: `api-sbx-….h7.sb.mtm.sh`). */
const DATA_PLANE_URL = /^https:\/\/([a-z0-9-]+\.)+sb\.mtm\.sh(\/v1)?\/?$/;

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class exists
// for this state, so the message is the only handle; kept narrow so it can't
// swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key in plugin options. Anything else
 * thrown is a real failure and propagates.
 */
export async function tryGetStoredKey(
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

/** What a call needs from the endpoint context. */
export type MaritimeCallContext = {
	key: string;
};

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are ids and names. Core's default encodeURI keeps `/`
 * and `..`, so a value like `../users` would reach a different route than the
 * one whose permission was checked.
 */
export function encodeMaritimePathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Maritime path value');
	}
	return encodeURIComponent(value);
}

export type MaritimeHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type MaritimeRequest = {
	method: MaritimeHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars, lists or maps, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON object, multipart form, or raw bytes (a file write); validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | FormData | Blob;
	/** `binary`: the success comes back as `{ bytes, contentType }` (a file, a screenshot). */
	responseType?: 'binary';
	timeoutMs?: number;
	/**
	 * A virtual machine's data plane: the request goes to its `dataPlaneUrl`
	 * with its `secret` in `X-Maritime-Token`, and the account key stays home.
	 */
	dataPlane?: { url: string; secret: string };
};

function configFor(options: MaritimeRequest, key: string) {
	const plane = options.dataPlane;
	if (plane && !DATA_PLANE_URL.test(plane.url)) {
		// The URL comes from Maritime's own answer; anything else is refused so
		// the sandbox secret never goes to another host.
		throw new Error('Maritime returned a data plane URL outside sb.mtm.sh');
	}
	return {
		BASE: plane ? plane.url.replace(/\/+$/, '') : MARITIME_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeMaritimePathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(options.timeoutMs ?? MARITIME_DEFAULT_TIMEOUT_MS),
		HEADERS: (plane
			? { Accept: 'application/json', 'X-Maritime-Token': plane.secret }
			: {
					Accept: 'application/json',
					Authorization: `Bearer ${key}`,
				}) as Record<string, string>,
	} satisfies OpenAPIConfig;
}

/**
 * Maritime answers a 429 with `Retry-After` in seconds (agent invokes, chat,
 * feedback, the VM API), which is what core reads. Core retries three times.
 */
export const MARITIME_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

function mediaTypeFor(request: MaritimeRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		// fetch writes the multipart boundary itself.
		return undefined;
	}
	if (typeof Blob !== 'undefined' && body instanceof Blob) {
		return 'application/octet-stream';
	}
	return 'application/json';
}

/**
 * Sends one Maritime call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeMaritimeRequest(
	ctx: MaritimeCallContext,
	options: MaritimeRequest,
): Promise<unknown> {
	if (!ctx.key) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('maritime', 'api_key');
	}
	// Core's ApiError keeps a redacted copy of the request, so values sent in
	// the query (an invoke token, a path) are gathered here, before the call,
	// to scrub them from an error body that echoes one back.
	const secrets = [
		ctx.key,
		options.dataPlane?.secret,
		...sentValues(options),
	].filter(
		(value): value is string => typeof value === 'string' && value.length > 0,
	);
	if (options.dataPlane) {
		return dataPlaneRequest(options, options.dataPlane, secrets);
	}
	const config = configFor(options, ctx.key);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: { ...options.pathParameters },
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: MARITIME_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, secrets);
		}
		throw error;
	}
}

/** String query and path values of a request, for scrubbing an error that echoes one. */
function sentValues(options: MaritimeRequest): string[] {
	const values: string[] = [];
	for (const record of [options.query, options.pathParameters]) {
		for (const value of Object.values(record ?? {})) {
			if (typeof value === 'string' && value.length >= 6) values.push(value);
		}
	}
	return values;
}

/**
 * One data plane call. It doesn't go through core's request() because core's
 * fetch follows redirects, and fetch drops only `Authorization` on a
 * cross-origin redirect, not `X-Maritime-Token`. Here a redirect is an
 * error, so the sandbox secret only ever reaches the `*.sb.mtm.sh` host
 * Maritime named. No retries: a command or write may already have run.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
async function dataPlaneRequest(
	options: MaritimeRequest,
	plane: { url: string; secret: string },
	secrets: readonly string[],
): Promise<unknown> {
	const config = configFor(options, '');
	let path = options.path;
	for (const [name, value] of Object.entries(options.pathParameters ?? {})) {
		path = path.replace(`{${name}}`, encodeMaritimePathValue(value));
	}
	const url = new URL(`${config.BASE}${path}`);
	for (const [name, value] of Object.entries(options.query ?? {})) {
		if (value === undefined || value === null) continue;
		for (const item of Array.isArray(value) ? value : [value]) {
			url.searchParams.append(name, String(item));
		}
	}
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'X-Maritime-Token': plane.secret,
		...options.headers,
	};
	let body: Blob | string | undefined;
	if (options.body instanceof Blob) {
		headers['Content-Type'] = 'application/octet-stream';
		body = options.body;
	} else if (
		options.body !== undefined &&
		!(options.body instanceof FormData)
	) {
		headers['Content-Type'] = 'application/json';
		body = JSON.stringify(options.body);
	}
	const response = await fetch(url, {
		method: options.method,
		headers,
		body,
		redirect: 'error',
		signal: AbortSignal.timeout(config.TIMEOUT),
	});
	const contentType = response.headers.get('Content-Type');
	if (response.ok && options.responseType === 'binary') {
		return {
			bytes: new Uint8Array(await response.arrayBuffer()),
			contentType,
		};
	}
	const text = await response.text();
	// `unknown` because the body is untrusted until parsed.
	let parsed: unknown;
	if (text.trim().length > 0) {
		try {
			parsed = JSON.parse(text);
		} catch {
			parsed = response.ok ? undefined : text;
		}
	}
	if (!response.ok) {
		const retryAfter = Number(response.headers.get('Retry-After'));
		throw withoutRequestData(
			new ApiError(
				{
					method: options.method,
					url: options.path,
					path: options.pathParameters,
					query: options.query,
				},
				{
					url: url.toString(),
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: parsed,
				},
				`Maritime ${response.status}`,
				Number.isFinite(retryAfter) && retryAfter > 0
					? { retryAfter: retryAfter * 1000 }
					: undefined,
			),
			secrets,
			'data',
		);
	}
	return parsed;
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Maritime body can hold
 * chat messages, file contents, environment values, secrets and an end
 * user's context, so the error is rebuilt without it (and without request
 * headers, which carry the API key or a sandbox secret), keeping the status
 * and rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Maritime's reason. The message is rebuilt from Maritime's error body.
 */
export function withoutRequestData(
	error: ApiError,
	secrets: readonly string[] = [],
	plane: 'api' | 'data' = 'api',
): ApiError {
	// The key and the sandbox secret travel in the transport config, not on
	// error.request: add them, so a body that echoes one loses it too.
	const sent = [
		...secrets.map((text) => ({ text, wholeWord: false })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = maritimeErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Path and query values are ids, names, paths and search terms: keep the keys only.
			path: redactedValues(error.request.path),
			query: redactedValues(error.request.query),
		},
		{
			url: routeUrl(error.url, error.request.url, plane),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * Maritime's error bodies (all seen live 11-27):
 * - the virtual machine API: `{ "code": "sandbox_not_found", "message":
 *   "No such sandbox.", "hint": "...", "docUrl": "...", "field": "from" }`;
 * - the agent API (FastAPI): `{ "detail": "Agent x not found" }`, a 422's
 *   `{ "detail": [{ "loc": ["body", "message"], "msg": "..." }] }`, or
 *   `{ "detail": { "code": "vm_not_ready", "state": "starting" } }`;
 * - computers: `{ "error": "not_found", "message": "No such computer." }`.
 */
export function maritimeErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) Maritime sent.
	body: unknown,
): string {
	const fields = asFields(body);
	let reason: string | undefined;
	const code =
		typeof fields.code === 'string'
			? fields.code
			: typeof fields.error === 'string'
				? fields.error
				: undefined;
	if (typeof fields.message === 'string' && fields.message.length > 0) {
		reason = fields.message;
		if (typeof fields.field === 'string') reason += ` (field ${fields.field})`;
		if (typeof fields.hint === 'string' && fields.hint.length > 0) {
			reason += ` ${fields.hint}`;
		}
	} else if (typeof fields.detail === 'string' && fields.detail.length > 0) {
		reason = fields.detail;
	} else if (Array.isArray(fields.detail)) {
		reason = fields.detail
			.map(listedError)
			.filter((item): item is string => item !== undefined)
			.slice(0, 5)
			.join('; ');
	} else if (typeof fields.detail === 'object' && fields.detail !== null) {
		const detail = asFields(fields.detail);
		reason = [detail.code, detail.message, detail.state]
			.filter((part): part is string => typeof part === 'string')
			.join(': ');
	} else if (typeof body === 'string' && body.trim().length > 0) {
		// An HTML error page says nothing useful; keep only short plain text.
		const text = body.trim();
		if (!text.startsWith('<')) reason = text;
	}
	const prefix = code && reason && !reason.includes(code) ? `${code}: ` : '';
	const text = `Maritime ${status}: ${prefix}${reason || code || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

// `unknown` because an error body is whatever JSON Maritime sent.
function asFields(body: unknown): Record<string, unknown> {
	return typeof body === 'object' && body !== null && !Array.isArray(body)
		? // `unknown` because each field is narrowed where it's read.
			(body as Record<string, unknown>)
		: {};
}

/** One FastAPI validation entry: `{ loc: ["body", "message"], msg }` as `message: msg`. */
// `unknown` because a list entry is whatever JSON Maritime sent.
function listedError(item: unknown): string | undefined {
	if (typeof item === 'string') return item;
	const entry = asFields(item);
	if (typeof entry.msg !== 'string') return undefined;
	const where = Array.isArray(entry.loc)
		? entry.loc
				.filter(
					(part): part is string | number =>
						(typeof part === 'string' && part !== 'body' && part !== 'query') ||
						typeof part === 'number',
				)
				.join('.')
		: '';
	return where ? `${where}: ${entry.msg}` : entry.msg;
}

/** Strings shorter than this are matched as whole words only... */
const WHOLE_WORD_BELOW = 6;
/**
 * ...and one-character strings are left alone, unless they sit under a key
 * like these (a password, a token, a code, a phone number), where every
 * length counts.
 */
const SECRET_KEY =
	/pass|secret|token|credential|key$|otp|code$|phone|number|email|address|value|content|message|context/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, query values, path values), longest
 * first, so a Maritime message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a name like "Ada", a file path), so
 * length doesn't exempt one; short ones are matched as whole words, so they
 * can't take out letters or digits inside other words.
 */
function sentStrings(request: ApiError['request']): SentString[] {
	const found = new Map<string, boolean>();
	// `unknown` because a sent value is any JSON value.
	const visit = (value: unknown, depth: number, secret: boolean) => {
		if (depth > 8 || value === undefined || value === null) return;
		if (typeof value === 'string') {
			if (value.length >= (secret ? 1 : 2) && !found.has(value)) {
				found.set(value, value.length < WHOLE_WORD_BELOW);
			}
			return;
		}
		if (typeof value === 'number' && secret) {
			const text = String(value);
			if (!found.has(text)) found.set(text, true);
			return;
		}
		if (Array.isArray(value)) {
			for (const item of value) visit(item, depth + 1, secret);
			return;
		}
		if (typeof FormData !== 'undefined' && value instanceof FormData) return;
		if (typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				visit(inner, depth + 1, secret || SECRET_KEY.test(key));
			}
		}
	};
	visit(request.body, 0, false);
	visit(request.query, 0, false);
	// An id or name in the path, at any length:
	// a 404 can quote it back.
	visit(request.path, 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Maritime sent.
function scrubSent(value: unknown, sent: SentString[], depth = 0): unknown {
	if (sent.length === 0) return value;
	// A sent value echoed deeper than this is dropped with its subtree.
	if (depth > MAX_ERROR_DEPTH) return REDACTED;
	if (typeof value === 'string') {
		let text = value;
		for (const item of sent) {
			text = item.wholeWord
				? text.replace(
						new RegExp(
							`(?<![A-Za-z0-9])${escapeRegExp(item.text)}(?![A-Za-z0-9])`,
							'g',
						),
						REDACTED,
					)
				: text.split(item.text).join(REDACTED);
		}
		return text;
	}
	if (Array.isArray(value)) {
		return value.map((item) => scrubSent(item, sent, depth + 1));
	}
	if (typeof value === 'object' && value !== null) {
		// `unknown` because error detail items have no fixed shape.
		const result: Record<string, unknown> = {};
		for (const [key, inner] of Object.entries(value)) {
			result[key] = scrubSent(inner, sent, depth + 1);
		}
		return result;
	}
	return value;
}

// `unknown` because query and path values are scalars.
function redactedValues(
	values: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (values === undefined) return undefined;
	return Object.fromEntries(Object.keys(values).map((key) => [key, REDACTED]));
}

/**
 * The route the call took, without the caller's values:
 * `https://api.maritime.sh/api/agents/ag_1/files/list?path=/data` →
 * `https://api.maritime.sh/api/agents/{agent_id}/files/list?[REDACTED]`. A data
 * plane call names the plane, not the sandbox's own host.
 */
export function routeUrl(
	url: string,
	route: string | undefined,
	plane: 'api' | 'data' = 'api',
): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	const base =
		plane === 'data' ? 'https://api-{sandbox}.sb.mtm.sh/v1' : MARITIME_API_BASE;
	return `${base}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/files/list?path=…` → `https://…/files/list?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Maritime sent.
function withoutEchoedValues(body: unknown, depth = 0): unknown {
	if (typeof body !== 'object' || body === null) return body;
	// Deeper than the scrub below reaches: nothing of it is kept.
	if (depth > MAX_ERROR_DEPTH) return REDACTED;
	if (Array.isArray(body)) {
		return body.map((item) => withoutEchoedValues(item, depth + 1));
	}
	// `unknown` because error detail items have no fixed shape.
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (ECHO_KEYS.has(key)) continue;
		result[key] = withoutEchoedValues(value, depth + 1);
	}
	return result;
}
