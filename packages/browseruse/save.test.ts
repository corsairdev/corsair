import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createCorsairDatabase } from 'corsair/db';
import type { BrowserUseSaveContext } from './endpoints/save';
import { saveRun } from './endpoints/save';

// unknown is necessary: better-sqlite3 get() is untyped. A stricter row type is not practical.
type SqliteCell = unknown;

const load = createRequire(path.join(process.cwd(), 'package.json'));
const Database = load(
	path.resolve(process.cwd(), '../corsair/node_modules/better-sqlite3'),
	// as is necessary: createRequire returns an untyped module. A stricter constructor type is not practical.
) as new (
	filename: string,
) => {
	exec: (sql: string) => void;
	pragma: (source: string) => void;
	prepare: (sql: string) => { get: (id: string) => SqliteCell };
	close: () => void;
};

function storedRun(sqlite: {
	// unknown is necessary: better-sqlite3 get() is untyped. A stricter row type is not practical.
	prepare: (sql: string) => { get: (id: string) => SqliteCell };
	close: () => void;
}): { status: string; task?: string; result?: string } {
	const row = sqlite
		.prepare('SELECT data FROM corsair_entities WHERE entity_id = ?')
		.get('run-1');
	if (!row || typeof row !== 'object') throw new Error('missing row');
	const text = Reflect.get(row, 'data');
	if (typeof text !== 'string') throw new Error('missing data');
	// unknown is necessary: JSON.parse is untyped. A stricter parse result is not practical.
	const parsed: unknown = JSON.parse(text);
	if (!parsed || typeof parsed !== 'object') throw new Error('missing json');
	const status = Reflect.get(parsed, 'status');
	const task = Reflect.get(parsed, 'task');
	const result = Reflect.get(parsed, 'result');
	return {
		status: typeof status === 'string' ? status : '',
		task: typeof task === 'string' ? task : undefined,
		result: typeof result === 'string' ? result : undefined,
	};
}

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
		// as is necessary: the loaded driver has no shared Database type. A stricter driver type is not practical.
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
	// unknown is necessary: the worker patch is open JSON. A stricter field type is not practical.
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
			const data = storedRun(sqlite);
			expect(data.task).toBe('keep me');
			expect(data.result).toBe('rows');
			expect(data.status).toBe('completed');
		} finally {
			sqlite.close();
		}
	}, 20_000);

	it('does not rewind a completed run when a stale running write lands last', async () => {
		const { sqlite, database } = openMemory();
		const ctx: BrowserUseSaveContext = {
			key: 'bu_test',
			database,
			$getAccountId: async () => 'account-1',
			db: {
				browsers: {
					findByEntityId: async () => undefined,
					upsertByEntityId: async () => undefined,
				},
				runs: {
					findByEntityId: async () => undefined,
					upsertByEntityId: async () => undefined,
				},
			},
		};
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
			const data = storedRun(sqlite);
			expect(data.status).toBe('completed');
			expect(data.result).toBe('later detail');
		} finally {
			await database.db.destroy();
		}
	});
});
