/**
 * ClickHouse HTTP client.
 *
 * ClickHouse is not a REST API — its HTTP interface accepts a raw SQL query
 * as the request body and returns rows in a chosen output format. We POST
 * the SQL with `FORMAT JSONEachRow` so each line is a JSON object.
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
	const url = new URL(baseUrl.replace(/\/+$/, '') + '/');
	if (database) {
		url.searchParams.set('database', database);
	}
	for (const [key, value] of Object.entries(params ?? {})) {
		url.searchParams.set(key, String(value));
	}

	const body = `${sql.trimEnd()}\nFORMAT JSONEachRow`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: basicAuthHeader,
			'Content-Type': 'text/plain; charset=utf-8',
		},
		body,
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
 * on the same HTTP endpoint. The body is capped at {@link MAX_PLAY_BYTES}
 * to prevent abuse.
 */
export async function fetchPlayHtml(
	baseUrl: string,
	basicAuthHeader: string,
): Promise<string> {
	const url = baseUrl.replace(/\/+$/, '') + '/play';

	const response = await fetch(url, {
		method: 'GET',
		headers: { Authorization: basicAuthHeader },
		redirect: 'follow',
	});

	if (!response.ok) {
		throw new ClickhouseAPIError(response.statusText, response.status);
	}

	const contentLength = Number(response.headers.get('content-length') ?? '0');
	if (contentLength > MAX_PLAY_BYTES) {
		throw new ClickhouseAPIError(
			`Play UI response too large: ${contentLength} bytes`,
			response.status,
		);
	}

	const text = await response.text();
	if (text.length > MAX_PLAY_BYTES) {
		throw new ClickhouseAPIError(
			`Play UI response too large: ${text.length} bytes`,
			response.status,
		);
	}
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
