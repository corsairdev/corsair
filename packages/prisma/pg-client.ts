import type { QueryConfig } from 'pg';
import { Client } from 'pg';

// pg supports queryMode: 'extended' in its runtime QueryConfig (forces the
// single-statement prepared-query protocol) but @types/pg predates the field.
type ExtendedQueryConfig = QueryConfig & { queryMode: 'extended' };

export type PostgresConnectionInput = {
	host: string;
	port?: number;
	user: string;
	password: string;
	database: string;
	// prisma postgres endpoints are served over TLS; every connection
	// verifies the server certificate unless explicitly disabled
	sslRejectUnauthorized?: boolean;
};

export type PostgresQueryResult = {
	rows: Record<string, unknown>[];
	rowCount: number | null;
	command: string;
};

// Read-only guard. SQL is classified by a single linear-time scan that mirrors
// PostgreSQL lexical rules for string literals, quoted identifiers, dollar
// quoting, and (nesting) block comments, so keywords are only recognized in
// real SQL code. The maximum length is bounded to keep validation cheap and
// deterministic on uncontrolled input (fixes the polynomial-regex finding).
const MAX_SQL_LENGTH = 64 * 1024;

type ScanState =
	| 'code'
	| 'string' // standard '...' (standard_conforming_strings=on: no backslash escapes)
	| 'estring' // E'...' escape string: backslash escapes
	| 'ident' // "..." quoted identifier
	| 'lineComment'
	| 'blockComment'
	| 'dollarQuote';

const TRANSACTION_CONTROL = new Set([
	'commit',
	'rollback',
	'abort',
	'begin',
	'start',
	'end',
	'checkpoint',
]);

// Functions whose invocation has operational side effects even inside a
// read-only transaction: advisory locks, remote writes via dblink, sequence
// mutation (beyond the nextval/setval tokens), configuration/snapshot and
// large-object writes, and backend control. The read-only endpoint refuses
// SELECTs that reference them so a read-only classification can never be
// stretched into server disruption.
const SIDE_EFFECT_FUNCTIONS = new Set([
	// advisory locks acquire/release session-level resources
	'pg_advisory_lock',
	'pg_advisory_lock_shared',
	'pg_advisory_unlock',
	'pg_advisory_unlock_all',
	'pg_advisory_unlock_shared',
	'pg_advisory_xact_lock',
	'pg_advisory_xact_lock_shared',
	'pg_try_advisory_lock',
	'pg_try_advisory_lock_shared',
	'pg_try_advisory_xact_lock',
	'pg_try_advisory_xact_lock_shared',
	// dblink runs statements on a remote server through its own connection
	'dblink',
	'dblink_cancel_query',
	'dblink_close',
	'dblink_connect',
	'dblink_connect_u',
	'dblink_disconnect',
	'dblink_exec',
	'dblink_get_result',
	'dblink_open',
	'dblink_send_query',
	'dblink_send_query_async',
	// session/system mutation
	'set_config',
	'pg_cancel_backend',
	'pg_terminate_backend',
	'pg_reload_conf',
	'pg_rotate_logfile',
	'pg_log_backend_memory_contexts',
	'pg_notify',
	'pg_listen',
	'pg_unlisten',
	'pg_switch_wal',
	'pg_switch_xlog',
	'pg_create_restore_point',
	'pg_promote',
	'pg_import_snapshot',
	'pg_export_snapshot',
	'pg_write_restartpoint_dir',
	'pg_switch_redaction',
	// large objects write to the database
	'lo_import',
	'lo_import_with_oid',
	'lo_export',
	'lo_unlink',
	'lo_create',
	'lo_creat',
	'lo_from_bytea',
	'lo_put',
	'lo_open',
	'lo_write',
	'lo_truncate',
	'lo_truncate64',
	'lo_lseek',
	'lo_lseek64',
	'lo_close',
	'lo_tell',
	'lo_tell64',
	// logical replication emission
	'pg_logical_emit_message',
	'pg_replication_origin_create',
	'pg_replication_origin_drop',
	'pg_replication_origin_setup',
	'pg_replication_origin_reset',
	'pg_replication_origin_xact_setup',
	'pg_replication_origin_xact_reset',
	'pg_replication_origin_advance',
]);

/**
 * Returns true when the statement is a pure read-only SELECT.
 *
 * Parsing follows PostgreSQL (standard_conforming_strings=on):
 * - `'...'` strings escape a quote by doubling it (`''`); a backslash is NOT an
 *   escape, so `'...\' ; COMMIT` cannot hide the `COMMIT` from this scanner the
 *   way it would a scanner that assumes C-style backslash escapes.
 * - `E'...'`/`U&'...'` strings do support backslash escapes (`\'`, `\\`).
 * - `"..."` quoted identifiers escape by doubling (`""`).
 * - `--` line comments and nestable `/* ... *\/` block comments are skipped.
 * - `$tag$ ... $tag$` dollar-quoted strings are skipped.
 *
 * Only an unquoted top-level `SELECT` prefix is accepted (WITH is rejected so
 * CTE-hidden mutations like `WITH x AS (DELETE ...) RETURNING *` fail), any
 * top-level `;` (multi-statement), transaction-control tokens, `SELECT INTO`,
 * row-lock `FOR UPDATE/SHARE` forms, sequence-mutating `nextval`/`setval`,
 * and functions whose invocation carries side effects even inside a read-only
 * transaction (advisory locks, dblink remote writes, large-object writes,
 * backend/config control — see `SIDE_EFFECT_FUNCTIONS`) are rejected, and
 * every keyword check runs only in plain code — never inside literals,
 * identifiers, or comments.
 */
export function isReadOnlySql(sql: string): boolean {
	if (sql.length > MAX_SQL_LENGTH) return false;

	const s = sql;
	const n = s.length;
	let i = 0;

	const isWordChar = (ch: string): boolean => /[A-Za-z0-9_$]/.test(ch);

	// skip leading whitespace and optional wrapping `(`
	while (i < n && /\s/.test(s.charAt(i))) i += 1;
	while (i < n && s.charAt(i) === '(') i += 1;
	while (i < n && /\s/.test(s.charAt(i))) i += 1;

	// must start with SELECT (case-insensitive, followed by a non-word char)
	if (!/^select\b/i.test(s.slice(i, Math.min(i + 16, n)))) {
		return false;
	}

	let state: ScanState = 'code';
	let blockDepth = 0;
	let dollarTag = '';
	let sawSelectInto = false;
	let sawRowLock = false;
	let sawSequenceMutation = false;
	let sawSideEffectFunction = false;
	let pendingFor = false;

	while (i < n) {
		const c = s.charAt(i);
		const next = s.charAt(i + 1);

		switch (state) {
			case 'lineComment':
				if (c === '\n' || c === '\r') state = 'code';
				i += 1;
				continue;
			case 'blockComment':
				if (c === '/' && next === '*') {
					blockDepth += 1;
					i += 2;
					continue;
				}
				if (c === '*' && next === '/') {
					blockDepth -= 1;
					if (blockDepth === 0) state = 'code';
					i += 2;
					continue;
				}
				i += 1;
				continue;
			case 'string':
				if (c === "'" && next === "'") {
					i += 2;
					continue;
				}
				if (c === "'") state = 'code';
				i += 1;
				continue;
			case 'estring':
				if (c === '\\') {
					i += 2;
					continue;
				}
				if (c === "'" && next === "'") {
					i += 2;
					continue;
				}
				if (c === "'") state = 'code';
				i += 1;
				continue;
			case 'ident':
				if (c === '"' && next === '"') {
					i += 2;
					continue;
				}
				if (c === '"') state = 'code';
				i += 1;
				continue;
			case 'dollarQuote':
				if (c === '$' && s.startsWith(dollarTag, i)) {
					state = 'code';
					i += dollarTag.length;
					continue;
				}
				i += 1;
				continue;
			default:
				break;
		}

		// code state: classify tokens
		if (c === '-' && next === '-') {
			state = 'lineComment';
			i += 2;
			continue;
		}
		if (c === '/' && next === '*') {
			state = 'blockComment';
			blockDepth = 1;
			i += 2;
			continue;
		}
		if (c === "'") {
			state = 'string';
			i += 1;
			continue;
		}
		if (c === '"') {
			state = 'ident';
			i += 1;
			continue;
		}
		if (c === '$') {
			const tagMatch = /^\$[A-Za-z0-9_]*\$/.exec(
				s.slice(i, Math.min(i + 64, n)),
			);
			if (tagMatch) {
				state = 'dollarQuote';
				dollarTag = tagMatch[0];
				i += dollarTag.length;
				continue;
			}
		}
		if (c === ';') return false;

		if (isWordChar(c)) {
			let j = i;
			while (j < n && isWordChar(s.charAt(j))) j += 1;
			const word = s.slice(i, j).toLowerCase();

			// E'...' / U&'...' strings use backslash escapes
			if (word === 'e' && s.charAt(j) === "'") {
				state = 'estring';
				i = j + 1;
				continue;
			}
			if (word === 'u' && s.charAt(j) === '&' && s.charAt(j + 1) === "'") {
				state = 'estring';
				i = j + 2;
				continue;
			}

			if (TRANSACTION_CONTROL.has(word)) return false;
			if (word === 'into') sawSelectInto = true;
			if (word === 'nextval' || word === 'setval') sawSequenceMutation = true;
			// Only flag a side-effect function when it is actually invoked:
			// the word is treated as a call when '(' follows (whitespace
			// tolerated), so columns/values that merely share the name stay
			// allowed.
			if (SIDE_EFFECT_FUNCTIONS.has(word)) {
				let k = j;
				while (k < n && /\s/.test(s.charAt(k))) k += 1;
				if (s.charAt(k) === '(') sawSideEffectFunction = true;
			}
			// Row-lock forms: FOR UPDATE | FOR SHARE | FOR NO KEY UPDATE |
			// FOR KEY SHARE. Row locks serialize on rows so a read-only query
			// must not hold them. Detect via a one-token lookahead instead of
			// slicing the remainder of the buffer on every `for` token.
			if (word === 'for') {
				pendingFor = true;
			} else if (pendingFor) {
				if (
					word === 'update' ||
					word === 'share' ||
					word === 'no' ||
					word === 'key'
				) {
					sawRowLock = true;
				}
				pendingFor = false;
			}
			i = j;
			continue;
		}

		i += 1;
	}

	if (
		sawSelectInto ||
		sawRowLock ||
		sawSequenceMutation ||
		sawSideEffectFunction
	)
		return false;
	return true;
}

function assertReadOnlyQuery(sql: string): void {
	if (!isReadOnlySql(sql)) {
		throw new Error(
			'[prisma] read-only SQL endpoint rejected a non-SELECT statement',
		);
	}
}

function postgresClientConfig(connection: PostgresConnectionInput) {
	return {
		host: connection.host,
		port: connection.port ?? 5432,
		user: connection.user,
		password: connection.password,
		database: connection.database,
		ssl: {
			rejectUnauthorized: connection.sslRejectUnauthorized ?? true,
		},
		connectionTimeoutMillis: 10_000,
		query_timeout: 30_000,
	};
}

function toQueryResult(result: {
	rows?: unknown[];
	rowCount?: number | null;
	command?: string;
}): PostgresQueryResult {
	return {
		rows: (result.rows ?? []) as Record<string, unknown>[],
		rowCount: result.rowCount ?? null,
		command: result.command ?? '',
	};
}

/**
 * Executes a statement against a Postgres instance over the wire protocol
 * with TLS. Read-only mode only permits SELECT statements so read paths can
 * never mutate data; write mode allows INSERT/UPDATE/DELETE/DDL.
 */
export async function executePostgresQuery(
	connection: PostgresConnectionInput,
	sql: string,
	params: unknown[],
	mode: 'read' | 'write',
): Promise<PostgresQueryResult> {
	if (mode === 'read') {
		assertReadOnlyQuery(sql);
	}

	const client = new Client(postgresClientConfig(connection));
	const queryParams = Array.isArray(params) ? params : [];

	try {
		await client.connect();
		if (mode !== 'read') {
			const result = await client.query(sql, queryParams);
			return toQueryResult(result);
		}

		// Enforce read-only at the connection session, not just in the first
		// transaction: even a statement smuggling `COMMIT` opens a new
		// transaction that stays read-only, and any function that bypasses the
		// scanner's SELECT check still cannot start DDL/DML.
		await client.query('SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY');
		await client.query('BEGIN READ ONLY');
		try {
			// queryMode: 'extended' forces the wire protocol's single-statement
			// prepared-query path, so multi-statement payloads (`...; DROP ...`)
			// are rejected by the server even if they slip past the scan.
			const result = await client.query({
				text: sql,
				values: queryParams,
				queryMode: 'extended',
			} as ExtendedQueryConfig);
			await client.query('COMMIT');
			return toQueryResult(result);
		} catch (error) {
			try {
				await client.query('ROLLBACK');
			} catch {
				// the original query error is the one callers need
			}
			throw error;
		}
	} finally {
		await client.end();
	}
}

export type TableColumn = {
	name: string;
	type: string;
	nullable: boolean;
	default: string | null;
};

export type TableForeignKey = {
	column: string;
	foreignTable: string;
	foreignColumn: string;
};

export type SchemaTable = {
	schema: string;
	name: string;
	columns: TableColumn[];
	foreignKeys: TableForeignKey[];
};

export type SchemaInspection = {
	tables: SchemaTable[];
};

const COLUMNS_SQL = `
SELECT table_schema, table_name, column_name, data_type, is_nullable,
       column_default, ordinal_position
FROM information_schema.columns
WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY table_schema, table_name, ordinal_position;
`;

const FOREIGN_KEYS_SQL = `
SELECT tc.table_schema, tc.table_name, kcu.column_name,
       ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
 AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
 AND tc.table_schema = ccu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY tc.table_schema, tc.table_name, kcu.ordinal_position;
`;

/**
 * Inspects a database schema by querying the information_schema over the
 * postgres wire protocol. Returns tables with their columns and foreign keys.
 */
export async function inspectPostgresSchema(
	connection: PostgresConnectionInput,
): Promise<SchemaInspection> {
	const client = new Client(postgresClientConfig(connection));

	try {
		await client.connect();
		const columns = await client.query(COLUMNS_SQL);
		const foreignKeys = await client.query(FOREIGN_KEYS_SQL);

		// group columns by table
		const tableMap = new Map<
			string,
			{
				schema: string;
				name: string;
				columns: TableColumn[];
				foreignKeys: TableForeignKey[];
			}
		>();
		const keyOf = (schema: string, name: string) => `${schema}.${name}`;

		for (const row of columns.rows) {
			const key = keyOf(row.table_schema, row.table_name);
			let table = tableMap.get(key);
			if (!table) {
				table = {
					schema: row.table_schema,
					name: row.table_name,
					columns: [],
					foreignKeys: [],
				};
				tableMap.set(key, table);
			}
			table.columns.push({
				name: row.column_name,
				type: row.data_type,
				nullable: row.is_nullable === 'YES',
				default: row.column_default ?? null,
			});
		}

		for (const row of foreignKeys.rows) {
			const key = keyOf(row.table_schema, row.table_name);
			const table = tableMap.get(key);
			if (!table) continue;
			table.foreignKeys.push({
				column: row.column_name,
				foreignTable: row.foreign_table,
				foreignColumn: row.foreign_column,
			});
		}

		return { tables: [...tableMap.values()] };
	} finally {
		await client.end();
	}
}
