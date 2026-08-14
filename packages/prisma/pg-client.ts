import { Client } from 'pg';

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

// Read-only guard. SQL is classified by a single linear-time scan that tracks
// string literals, quoted identifiers, and line/block comments so keywords are
// only recognized in real SQL code (CodeQL flagged the prior regex alternatives
// as potentially polynomial on crafted input). The maximum length is bounded to
// keep validation cheap and deterministic on uncontrolled data.
const MAX_SQL_LENGTH = 64 * 1024;

/**
 * Returns true when the statement is a pure read-only SELECT.
 *
 * - Only an unquoted top-level `SELECT` prefix is accepted; `WITH` is rejected
 *   because `WITH x AS (DELETE ...) RETURNING *` is a single-statement mutation
 *   with no second statement / semicolon to detect.
 * - `SELECT ... INTO` (disk writes) and row-lock forms (`FOR UPDATE / FOR
 *   SHARE`) are rejected, but only when they appear as real tokens, not inside
 *   string literals, quoted identifiers, or comments.
 * - A `;` outside literals/comments (multi-statement input) is rejected.
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

	let inString = false;
	let inIdent = false;
	let inLineComment = false;
	let inBlockComment = false;
	let sawForUpdate = false;
	let sawSelectInto = false;

	while (i < n) {
		const c = s.charAt(i);
		const next = s.charAt(i + 1);

		if (inLineComment) {
			if (c === '\n') inLineComment = false;
			i += 1;
			continue;
		}
		if (inBlockComment) {
			if (c === '*' && next === '/') {
				inBlockComment = false;
				i += 2;
			} else {
				i += 1;
			}
			continue;
		}
		if (inString) {
			if (c === '\\') {
				i += 2;
				continue;
			}
			if (c === "'") inString = false;
			i += 1;
			continue;
		}
		if (inIdent) {
			if (c === '"') inIdent = false;
			i += 1;
			continue;
		}

		// line / block comments
		if (c === '-' && next === '-') {
			inLineComment = true;
			i += 2;
			continue;
		}
		if (c === '/' && next === '*') {
			inBlockComment = true;
			i += 2;
			continue;
		}
		// string literal (handle escaped '' and backslash)
		if (c === "'") {
			inString = true;
			i += 1;
			continue;
		}
		// quoted identifier
		if (c === '"') {
			inIdent = true;
			i += 1;
			continue;
		}
		// multi-statement
		if (c === ';') return false;

		// read the next SQL word token (only continues in plain code)
		if (isWordChar(c)) {
			let j = i;
			while (j < n && isWordChar(s.charAt(j))) j += 1;
			const word = s.slice(i, j).toLowerCase();
			if (word === 'into') sawSelectInto = true;
			if (word === 'for') {
				// look ahead for update/share row-lock modes
				const after = s.slice(j).trimStart().toLowerCase();
				if (/^(update|share|no\s+key\s+update|key\s+share)\b/.test(after)) {
					sawForUpdate = true;
				}
			}
			i = j;
			continue;
		}

		i += 1;
	}

	if (sawForUpdate || sawSelectInto) return false;
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

		await client.query('BEGIN READ ONLY');
		try {
			const result = await client.query(sql, queryParams);
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
