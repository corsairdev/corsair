import { createRequire } from 'node:module';
import path from 'node:path';
import { createCorsairDatabase } from 'corsair/db';
import type { BrowserUseSaveContext } from './endpoints/save';
import { saveRun } from './endpoints/save';

const dbPath = process.env.BROWSERUSE_DB;
const patchText = process.env.BROWSERUSE_PATCH;
if (!dbPath || !patchText) {
	throw new Error('BROWSERUSE_DB and BROWSERUSE_PATCH are required');
}

const load = createRequire(path.join(process.cwd(), 'package.json'));
const Database = load(
	path.resolve(process.cwd(), '../corsair/node_modules/better-sqlite3'),
	// as is necessary: createRequire returns an untyped module. A stricter constructor type is not practical.
) as new (
	filename: string,
) => { pragma: (source: string) => void };

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('busy_timeout = 8000');
const database = createCorsairDatabase(
	// as is necessary: the loaded driver has no shared Database type. A stricter driver type is not practical.
	sqlite as unknown as Parameters<typeof createCorsairDatabase>[0],
);
// unknown is necessary: JSON.parse is untyped. A stricter parse result is not practical.
const parsed: unknown = JSON.parse(patchText);
if (!parsed || typeof parsed !== 'object') {
	throw new Error('BROWSERUSE_PATCH must be an object');
}
const id = Reflect.get(parsed, 'id');
const status = Reflect.get(parsed, 'status');
const task = Reflect.get(parsed, 'task');
const result = Reflect.get(parsed, 'result');
if (
	typeof id !== 'string' ||
	(status !== 'queued' &&
		status !== 'dispatching' &&
		status !== 'running' &&
		status !== 'completed' &&
		status !== 'failed' &&
		status !== 'cancelled')
) {
	throw new Error('BROWSERUSE_PATCH needs id and status');
}
const patch = {
	id,
	status,
	...(typeof task === 'string' ? { task } : {}),
	...(typeof result === 'string' ? { result } : {}),
};

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
await saveRun(ctx, patch);
await database.db.destroy();
