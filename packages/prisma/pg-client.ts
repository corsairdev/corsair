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

// Reserved data-modifying statement keywords. These cannot appear as unquoted
// identifiers in any position in a statement, so rejecting them anywhere in
// plain code also blocks data-modifying CTEs smuggled into subqueries, e.g.
// `SELECT * FROM (WITH t AS (DELETE FROM u RETURNING *) SELECT * FROM t) s`.
const WRITE_STATEMENT_KEYWORDS = new Set([
	'insert',
	'update',
	'delete',
	'merge',
	'with',
	'grant',
	'revoke',
	'truncate',
	'create',
	'alter',
	'drop',
	'call',
	'do',
	'returning',
	'show',
]);

// Allowlist of functions, keyword constructs, and type names that may appear
// as a call site in a read-only SELECT. This is an allowlist, NOT a denylist:
// any identifier directly followed by '(' whose name is not listed here —
// pg_sleep(), pg_stat_reset(), advisory locks, dblink, large-object helpers,
// pg_read_file(), and every user-defined or extension function — is rejected
// before the query touches the server, so an omitted unsafe function can never
// slip through (the previous denylist could always be bypassed by a function
// name that was simply left off the list).
const SAFE_FUNCTIONS = new Set(
	// prettier-ignore
	[
		// SQL keyword constructs that can be followed by '(' in valid SQL:
		// subqueries, set membership, row/type/value constructors, casts,
		// aggregate/window framing, and join/derived-table aliases.
		'select',
		'from',
		'where',
		'and',
		'or',
		'not',
		'in',
		'exists',
		'any',
		'all',
		'some',
		'cast',
		'as',
		'on',
		'using',
		'join',
		'inner',
		'left',
		'right',
		'full',
		'outer',
		'cross',
		'lateral',
		'union',
		'intersect',
		'except',
		'distinct',
		'over',
		'filter',
		'within',
		'group',
		'between',
		'like',
		'ilike',
		'is',
		'asc',
		'desc',
		'nulls',
		'first',
		'last',
		'values',
		'row',
		'array',
		// type names usable as function-style casts: int4('42'), text(7), jsonb(...)
		'int',
		'int2',
		'int4',
		'int8',
		'smallint',
		'integer',
		'bigint',
		'real',
		'float4',
		'float8',
		'double',
		'numeric',
		'decimal',
		'money',
		'boolean',
		'bool',
		'text',
		'varchar',
		'char',
		'bpchar',
		'name',
		'bytea',
		'date',
		'time',
		'timetz',
		'timestamp',
		'timestamptz',
		'interval',
		'oid',
		'json',
		'jsonb',
		'uuid',
		'inet',
		'cidr',
		'macaddr',
		'macaddr8',
		'bit',
		'varbit',
		'tsvector',
		'tsquery',
		'xml',
		'point',
		'line',
		'lseg',
		'box',
		'path',
		'polygon',
		'circle',
		// aggregates
		'count',
		'sum',
		'avg',
		'min',
		'max',
		'array_agg',
		'string_agg',
		'json_agg',
		'jsonb_agg',
		'json_object_agg',
		'jsonb_object_agg',
		'bool_and',
		'bool_or',
		'every',
		'bit_and',
		'bit_or',
		'stddev',
		'stddev_pop',
		'stddev_samp',
		'variance',
		'var_pop',
		'var_samp',
		'corr',
		'covar_pop',
		'covar_samp',
		'regr_slope',
		'regr_intercept',
		'regr_avgx',
		'regr_avgy',
		'regr_count',
		'regr_r2',
		'regr_sxx',
		'regr_sxy',
		'regr_syy',
		'percentile_cont',
		'percentile_disc',
		'mode',
		// window functions
		'row_number',
		'rank',
		'dense_rank',
		'percent_rank',
		'cume_dist',
		'ntile',
		'lag',
		'lead',
		'first_value',
		'last_value',
		'nth_value',
		// string / character
		'ascii',
		'bit_length',
		'btrim',
		'char_length',
		'character_length',
		'chr',
		'concat',
		'concat_ws',
		'format',
		'initcap',
		'left',
		'length',
		'lower',
		'lpad',
		'ltrim',
		'md5',
		'normalize',
		'octet_length',
		'overlay',
		'position',
		'repeat',
		'replace',
		'reverse',
		'right',
		'rpad',
		'rtrim',
		'split_part',
		'strpos',
		'substr',
		'substring',
		'translate',
		'trim',
		'upper',
		'to_char',
		'to_number',
		'quote_ident',
		'quote_literal',
		'quote_nullable',
		'encode',
		'decode',
		'to_hex',
		// pattern matching
		'regexp_like',
		'regexp_match',
		'regexp_matches',
		'regexp_replace',
		'regexp_split_to_array',
		'regexp_split_to_table',
		'regexp_count',
		'regexp_instr',
		'regexp_substr',
		// numeric / math
		'abs',
		'cbrt',
		'ceil',
		'ceiling',
		'degrees',
		'div',
		'exp',
		'factorial',
		'floor',
		'ln',
		'log',
		'log10',
		'mod',
		'pi',
		'power',
		'radians',
		'round',
		'scale',
		'sign',
		'sin',
		'cos',
		'tan',
		'cot',
		'asin',
		'acos',
		'atan',
		'atan2',
		'sinh',
		'cosh',
		'tanh',
		'asinh',
		'acosh',
		'atanh',
		'sqrt',
		'trunc',
		'width_bucket',
		'gcd',
		'lcm',
		// date / time
		'age',
		'clock_timestamp',
		'current_date',
		'current_time',
		'current_timestamp',
		'current_catalog',
		'current_schema',
		'current_schemas',
		'current_user',
		'date_bin',
		'date_part',
		'date_trunc',
		'extract',
		'isfinite',
		'justify_days',
		'justify_hours',
		'justify_interval',
		'localtime',
		'localtimestamp',
		'make_date',
		'make_interval',
		'make_time',
		'make_timestamp',
		'make_timestamptz',
		'now',
		'statement_timestamp',
		'session_user',
		'timeofday',
		'transaction_timestamp',
		'to_date',
		'to_timestamp',
		'user',
		// network / inet
		'abbrev',
		'broadcast',
		'family',
		'host',
		'hostmask',
		'netmask',
		'network',
		'set_masklen',
		'masklen',
		// arrays / sets
		'generate_series',
		'generate_subscripts',
		'unnest',
		'array_append',
		'array_cat',
		'array_dims',
		'array_fill',
		'array_length',
		'array_lower',
		'array_ndims',
		'array_position',
		'array_positions',
		'array_prepend',
		'array_remove',
		'array_replace',
		'array_to_string',
		'cardinality',
		'string_to_array',
		// json / jsonb
		'to_json',
		'to_jsonb',
		'array_to_json',
		'row_to_json',
		'json_build_array',
		'jsonb_build_array',
		'json_build_object',
		'jsonb_build_object',
		'json_object',
		'json_typeof',
		'jsonb_typeof',
		'json_array_length',
		'jsonb_array_length',
		'json_each',
		'jsonb_each',
		'json_extract_path',
		'jsonb_extract_path',
		'json_extract_path_text',
		'jsonb_extract_path_text',
		'json_object_keys',
		'json_populate_record',
		'jsonb_populate_record',
		'json_populate_recordset',
		'jsonb_populate_recordset',
		'json_array_elements',
		'jsonb_array_elements',
		'json_array_elements_text',
		'jsonb_array_elements_text',
		'json_strip_nulls',
		'jsonb_strip_nulls',
		'jsonb_pretty',
		'jsonb_set',
		'jsonb_insert',
		// full text
		'to_tsvector',
		'to_tsquery',
		'plainto_tsquery',
		'phraseto_tsquery',
		'websearch_to_tsquery',
		'ts_rank',
		'ts_rank_cd',
		'ts_headline',
		'setweight',
		'numnode',
		'querytree',
		'strip',
		'get_current_ts_config',
		// uuid / enums / ranges / conditionals / misc
		'gen_random_uuid',
		'enum_first',
		'enum_last',
		'enum_range',
		'coalesce',
		'nullif',
		'greatest',
		'least',
		'version',
		'pg_backend_pid',
		'pg_is_in_recovery',
		'pg_postmaster_start_time',
		'pg_conf_load_time',
		'pg_size_bytes',
		'pg_size_pretty',
		'pg_column_size',
		'pg_relation_size',
		'pg_table_size',
		'pg_total_relation_size',
		'pg_indexes_size',
		'pg_database_size',
		'pg_tablespace_size',
		'col_description',
		'obj_description',
		'shobj_description',
		'format_type',
		'pg_get_expr',
		'pg_get_constraintdef',
		'pg_get_indexdef',
		'pg_get_triggerdef',
		'pg_get_functiondef',
		'pg_get_function_arguments',
		'pg_get_function_identity_arguments',
		'pg_get_function_result',
		'pg_get_keywords',
		'pg_get_partkeydef',
		'pg_get_partition_constraintdef',
		'pg_get_serial_sequence',
		'pg_get_statisticsobjdef_columns',
		'pg_get_userbyid',
		'pg_table_is_visible',
		'pg_type_is_visible',
		'pg_function_is_visible',
		'pg_encoding_to_char',
		'pg_char_to_encoding',
		'pg_typeof',
		'pg_tablespace_location',
	],
);
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
 * row-lock `FOR UPDATE/SHARE` forms, data-modifying keywords (`INSERT`,
 * `UPDATE`, `DELETE`, `MERGE`, ...) anywhere in plain code, and any function
 * invocation whose name is not on the `SAFE_FUNCTIONS` allowlist (including
 * advisory locks, dblink remote writes, large-object writers, `pg_sleep`,
 * `pg_stat_reset`, and every user-defined or extension function) are rejected.
 * A function name and its `(` may be separated by whitespace and comments —
 * `pg_sleep /*c*\/ (30)` is still a call — so the call-site lookahead skips
 * both. Every keyword check runs only in plain code — never inside literals,
 * identifiers, or comments.
 */
export function isReadOnlySql(sql: string): boolean {
	if (sql.length > MAX_SQL_LENGTH) return false;

	const s = sql;
	const n = s.length;
	let i = 0;

	// Unicode-aware word characters: PostgreSQL identifiers can contain
	// non-ASCII letters, so treat any code unit over 0x7f as part of a word
	// token (fails closed — a unicode identifier is never on the allowlist).
	const isWordChar = (ch: string): boolean => {
		const code = ch.charCodeAt(0);
		return (
			/[A-Za-z0-9_$]/.test(ch) ||
			(code > 0x7f &&
				![' ', '\n', '\r', '\t', "'", '"', '(', ')', ';', '.', ','].includes(
					ch,
				))
		);
	};

	// PostgreSQL treats comments as token separators, so a call site can hide
	// its '(' behind whitespace AND comments: `pg_sleep /*c*/ (30)` and
	// `pg_sleep -- c\n(30)` are both function invocations on the server. Skip
	// that trivia here so the allowlist checks below see the real next token —
	// a whitespace-only lookahead would let unlisted functions slip through.
	// Block comments nest, mirroring the main scanner. An unterminated comment
	// runs to end-of-input and simply yields a non-'(' position (the server
	// rejects the statement as a syntax error, so nothing executes).
	const skipSqlTrivia = (from: number): number => {
		let k = from;
		for (;;) {
			while (k < n && /\s/.test(s.charAt(k))) k += 1;
			if (s.charAt(k) === '-' && s.charAt(k + 1) === '-') {
				while (k < n && s.charAt(k) !== '\n' && s.charAt(k) !== '\r') {
					k += 1;
				}
				continue;
			}
			if (s.charAt(k) === '/' && s.charAt(k + 1) === '*') {
				let depth = 1;
				k += 2;
				while (k < n && depth > 0) {
					if (s.charAt(k) === '/' && s.charAt(k + 1) === '*') {
						depth += 1;
						k += 2;
					} else if (s.charAt(k) === '*' && s.charAt(k + 1) === '/') {
						depth -= 1;
						k += 2;
					} else {
						k += 1;
					}
				}
				continue;
			}
			return k;
		}
	};

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
	let prevWord = '';
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
				if (c === '"') {
					state = 'code';
					// A quoted identifier directly followed by '(' is a function
					// invocation with a user-chosen name ("dblink"(...)). Quoted
					// names are never on the allowlist, so reject it — this
					// closes the case where an unlisted unsafe function is called
					// through a quoted identifier. Trivia is skipped so a comment
					// cannot hide the '(' ("dblink" /*c*/ (...) still rejects).
					// Exception: after AS the quoted name is a table alias and
					// the parens hold a column-alias list, not a call — e.g.
					// `FROM f(x) AS "series" /*c*/ (value)`. A real call in that
					// position is a syntax error the server rejects, and the
					// column list itself is scanned normally, so the exemption
					// cannot smuggle an invocation.
					const k = skipSqlTrivia(i + 1);
					if (s.charAt(k) === '(' && prevWord !== 'as') return false;
					// Do not let the AS exemption leak past the alias: clear
					// prevWord so a call right after a quoted alias — e.g.
					// `AS "series"(pg_sleep(1))` — is still classified against
					// the allowlist (the bare-word branch gets this for free by
					// recording the alias name; quoted idents record nothing).
					prevWord = '';
					i += 1;
					continue;
				}
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
			if (WRITE_STATEMENT_KEYWORDS.has(word)) return false;
			if (word === 'into') sawSelectInto = true;
			// Allowlist check for function invocations: a word followed by '('
			// — with only whitespace and/or comments in between, which
			// PostgreSQL treats as token separators — is a call site. Unless it
			// is the `AS` alias column-list form (`FROM f(x) AS t(a, b)` — where
			// `t(a,b)` names output columns and is not a call), the function
			// name must be on the allowlist or the statement is rejected. This
			// is fail-closed: any function not explicitly allowed — pg_sleep(),
			// pg_stat_reset(), advisory locks, dblink, user/extension functions
			// — is refused, and `name /*c*/ (` / `name -- c\n(` cannot hide the
			// call from this check.
			{
				const k = skipSqlTrivia(j);
				if (
					s.charAt(k) === '(' &&
					prevWord !== 'as' &&
					!SAFE_FUNCTIONS.has(word)
				) {
					return false;
				}
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
			prevWord = word;
			i = j;
			continue;
		}

		i += 1;
	}

	if (sawSelectInto || sawRowLock) return false;
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
