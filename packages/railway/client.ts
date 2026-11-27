import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Railway's public GraphQL API: one endpoint,
 * `POST https://backboard.railway.com/graphql/v2`, with `{ query, variables }`.
 *
 * Tokens (railway.com/account/tokens, or a project's settings):
 * - account and workspace tokens go in `Authorization: Bearer <token>`;
 * - a project token goes in `Project-Access-Token: <token>` and reaches only
 *   that project's environment.
 */
export const RAILWAY_API_BASE = 'https://backboard.railway.com';
export const RAILWAY_GRAPHQL_PATH = '/graphql/v2';
export const RAILWAY_DEFAULT_TIMEOUT_MS = 30_000;

export type RailwayTokenKind = 'account' | 'workspace' | 'project';

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key in plugin options. Anything else thrown is a real failure
 * and propagates.
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
export type RailwayCallContext = {
	key: string;
	options: { tokenKind?: RailwayTokenKind };
};

/** The auth header for a token kind. */
export function railwayAuthHeaders(
	key: string,
	kind: RailwayTokenKind = 'account',
): Record<string, string> {
	return kind === 'project'
		? { 'Project-Access-Token': key }
		: { Authorization: `Bearer ${key}` };
}

/**
 * Railway allows a token 1,000 to 10,000 requests an hour (by plan) and a few
 * per second, and answers 429 with Retry-After and X-RateLimit-Reset; core
 * retries three times.
 */
export const RAILWAY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

/**
 * HTTP errors from a GraphQL query (not a mutation). Every call is a POST, so
 * the error handlers look here to decide whether a 5xx is safe to retry.
 */
const READ_ERRORS = new WeakSet<ApiError>();

export function isRailwayReadError(error: Error): boolean {
	return error instanceof ApiError && READ_ERRORS.has(error);
}

export type RailwayGraphQLRequest = {
	/** The GraphQL document (one operation). */
	query: string;
	/** The root field the document calls. */
	field: string;
	// `unknown` because variables are validated per operation.
	variables: Record<string, unknown>;
	timeoutMs?: number;
};

type GraphQLErrorEntry = {
	message?: unknown;
	path?: unknown;
	extensions?: { code?: unknown };
};

/**
 * A GraphQL error Railway answered with HTTP 200 (`{ errors: [...] }`): a
 * missing record, a token without access ("Not Authorized"), a bad argument.
 * `status` is what the same failure would be over REST (401/403 for access,
 * 404 for a missing record, 429 for a rate limit, 400 otherwise), so the error
 * handlers treat both alike. Messages are scrubbed of every value sent.
 */
export class RailwayGraphQLError extends Error {
	readonly status: number;
	/** Every message Railway sent, scrubbed. */
	readonly messages: string[];
	/** `extensions.code` of each error (Railway often sends INTERNAL_SERVER_ERROR). */
	readonly codes: string[];
	/** The response path of each error (`["project"]`). */
	readonly paths: string[];

	constructor(messages: string[], codes: string[], paths: string[]) {
		const text = messages.join('; ') || 'request failed';
		const status = graphqlStatus(messages);
		super(
			`Railway ${status}: ${text.length > 480 ? `${text.slice(0, 477)}...` : text}`,
		);
		this.name = 'RailwayGraphQLError';
		this.status = status;
		this.messages = messages;
		this.codes = codes;
		this.paths = paths;
	}
}

export function graphqlStatus(messages: readonly string[]): number {
	const text = messages.join(' ').toLowerCase();
	if (
		/not authori[sz]ed|unauthori[sz]ed|forbidden|permission|access denied/.test(
			text,
		)
	)
		return 403;
	if (/rate limit|too many requests|too quickly/.test(text)) return 429;
	if (/not found|does not exist|no .* found/.test(text)) return 404;
	return 400;
}

/**
 * Sends one GraphQL request through core's transport (which retries a 429
 * three times and raises `ApiError` for an HTTP error) and returns `data`.
 * A 200 with `errors` throws RailwayGraphQLError.
 */
export async function makeRailwayRequest(
	ctx: RailwayCallContext,
	call: RailwayGraphQLRequest,
	// `unknown` because `data` is parsed by the operation's output schema.
): Promise<Record<string, unknown>> {
	if (!ctx.key) {
		throw new AuthMissingError('railway', 'api_key');
	}
	const config = {
		BASE: RAILWAY_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: Math.ceil(call.timeoutMs ?? RAILWAY_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			...railwayAuthHeaders(ctx.key, ctx.options?.tokenKind),
		},
	} satisfies OpenAPIConfig;
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: RAILWAY_GRAPHQL_PATH,
		body: { query: call.query, variables: call.variables },
		mediaType: 'application/json',
	};
	// `unknown` because the body is untrusted JSON until checked below.
	let body: unknown;
	try {
		body = await request<unknown>(config, requestOptions, {
			rateLimitConfig: RAILWAY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const scrubbed = withoutRequestData(error, ctx.key);
			if (call.query.startsWith('query ')) READ_ERRORS.add(scrubbed);
			throw scrubbed;
		}
		throw error;
	}
	const record =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? (body as { data?: unknown; errors?: unknown })
			: {};
	const data =
		typeof record.data === 'object' && record.data !== null
			? (record.data as Record<string, unknown>)
			: undefined;
	const errorList = Array.isArray(record.errors)
		? (record.errors as GraphQLErrorEntry[])
		: [];
	// A failure inside the result (a deleted project an audit log entry points
	// to) nulls that one nested field and leaves the rest: that answer is kept,
	// like GraphQL's partial results. A failure of the field itself (no data
	// for it, or an error at its own path) throws.
	const fieldFailed =
		data?.[call.field] === undefined ||
		data[call.field] === null ||
		errorList.some(
			(entry) => !Array.isArray(entry?.path) || entry.path.length <= 1,
		);
	if (errorList.length > 0 && fieldFailed) {
		const sent = [
			{ text: ctx.key, wholeWord: false },
			...sentStrings({ body: call.variables } as ApiError['request']),
		].sort((a, b) => b.text.length - a.text.length);
		const entries = errorList;
		const messages = entries
			.slice(0, 5)
			.map((entry) =>
				typeof entry?.message === 'string'
					? String(scrubSent(entry.message, sent))
					: 'error',
			);
		const codes = entries.map((entry) =>
			typeof entry?.extensions?.code === 'string' ? entry.extensions.code : '',
		);
		const paths = entries.map((entry) =>
			Array.isArray(entry?.path) ? entry.path.join('.') : '',
		);
		throw new RailwayGraphQLError(messages, codes, paths);
	}
	if (!data) {
		throw new Error('Railway answered without data');
	}
	return data;
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Railway request's
 * variables can hold environment variable values, secrets, repo names and
 * emails, so the error is rebuilt without them (and without
 * request headers, which carry the API key), keeping the status and
 * rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Railway's reason. The message is rebuilt from Railway's error body.
 */
export function withoutRequestData(error: ApiError, key?: string): ApiError {
	// The key travels in the transport config, not on error.request: add it,
	// so a body that echoes it loses it too.
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = railwayErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Path and query values are ids, names and search terms: keep the keys only.
			path: redactedValues(error.request.path),
			query: redactedValues(error.request.query),
		},
		{
			url: withoutQuery(error.url),
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
 * An HTTP error's body: GraphQL's `{ "errors": [{ "message": ... }] }` (a
 * query Railway can't parse answers 400 this way), or a plain-text or
 * `{ message }` body from the edge (429, 5xx).
 */
export function railwayErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) Railway sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	const parts: string[] = [];
	if (typeof fields.message === 'string' && fields.message.length > 0) {
		parts.push(fields.message);
	}
	const errors = Array.isArray(fields.errors)
		? fields.errors.map((entry) =>
				typeof entry === 'object' && entry !== null && 'message' in entry
					? (entry as { message?: unknown }).message
					: entry,
			)
		: typeof fields.errors === 'object' && fields.errors !== null
			? Object.entries(fields.errors).flatMap(([field, messages]) =>
					(Array.isArray(messages) ? messages : [messages]).map((message) =>
						typeof message === 'string' ? `${field} ${message}` : undefined,
					),
				)
			: [];
	if (errors.length > 0) {
		for (const item of errors.slice(0, 5)) {
			if (
				typeof item === 'string' &&
				item.length > 0 &&
				!parts.includes(item)
			) {
				parts.push(item);
			}
		}
	}
	if (
		parts.length === 0 &&
		typeof body === 'string' &&
		body.trim().length > 0
	) {
		// An HTML error page (a proxy, a login page) says nothing useful.
		const text = body.trim();
		if (!text.startsWith('<')) parts.push(text);
	}
	const text = `Railway ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** Strings shorter than this are matched as whole words only... */
const WHOLE_WORD_BELOW = 6;
/**
 * ...and one-character strings are left alone, unless they sit under a key
 * like these (a password, a token, a code, a phone number), where every
 * length counts.
 */
const SECRET_KEY =
	/pass|secret|token|credential|key$|otp|code$|phone|number|email|address|to$|from$/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, query values, path values), longest
 * first, so a Railway message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a user name like "ada", an issue title), so
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
	// An id or record type in the path, at any length:
	// a 404 can quote it back.
	visit(request.path, 0, true);
	// The path values were sent encoded (`a%40b.md`); Railway quotes them back
	// decoded, so the decoded form is scrubbed too.
	visit(decodedValues(request.path), 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

// `unknown` because path values are validated scalars.
function decodedValues(
	values: Record<string, unknown> | undefined,
): Record<string, string> {
	const decoded: Record<string, string> = {};
	for (const [key, value] of Object.entries(values ?? {})) {
		if (typeof value !== 'string') continue;
		try {
			decoded[key] = decodeURIComponent(value);
		} catch {
			// Not percent-encoded after all: the raw value is already collected.
		}
	}
	return decoded;
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Railway sent.
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

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Railway sent.
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
