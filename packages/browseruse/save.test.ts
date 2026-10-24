import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
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
	pragma: (source: string) => unknown;
	prepare: (sql: string) => {
		// unknown: bound SQL parameters are whatever the statement received.
		get: (...args: unknown[]) => unknown;
	};
	close: () => void;
};

const ENTITY_DDL = `
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
`;

function openMemory() {
	const sqlite = new Database(':memory:');
	sqlite.exec(ENTITY_DDL);
	const database = createCorsairDatabase(
		// The local handle matches the driver createCorsairDatabase accepts.
		sqlite as unknown as Parameters<typeof createCorsairDatabase>[0],
	);
	return { sqlite, database };
}

function createFileDb(): string {
	const dir = mkdtempSync(path.join(tmpdir(), 'browseruse-save-'));
	const file = path.join(dir, 'corsair.sqlite');
	const sqlite = new Database(file);
	sqlite.pragma('journal_mode = WAL');
	sqlite.pragma('busy_timeout = 8000');
	sqlite.exec(ENTITY_DDL);
	sqlite.close();
	return file;
}

function runWorker(
	dbPath: string,
	patch: Record<string, unknown>,
	holdMs: number,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn(
			'pnpm',
			[
				'exec',
				'tsx',
				'--conditions=dev-source',
				path.resolve(process.cwd(), 'save-worker.ts'),
			],
			{
				cwd: process.cwd(),
				env: {
					...process.env,
					BROWSERUSE_DB: dbPath,
					BROWSERUSE_PATCH: JSON.stringify(patch),
					BROWSERUSE_TEST_HOLD_MS: String(holdMs),
				},
				stdio: ['ignore', 'pipe', 'pipe'],
			},
		);
		let stderr = '';
		child.stderr?.on('data', (chunk: Buffer) => {
			stderr += chunk.toString();
		});
		child.on('exit', (code) => {
			if (code === 0) resolve();
			else reject(new Error(stderr || `worker exited ${code}`));
		});
	});
}

describe('browseruse run saves', () => {
	it('keeps both fields when two processes write the same run', async () => {
		const dbPath = createFileDb();
		const held = runWorker(
			dbPath,
			{ id: 'run-1', status: 'running', task: 'keep me', result: 'rows' },
			400,
		);
		await new Promise((resolve) => setTimeout(resolve, 80));
		const other = runWorker(
			dbPath,
			{ id: 'run-1', status: 'completed', task: 'keep me' },
			0,
		);
		await Promise.all([held, other]);

		const sqlite = new Database(dbPath);
		try {
			const row = sqlite
				.prepare(`SELECT data FROM corsair_entities WHERE entity_id = ?`)
				.get('run-1') as { data: string };
			// The column is the JSON text this plugin stored.
			const data = JSON.parse(row.data) as {
				status: string;
				task: string;
				result: string;
			};
			expect(data.task).toBe('keep me');
			expect(data.result).toBe('rows');
			expect(data.status).toBe('completed');
		} finally {
			sqlite.close();
		}
	}, 20_000);

	it('does not rewind a completed run when a stale running write lands last', async () => {
		const { sqlite, database } = openMemory();
		const ctx = {
			database,
			$getAccountId: async () => 'account-1',
			// as: saveRun only needs the database and the account id.
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
