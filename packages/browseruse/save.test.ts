import { createRequire } from 'node:module';
import path from 'node:path';
import { createCorsairDatabase } from 'corsair/db';
import { saveRun } from './endpoints/save';

const load = createRequire(path.join(process.cwd(), 'package.json'));
// better-sqlite3 has no typed export on this package. The constructor is the slice the test calls.
const Database = load(
	path.resolve(process.cwd(), '../corsair/node_modules/better-sqlite3'),
) as new (
	filename: string,
) => {
	exec: (sql: string) => void;
	prepare: (sql: string) => { get: (...args: unknown[]) => unknown };
	close: () => void;
};

function openDb() {
	const sqlite = new Database(':memory:');
	sqlite.exec(`
		CREATE TABLE corsair_entities (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL,
			entity_id TEXT NOT NULL,
			entity_type TEXT NOT NULL,
			version TEXT NOT NULL,
			data TEXT NOT NULL
		);
	`);
	const database = createCorsairDatabase(
		// The local handle matches the driver createCorsairDatabase accepts.
		sqlite as unknown as Parameters<typeof createCorsairDatabase>[0],
	);
	return { sqlite, database };
}

describe('browseruse run saves', () => {
	it('keeps both fields when two processes merge the same run', async () => {
		const { sqlite, database } = openDb();
		const ctx = {
			database,
			$getAccountId: async () => 'account-1',
			// saveRun only needs the database and the account id.
		} as never;
		try {
			await Promise.all([
				saveRun(ctx, {
					id: 'run-1',
					status: 'running',
					task: 'keep me',
					result: 'rows',
				}),
				saveRun(ctx, { id: 'run-1', status: 'completed' }),
			]);
			const row = sqlite
				.prepare(`SELECT data FROM corsair_entities WHERE entity_id = ?`)
				.get('run-1') as { data: string };
			const data = JSON.parse(row.data) as {
				status: string;
				task: string;
				result: string;
			};
			expect(data.task).toBe('keep me');
			expect(data.result).toBe('rows');
			expect(data.status).toBe('completed');
		} finally {
			await database.db.destroy();
		}
	});

	it('does not rewind a completed run when a stale running write lands last', async () => {
		const { sqlite, database } = openDb();
		const ctx = {
			database,
			$getAccountId: async () => 'account-1',
			// saveRun only needs the database and the account id.
		} as never;
		try {
			await saveRun(ctx, {
				id: 'run-1',
				status: 'completed',
				task: 'keep me',
				result: 'rows',
			});
			await saveRun(ctx, {
				id: 'run-1',
				status: 'running',
				result: 'later detail',
			});
			const row = sqlite
				.prepare(`SELECT data FROM corsair_entities WHERE entity_id = ?`)
				.get('run-1') as { data: string };
			const data = JSON.parse(row.data) as {
				status: string;
				result: string;
			};
			expect(data.status).toBe('completed');
			expect(data.result).toBe('later detail');
		} finally {
			await database.db.destroy();
		}
	});
});
