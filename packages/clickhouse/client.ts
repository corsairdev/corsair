/**
 * ClickHouse HTTP client.
 *
 * ClickHouse is not a REST API — its HTTP interface accepts a raw SQL query
 * as the request body and returns rows in a chosen output format. We POST
 * the SQL and request JSONEachRow via `X-ClickHouse-Format`.
 *
 * Auth is HTTP Basic. The caller supplies the full `Authorization` header
 * value (e.g. `Basic dXNlcjpwYXNz`).
 *
 * Parameterized SQL uses ClickHouse's `{name:Type}` placeholders, which the
 * server substitutes from URL query parameters of the same name. The caller
 * passes `params` to populate those query params — never string-concatenate
 * user input into SQL.
 */
import { AuthMissingError } from 'corsair/core';

export class ClickhouseAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'ClickhouseAPIError';
	}
}

export type QueryRow = Record<string, unknown>;
export type QueryParams = Record<string, string | number | boolean>;

const MAX_PLAY_BYTES = 5 * 1024 * 1024;

/** Keep any `?user=` / settings already on the tenant URL. */
function httpUrl(baseUrl: string): URL {
	const trimmed = baseUrl.replace(/\/+$/, '');
	return new URL(trimmed.includes('?') ? trimmed : `${trimmed}/`);
}

export function playInterfaceUrl(baseUrl: string): string {
	const url = httpUrl(baseUrl);
	url.pathname = `${url.pathname.replace(/\/+$/, '')}/play`;
	return url.toString();
}

/**
 * Execute a SQL query against a ClickHouse HTTP endpoint and return the
 * rows as plain objects.
 *
 * @param baseUrl  Per-tenant ClickHouse HTTP endpoint (no trailing slash).
 * @param basicAuthHeader  Full `Authorization` header value.
 * @param sql  SQL to run. Use `{name:Type}` placeholders for any
 *             caller-controlled identifiers; pass their values via `params`.
 * @param params  Values for `{name:Type}` placeholders in `sql`, sent as URL
 *                query params.
 * @param database  Optional default database (sent as `?database=`).
 */
export async function query(
	baseUrl: string,
	basicAuthHeader: string,
	sql: string,
	options: {
		params?: QueryParams;
		database?: string;
	} = {},
): Promise<QueryRow[]> {
	const { params, database } = options;
	const url = httpUrl(baseUrl);
	if (database) {
		// `database` here is the built-in ClickHouse system parameter that
		// sets the default database for the query; it is NOT a placeholder.
		// Placeholder values for `{name:Type}` substitutions are sent below
		// with the required `param_` prefix.
		url.searchParams.set('database', database);
	}
	for (const [key, value] of Object.entries(params ?? {})) {
		// ClickHouse's HTTP interface substitutes `{name:Type}` placeholders
		// from URL query parameters named `param_<name>`. Sending the bare
		// name is silently ignored by the server and the placeholder
		// remains unbound (ClickHouse throws on unbound placeholders for
		// non-String types, and for String types it raises a
		// `Type mismatch` exception).
		url.searchParams.set(`param_${key}`, String(value));
	}

	// Official HTTP: X-ClickHouse-Format aliases output_format and overrides
	// a FORMAT clause. Do not append FORMAT to the SQL — a second FORMAT is
	// a syntax error (verified against play.clickhouse.com).
	// https://clickhouse.com/docs/interfaces/http
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: basicAuthHeader,
			'Content-Type': 'text/plain; charset=utf-8',
			'X-ClickHouse-Format': 'JSONEachRow',
		},
		body: sql.trimEnd(),
	});

	if (!response.ok) {
		const errBody = await response.text();
		throw new ClickhouseAPIError(
			errBody || response.statusText,
			response.status,
		);
	}

	const text = await response.text();
	if (!text.trim()) return [];

	const rows: QueryRow[] = [];
	for (const line of text.split('\n')) {
		if (!line) continue;
		try {
			rows.push(JSON.parse(line) as QueryRow);
		} catch {
			throw new ClickhouseAPIError(
				`Failed to parse ClickHouse response line: ${line}`,
			);
		}
	}
	return rows;
}

/**
 * Fetch the ClickHouse Play web UI HTML. The Play UI is served at `/play`
 * on the same HTTP endpoint. The body is streamed and capped at
 * {@link MAX_PLAY_BYTES} — the reader is cancelled the moment total bytes
 * exceed the cap so a malicious response cannot exhaust memory.
 */
export async function fetchPlayHtml(
	baseUrl: string,
	basicAuthHeader: string,
): Promise<string> {
	const response = await fetch(playInterfaceUrl(baseUrl), {
		method: 'GET',
		headers: { Authorization: basicAuthHeader },
		redirect: 'follow',
	});

	if (!response.ok) {
		throw new ClickhouseAPIError(response.statusText, response.status);
	}

	const reader = response.body?.getReader();
	if (!reader) {
		throw new ClickhouseAPIError(
			'Play UI response has no readable body',
			response.status,
		);
	}

	const decoder = new TextDecoder('utf-8');
	let text = '';
	let totalBytes = 0;

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		totalBytes += value.byteLength;
		if (totalBytes > MAX_PLAY_BYTES) {
			await reader.cancel();
			throw new ClickhouseAPIError(
				`Play UI response exceeds ${MAX_PLAY_BYTES} bytes`,
				response.status,
			);
		}
		text += decoder.decode(value, { stream: true });
	}
	// Flush any bytes the decoder held for an incomplete trailing multi-byte
	// sequence.
	text += decoder.decode();

	return text;
}

/**
 * ClickHouse identifier allowlist — table/database names must match. Block
 * `String` SQL injection vectors before they reach the server even when the
 * server-side `{name:String}` substitution is in use.
 */
const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
export function assertSafeIdentifier(value: string, field: string): void {
	if (!IDENTIFIER_RE.test(value)) {
		throw new ClickhouseAPIError(
			`Invalid ${field}: "${value}". Must match ${IDENTIFIER_RE.source}.`,
		);
	}
}

/**
 * Strip SQL tokens that are not executable code — comments and quoted
 * literals — so a regex scan for clauses like `LIMIT` doesn't false-positive
 * on text inside a comment or string. Replaces stripped regions with spaces
 * so character offsets and column positions are preserved.
 *
 * Handles:
 *   - block comments    /* ... *\/
 *   - line comments     -- ...
 *   - string literals   '...' (with '' escape)
 *   - quoted idents     "..." (with "" escape)
 *   - backtick idents   `...` (with `` escape; ClickHouse MySQL-style)
 *
 * Not a full SQL parser. Edge cases (nested comments, multi-line raw strings)
 * are out of scope; they are uncommon in OLAP queries.
 */
export function stripNonCodeTokens(sql: string): string {
	return sql
		.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length))
		.replace(/--[^\n]*/g, (m) => ' '.repeat(m.length))
		.replace(/'(?:''|[^'])*'/g, (m) => ' '.repeat(m.length))
		.replace(/"(?:""|[^"])*"/g, (m) => ' '.repeat(m.length))
		.replace(/`(?:``|[^`])*`/g, (m) => ' '.repeat(m.length));
}

/**
 * Resolve the per-call ClickHouse HTTP endpoint.
 *
 * Resolution order:
 *   1. Plugin option `baseUrl` (solo mode, single shared endpoint)
 *   2. Account-stored `tenant_external_id` (multi-tenant mode, one per account)
 *
 * Throws {@link AuthMissingError} when neither source is available so the
 * caller surfaces a clear "where do you point at?" error rather than a
 * generic connection failure.
 */
export async function resolveBaseUrl(ctx: {
	options?: { baseUrl?: string };
	keys?: {
		get_tenant_external_id?: () => Promise<string | null | undefined>;
	};
}): Promise<string> {
	const fromOptions = ctx.options?.baseUrl;
	if (fromOptions) return fromOptions;
	const getter = ctx.keys?.get_tenant_external_id;
	if (getter) {
		const fromTenant = await getter();
		if (fromTenant) return fromTenant;
	}
	throw new AuthMissingError('clickhouse', 'baseUrl');
}
