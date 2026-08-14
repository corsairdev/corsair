import { Client } from 'pg';
import { executePostgresQuery, inspectPostgresSchema } from './pg-client';

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
