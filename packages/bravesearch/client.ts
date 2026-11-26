import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Brave Search API. Searches live under `/res/v1` and take the search key in
 * `X-Subscription-Token`; the Admin API lives under `/admin/v1` and takes a
 * separate admin key (`bsk_admin_...`) as a bearer token. Reference:
 * https://api-dashboard.search.brave.com/documentation
 */
export const BRAVE_API_BASE = 'https://api.search.brave.com';
export const BRAVE_SEARCH_BASE = `${BRAVE_API_BASE}/res/v1`;
export const BRAVE_ADMIN_BASE = `${BRAVE_API_BASE}/admin/v1`;

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * The transport's own 429 loop is off (`maxRetries: 0`), so the plugin's
 * error handlers own retries: they retry Brave's per-second `RATE_LIMITED`
 * and leave a spent quota or plan limit alone. Brave's `X-RateLimit-*`
 * headers hold one value per window (`"1, 359717"`), which core's single
 * number parser would misread, so only `Retry-After` is read here.
 */
const TRANSPORT_RETRY_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429 || status === 503,
};

// `unknown` is necessary because query values are whatever each endpoint's validated input holds.
export type BraveQuery = Record<string, unknown>;

export type BraveRequestOptions = {
	method?: 'GET' | 'POST';
	query?: BraveQuery;
	/** JSON body, already validated by the endpoint's input schema. */
	body?: Record<string, unknown>;
	headers?: Record<string, string>;
	timeoutMs?: number;
};

/** Search API call with the search key (`X-Subscription-Token`). */
export async function braveSearchRequest<T>(
	path: string,
	key: string,
	options: BraveRequestOptions = {},
): Promise<T> {
	if (!key.trim()) {
		throw new AuthMissingError('bravesearch', 'api_key');
	}
	return send<T>(
		BRAVE_SEARCH_BASE,
		path,
		{ 'X-Subscription-Token': key },
		options,
	);
}

/** Admin API call with an admin key (`Authorization: Bearer bsk_admin_...`). */
export async function braveAdminRequest<T>(
	path: string,
	adminKey: string,
	options: BraveRequestOptions = {},
): Promise<T> {
	if (!adminKey.trim()) {
		throw new AuthMissingError('bravesearch', 'admin_key');
	}
	return send<T>(
		BRAVE_ADMIN_BASE,
		path,
		{ Authorization: `Bearer ${adminKey}` },
		options,
	);
}

async function send<T>(
	base: string,
	path: string,
	authHeaders: Record<string, string>,
	options: BraveRequestOptions,
): Promise<T> {
	const { method = 'GET', query, body, headers, timeoutMs } = options;
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs ?? DEFAULT_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', ...authHeaders },
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: query ? withoutUndefined(query) : undefined,
		headers,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: TRANSPORT_RETRY_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw error;
	}
}

// `unknown` is necessary because query values are whatever each endpoint's validated input holds.
function withoutUndefined(query: BraveQuery): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	);
}

/** Brave's error body: `{"type":"ErrorResponse","error":{"id","status","code","detail","meta"},"time"}`. */
type BraveErrorBody = {
	error?: { code?: unknown; detail?: unknown; meta?: unknown };
};

/** The `error.code` of a Brave error response (`RATE_LIMITED`, `OPTION_NOT_IN_PLAN`, ...). */
export function braveErrorCode(error: unknown): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body = error.body as BraveErrorBody | undefined;
	const code = body?.error?.code;
	return typeof code === 'string' ? code : undefined;
}

/**
 * Core keeps the sent body and headers on `ApiError.request`: an Answers
 * question, and `X-Loc-*` headers with the caller's coordinates. This rebuilds
 * the error without them, keeping the status, body and rate-limit fields the
 * error handlers and core read. Core's message for a 400 is just
 * "Bad Request", so the message is rebuilt from Brave's `detail` and `code`.
 */
function withoutRequestData(error: ApiError): ApiError {
	return new ApiError(
		{ method: error.request.method, url: error.request.url },
		{
			url: withoutQuery(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: withoutEchoedInput(error.body),
		},
		safeMessage(error),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** The URL without its query string, which holds the search terms. */
function withoutQuery(url: string): string {
	const cut = url.search(/[?#]/);
	return cut === -1 ? url : url.slice(0, cut);
}

// Keys under which a validation error can echo a rejected request value.
const ECHO_KEYS = new Set(['input', 'value', 'ctx', 'query', 'q']);

/**
 * Brave's error body with any echoed request value removed: a validation
 * error's `meta` can carry the rejected input (`meta.errors[].input`), which
 * may be a user's query. `id`, `status`, `code` and `detail` stay.
 */
// `unknown` is necessary because an error body is whatever JSON (or text) Brave sent.
export function withoutEchoedInput(body: unknown): unknown {
	if (Array.isArray(body)) return body.map(withoutEchoedInput);
	if (typeof body !== 'object' || body === null) return body;
	return Object.fromEntries(
		Object.entries(body)
			.filter(([key]) => !ECHO_KEYS.has(key))
			.map(([key, value]) => [key, withoutEchoedInput(value)]),
	);
}

function safeMessage(error: ApiError): string {
	const body = error.body as BraveErrorBody | undefined;
	const detail =
		typeof body?.error?.detail === 'string' ? body.error.detail : undefined;
	const code = braveErrorCode(error);
	const text = detail ?? (error.statusText || `HTTP ${error.status}`);
	const message = code && !text.includes(code) ? `${text} (${code})` : text;
	return `Brave Search HTTP ${error.status}: ${message}`.slice(0, 400);
}

// Matches only core's "no DEK on this account" error
// (core/auth/key-manager.ts: `No DEK found for account ...`). An account that
// was never given a stored key has no DEK, which means "no stored key"; any
// other failure (decryption, database) is real and propagates.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/** A stored credential, or undefined when the account has none. */
export async function tryGetStoredKey(
	getter: (() => Promise<string | null | undefined>) | undefined,
): Promise<string | undefined> {
	if (!getter) return undefined;
	try {
		const value = await getter();
		return value?.trim() || undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

// ── Answers streaming ───────────────────────────────────────────────────────

/** One chunk of an OpenAI-style `chat.completion.chunk` stream. */
type StreamChunk = {
	id?: string;
	object?: string;
	created?: number;
	model?: string;
	system_fingerprint?: string;
	choices?: Array<{
		delta?: { role?: string; content?: string | null };
		finish_reason?: string | null;
	}>;
	usage?: Record<string, unknown>;
};

// `unknown` is necessary because tag payloads are JSON whose fields Brave may extend.
export type StreamTag = { tag: string; value: unknown };

export type AssembledAnswer = {
	id?: string;
	object: 'chat.completion';
	created?: number;
	model?: string;
	system_fingerprint?: string;
	choices: Array<{
		index: number;
		message: { role: string; content: string };
		finish_reason: string | null;
	}>;
	usage?: Record<string, unknown>;
	// `unknown` is necessary because citation and tag payloads are JSON whose fields Brave may extend.
	citations: unknown[];
	cost?: unknown;
	tags: StreamTag[];
};

const TAGGED = /^<([a-z_]+)>([\s\S]*)<\/\1>$/;

/**
 * Turns a buffered Answers stream (`data: {...}` lines, then `data: [DONE]`)
 * into one completion. Brave sends extra data as whole deltas wrapped in a tag
 * (`<citation>{json}</citation>`, `<usage>{json}</usage>`); those are lifted
 * out of the text into `citations`, `cost` and `tags`. Citation offsets point
 * into the text that is left.
 */
export function assembleAnswerStream(raw: string): AssembledAnswer {
	const answer: AssembledAnswer = {
		object: 'chat.completion',
		choices: [],
		citations: [],
		tags: [],
	};
	let role = 'assistant';
	let content = '';
	let finish: string | null = null;
	let chunks = 0;
	let done = false;
	for (const line of raw.split(/\r?\n/)) {
		if (!line.startsWith('data:')) continue;
		const data = line.slice(5).trim();
		if (data === '[DONE]') {
			done = true;
			continue;
		}
		if (!data) continue;
		let chunk: StreamChunk;
		try {
			chunk = JSON.parse(data) as StreamChunk;
		} catch {
			continue;
		}
		chunks++;
		answer.id ??= chunk.id;
		answer.created ??= chunk.created;
		answer.model ??= chunk.model;
		answer.system_fingerprint ??= chunk.system_fingerprint;
		if (chunk.usage) answer.usage = chunk.usage;
		const choice = chunk.choices?.[0];
		if (!choice) continue;
		if (choice.delta?.role) role = choice.delta.role;
		if (choice.finish_reason) finish = choice.finish_reason;
		const delta = choice.delta?.content;
		if (typeof delta !== 'string' || delta.length === 0) continue;
		const tagged = TAGGED.exec(delta);
		if (!tagged) {
			content += delta;
			continue;
		}
		const [, tag, inner] = tagged as unknown as [string, string, string];
		const value = parseJson(inner);
		if (tag === 'citation') answer.citations.push(value);
		else if (tag === 'usage') answer.cost = value;
		else answer.tags.push({ tag, value });
	}
	if (chunks === 0) {
		throw new Error(
			'Brave Search Answers returned no stream chunks; the response could not be read.',
		);
	}
	// A stream that stops before its finish chunk or [DONE] lost the rest of
	// the answer and the cost line. It is refused rather than returned as a
	// complete answer, and not replayed: the call was billed.
	if (!done && finish === null) {
		throw new Error(
			'Brave Search Answers stream ended before it finished; the answer is incomplete.',
		);
	}
	answer.choices.push({
		index: 0,
		message: { role, content },
		finish_reason: finish,
	});
	return answer;
}

// `unknown` is necessary because tag payloads are JSON whose fields Brave may extend.
function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
