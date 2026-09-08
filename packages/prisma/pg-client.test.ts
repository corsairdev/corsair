import { Client } from 'pg';
import {
	executePostgresQuery,
	inspectPostgresSchema,
	isReadOnlySql,
} from './pg-client';

jest.mock('pg', () => {
	const query = jest.fn();
	const connect = jest.fn();
	const end = jest.fn();
	const Client = jest.fn().mockImplementation(() => ({
		connect,
		query,
		end,
	}));
	return { Client, query, connect, end };
});

const MockClient = Client as unknown as jest.Mock;
const pgMocks = jest.requireMock('pg') as {
	query: jest.Mock;
	connect: jest.Mock;
	end: jest.Mock;
};

const connection = {
	host: 'db.prisma.io',
	user: 'u',
	password: 'p',
	database: 'd',
};

function stubSuccessfulQuery() {
	pgMocks.query.mockImplementation(async (sql: string) => {
		if (typeof sql === 'string' && /^BEGIN/i.test(sql)) {
			return { rows: [], rowCount: 0, command: 'BEGIN' };
		}
		if (sql === 'COMMIT' || sql === 'ROLLBACK') {
			return { rows: [], rowCount: 0, command: sql };
		}
		return { rows: [{ id: 1 }], rowCount: 1, command: 'SELECT' };
	});
}

describe('executePostgresQuery', () => {
	beforeEach(() => {
		MockClient.mockClear();
		pgMocks.query.mockReset();
		pgMocks.connect.mockReset();
		pgMocks.end.mockReset();
		pgMocks.connect.mockResolvedValue(undefined);
		pgMocks.end.mockResolvedValue(undefined);
		stubSuccessfulQuery();
	});

	it('verifies TLS certificates by default', async () => {
		await executePostgresQuery(connection, 'SELECT 1', [], 'read');
		expect(MockClient).toHaveBeenCalledWith(
			expect.objectContaining({
				ssl: { rejectUnauthorized: true },
				connectionTimeoutMillis: 10_000,
				query_timeout: 30_000,
			}),
		);
	});

	it('runs read queries inside a READ ONLY transaction', async () => {
		await executePostgresQuery(connection, 'SELECT 1', [], 'read');

		const calls = pgMocks.query.mock.calls.map((call) => call[0]);
		expect(calls[0]).toBe(
			'SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY',
		);
		expect(calls[1]).toBe('BEGIN READ ONLY');
		expect(calls[2]).toMatchObject({
			text: 'SELECT 1',
			values: [],
			queryMode: 'extended',
		});
		expect(calls[3]).toBe('COMMIT');
	});

	it('forces the extended protocol for the read query', async () => {
		await executePostgresQuery(connection, 'SELECT $1::int AS n', [7], 'read');
		const queryCall = pgMocks.query.mock.calls.find(
			(call) => call[0] && typeof call[0] === 'object',
		);
		expect(queryCall).toBeDefined();
		expect(queryCall[0]).toMatchObject({
			text: 'SELECT $1::int AS n',
			values: [7],
			queryMode: 'extended',
		});
	});

	it('rejects SELECT INTO and multi-statement queries before connecting', async () => {
		await expect(
			executePostgresQuery(
				connection,
				'SELECT * INTO stolen FROM users',
				[],
				'read',
			),
		).rejects.toThrow(/non-SELECT|read-only/i);
		await expect(
			executePostgresQuery(
				connection,
				'SELECT 1; INSERT INTO users VALUES (1)',
				[],
				'read',
			),
		).rejects.toThrow(/non-SELECT|read-only/i);
		expect(MockClient).not.toHaveBeenCalled();
	});
});

describe('inspectPostgresSchema', () => {
	beforeEach(() => {
		MockClient.mockClear();
		pgMocks.query.mockReset();
		pgMocks.connect.mockReset();
		pgMocks.end.mockReset();
		pgMocks.connect.mockResolvedValue(undefined);
		pgMocks.end.mockResolvedValue(undefined);
		pgMocks.query.mockResolvedValue({ rows: [] });
	});

	it('verifies TLS certificates by default', async () => {
		await inspectPostgresSchema(connection);
		expect(MockClient).toHaveBeenCalledWith(
			expect.objectContaining({
				ssl: { rejectUnauthorized: true },
				connectionTimeoutMillis: 10_000,
				query_timeout: 30_000,
			}),
		);
	});
});
describe('isReadOnlySql token-aware validation', () => {
	it('accepts plain SELECTs', () => {
		expect(isReadOnlySql('SELECT * FROM users')).toBe(true);
		expect(isReadOnlySql('  SELECT 1')).toBe(true);
		expect(isReadOnlySql('(SELECT 1)')).toBe(true);
	});

	it('rejects mutations and DML', () => {
		expect(isReadOnlySql('DROP TABLE users')).toBe(false);
		expect(isReadOnlySql('INSERT INTO users (id) VALUES (1)')).toBe(false);
		expect(isReadOnlySql('UPDATE users SET id = 1')).toBe(false);
		expect(isReadOnlySql('DELETE FROM users')).toBe(false);
	});

	it('rejects WITH queries because they are not a plain SELECT', () => {
		// A top-level WITH cannot start a read-only query, so both CTE-based
		// mutations and read-only CTEs with a trailing SELECT are rejected.
		expect(
			isReadOnlySql(
				'WITH x AS (DELETE FROM users RETURNING *) SELECT * FROM x',
			),
		).toBe(false);
		expect(
			isReadOnlySql(
				'WITH x AS (UPDATE users SET id = 1 RETURNING *) SELECT * FROM x',
			),
		).toBe(false);
		expect(isReadOnlySql('WITH x AS (SELECT 1) SELECT * FROM x')).toBe(false);
	});

	it('rejects SELECT INTO and row-lock forms', () => {
		expect(isReadOnlySql('SELECT * INTO newtab FROM oldtab')).toBe(false);
		expect(isReadOnlySql('SELECT * FROM users FOR UPDATE')).toBe(false);
		expect(isReadOnlySql('SELECT * FROM users FOR SHARE')).toBe(false);
	});

	it('ignores keywords inside string literals and quoted identifiers', () => {
		expect(isReadOnlySql("SELECT 'for update' AS note")).toBe(true);
		expect(isReadOnlySql('SELECT "into" FROM users')).toBe(true);
		expect(isReadOnlySql("SELECT 'in; no comment' AS note")).toBe(true);
	});

	it('ignores keywords inside comments', () => {
		expect(isReadOnlySql('SELECT * -- for update\n FROM users')).toBe(true);
		expect(isReadOnlySql('SELECT * /* into */ FROM users')).toBe(true);
	});

	it('rejects multi-statement input', () => {
		expect(isReadOnlySql('SELECT 1; INSERT INTO t VALUES (1)')).toBe(false);
		expect(isReadOnlySql("SELECT 'a;b'; SELECT 2")).toBe(false);
	});

	it('rejects oversized input quickly', () => {
		const big = 'SELECT 1' + ' '.repeat(70 * 1024);
		expect(isReadOnlySql(big)).toBe(false);
	});

	it('cannot hide COMMIT behind a backslash (standard_conforming_strings)', () => {
		// PostgreSQL standard strings do NOT treat backslash as an escape, so the
		// string ends at the quote right after it and the ';' starts a second
		// statement — a scanner that skips \' would miss the COMMIT entirely.
		expect(isReadOnlySql("SELECT '\\'; COMMIT; DROP TABLE users; --'")).toBe(
			false,
		);
		expect(isReadOnlySql("SELECT 'a\\'; ROLLBACK; SELECT 1; --'")).toBe(false);
	});

	it('still accepts literal backslashes in standard strings', () => {
		expect(isReadOnlySql("SELECT * FROM t WHERE path LIKE 'C:\\Users%'")).toBe(
			true,
		);
	});

	it('handles doubled-quote escapes in standard strings', () => {
		expect(isReadOnlySql("SELECT 'it''s'")).toBe(true);
		expect(isReadOnlySql("SELECT 'a'''; COMMIT")).toBe(false);
	});

	it('handles E-string backslash escapes correctly', () => {
		expect(isReadOnlySql("SELECT E'it\\'s'")).toBe(true);
		// escaped backslash then closing quote: '; COMMIT' is a real boundary
		expect(isReadOnlySql("SELECT E'x\\\\'; COMMIT; DROP TABLE t; --'")).toBe(
			false,
		);
	});

	it('handles nesting block comments', () => {
		expect(isReadOnlySql('SELECT /* a /* b */ c */ 1')).toBe(true);
		expect(isReadOnlySql("SELECT /* ' */ ; COMMIT; -- '")).toBe(false);
	});

	it('handles dollar-quoted strings', () => {
		expect(isReadOnlySql('SELECT $$hello; world$$')).toBe(true);
		expect(isReadOnlySql('SELECT $tag$; DROP$tag$ FROM t')).toBe(true);
		expect(isReadOnlySql('SELECT $$x$$; COMMIT')).toBe(false);
	});

	it('rejects transaction-control tokens in plain code', () => {
		expect(isReadOnlySql('SELECT 1 FROM t COMMIT')).toBe(false);
		expect(isReadOnlySql('SELECT rollback FROM t')).toBe(false);
	});

	it('rejects sequence-mutating functions', () => {
		expect(isReadOnlySql("SELECT nextval('s')")).toBe(false);
		expect(isReadOnlySql("SELECT setval('s', 1)")).toBe(false);
	});

	it('rejects side-effecting and unknown function calls (allowlist)', () => {
		expect(isReadOnlySql("SELECT pg_advisory_lock('k')")).toBe(false);
		expect(isReadOnlySql("SELECT pg_advisory_xact_lock('k')")).toBe(false);
		expect(isReadOnlySql("SELECT pg_try_advisory_lock('k')")).toBe(false);
		expect(
			isReadOnlySql("SELECT dblink('conn','INSERT INTO t VALUES (1)')"),
		).toBe(false);
		expect(isReadOnlySql("SELECT dblink_exec('conn', 'DELETE FROM t')")).toBe(
			false,
		);
		expect(isReadOnlySql("SELECT lo_import('/etc/passwd')")).toBe(false);
		expect(isReadOnlySql("SELECT set_config('x.a', '1', false)")).toBe(false);
		expect(isReadOnlySql('SELECT pg_terminate_backend(42)')).toBe(false);
		expect(isReadOnlySql('SELECT pg_cancel_backend(42)')).toBe(false);
		// functions Greptile specifically called out that a denylist missed
		expect(isReadOnlySql('SELECT pg_sleep(30)')).toBe(false);
		expect(isReadOnlySql('SELECT pg_stat_reset()')).toBe(false);
		expect(isReadOnlySql('SELECT pg_stat_clear_snapshot()')).toBe(false);
		// any unknown or user-defined function is rejected by default
		expect(isReadOnlySql('SELECT my_custom_function(1)')).toBe(false);
		expect(isReadOnlySql('SELECT public.my_custom_function(1)')).toBe(false);
		// quoted invocations of unlisted functions are rejected too
		expect(isReadOnlySql("SELECT \"dblink\"('c', 'INSERT')")).toBe(false);
		// ...but a quoted identifier that is not invoked stays allowed
		expect(isReadOnlySql('SELECT "pg_advisory_lock" FROM functions')).toBe(
			true,
		);
		// string literals never trigger the check
		expect(isReadOnlySql("SELECT 'dblink' AS note")).toBe(true);
	});

	it('sees through comments between a function name and its parenthesis', () => {
		// PostgreSQL treats comments as token separators, so every one of these
		// is a real function call on the server; a whitespace-only lookahead
		// misses the '(' and lets unlisted side-effecting functions run.
		expect(isReadOnlySql('SELECT pg_sleep /*comment*/ (30)')).toBe(false);
		expect(
			isReadOnlySql("SELECT dblink_exec /*comment*/ ('conn', 'DELETE FROM t')"),
		).toBe(false);
		expect(isReadOnlySql('SELECT pg_sleep -- comment\n(30)')).toBe(false);
		expect(isReadOnlySql('SELECT pg_sleep -- comment\r(30)')).toBe(false);
		expect(
			isReadOnlySql(
				'SELECT pg_sleep /* outer /* inner */ still comment */ (30)',
			),
		).toBe(false);
		expect(isReadOnlySql('SELECT pg_sleep\n/* mixed */\n-- line\n(30)')).toBe(
			false,
		);
		// quoted invocations get the same comment-aware treatment
		expect(isReadOnlySql('SELECT "pg_sleep" /*comment*/ (30)')).toBe(false);
		expect(isReadOnlySql("SELECT \"dblink\" -- comment\n('c', 'x')")).toBe(
			false,
		);
		// allowlisted names still pass when a comment intervenes
		expect(isReadOnlySql('SELECT count /* tally */ (*) FROM users')).toBe(true);
		expect(
			isReadOnlySql('SELECT * FROM generate_series -- series\n(1, 3)'),
		).toBe(true);
		// the AS alias column-list exemption still works across comments
		expect(
			isReadOnlySql(
				'SELECT * FROM generate_series(1, 3) AS /* cols */ t(a, b)',
			),
		).toBe(true);
		// a comment between a non-call word and '(' is not a call site
		expect(isReadOnlySql('SELECT 1 AS /* alias */ total FROM users')).toBe(
			true,
		);
	});

	it('accepts quoted alias column lists after AS, comments included', () => {
		// FROM f(x) AS "series" (value) — the quoted name is a table alias and
		// the parens hold output-column names, not a function invocation.
		expect(
			isReadOnlySql('SELECT * FROM generate_series(1, 3) AS "series"(value)'),
		).toBe(true);
		expect(
			isReadOnlySql(
				'SELECT * FROM generate_series(1, 3) AS "series" /* comment */ (value)',
			),
		).toBe(true);
		expect(
			isReadOnlySql(
				'SELECT * FROM generate_series(1, 3) AS /* c */ "series" (value)',
			),
		).toBe(true);
		// the exemption does not extend past the alias: unsafe calls anywhere
		// else — including inside the column list — are still rejected
		expect(isReadOnlySql("SELECT \"dblink\"('c', 'INSERT')")).toBe(false);
		expect(isReadOnlySql('SELECT "pg_sleep" /*c*/ (30)')).toBe(false);
		expect(
			isReadOnlySql(
				'SELECT * FROM generate_series(1, 3) AS "series"(pg_sleep(1))',
			),
		).toBe(false);
		// and a quoted name followed by '(' without AS is still treated as a call
		expect(isReadOnlySql('SELECT "pg_stat_reset"()')).toBe(false);
	});

	it('accepts allowlisted built-in calls and keyword constructs', () => {
		expect(isReadOnlySql('SELECT count(*) FROM users')).toBe(true);
		expect(isReadOnlySql('SELECT max(id), sum(amount) FROM users')).toBe(true);
		expect(
			isReadOnlySql(
				"SELECT lower(name), trim(' x '), length(nickname) FROM users",
			),
		).toBe(true);
		expect(isReadOnlySql('SELECT coalesce(email, phone) FROM users')).toBe(
			true,
		);
		expect(isReadOnlySql('SELECT now(), current_date FROM users')).toBe(true);
		expect(
			isReadOnlySql(
				'SELECT * FROM users WHERE id IN (1, 2) AND (active OR EXISTS (SELECT 1 FROM orgs))',
			),
		).toBe(true);
		expect(
			isReadOnlySql('SELECT count(*) FILTER (WHERE active > 0) FROM users'),
		).toBe(true);
		expect(
			isReadOnlySql(
				'SELECT rank() OVER (PARTITION BY org_id ORDER BY created_at) FROM users',
			),
		).toBe(true);
		expect(isReadOnlySql('SELECT * FROM users JOIN orgs USING (org_id)')).toBe(
			true,
		);
		expect(isReadOnlySql('SELECT CAST(id AS numeric(10, 2)) FROM users')).toBe(
			true,
		);
		expect(isReadOnlySql('SELECT pg_catalog.version()')).toBe(true);
		expect(
			isReadOnlySql(
				'SELECT (SELECT count(*) FROM orgs) AS org_count FROM users',
			),
		).toBe(true);
		// function-call-style casts of types
		expect(isReadOnlySql("SELECT int4('42')")).toBe(true);
		expect(isReadOnlySql('SELECT text(7)')).toBe(true);
	});

	it('rejects data-modifying keywords anywhere, including subquery CTEs', () => {
		expect(
			isReadOnlySql(
				'SELECT * FROM (WITH t AS (DELETE FROM users RETURNING *) SELECT * FROM t) s',
			),
		).toBe(false);
		expect(
			isReadOnlySql(
				'SELECT * FROM (WITH t AS (INSERT INTO users VALUES (1) RETURNING *) SELECT * FROM t) s',
			),
		).toBe(false);
		expect(
			isReadOnlySql(
				'SELECT * FROM (WITH t AS (UPDATE users SET id = 1 RETURNING *) SELECT * FROM t) s',
			),
		).toBe(false);
		// WITH itself is disallowed everywhere (read-only queries must be a
		// plain top-level SELECT), so even a read-only CTE subquery is refused
		// rather than trusted to not hide a mutation.
		expect(
			isReadOnlySql(
				'SELECT * FROM (WITH t AS (SELECT 1 AS x) SELECT * FROM t) s',
			),
		).toBe(false);
	});

	it('ends line comments at carriage returns too', () => {
		// CR-only and CRLF line endings must close the comment; otherwise a
		// scanner that only looks for \n would swallow a following statement.
		expect(isReadOnlySql('SELECT 1 -- note\r; COMMIT')).toBe(false);
		expect(isReadOnlySql('SELECT 1 -- note\r\n; COMMIT')).toBe(false);
		expect(isReadOnlySql('SELECT 1 -- note\r\nFROM users')).toBe(true);
	});

	it('rejects row-lock variants after FOR', () => {
		expect(isReadOnlySql('SELECT * FROM users FOR UPDATE')).toBe(false);
		expect(isReadOnlySql('SELECT * FROM users FOR SHARE')).toBe(false);
		expect(isReadOnlySql('SELECT * FROM users FOR NO KEY UPDATE')).toBe(false);
		expect(isReadOnlySql('SELECT * FROM users FOR KEY SHARE')).toBe(false);
		// "for" used as an alias or in prose is not a row lock
		expect(isReadOnlySql('SELECT 1 AS "for"')).toBe(true);
	});
});
