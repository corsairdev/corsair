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
		expect(pgMocks.query.mock.calls.map((call) => call[0])).toEqual([
			'BEGIN READ ONLY',
			'SELECT 1',
			'COMMIT',
		]);
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

	it('rejects WITH CTE mutations even without a semicolon', () => {
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
});
