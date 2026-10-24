import { createRequire } from 'node:module';
import path from 'node:path';
import { createCorsairDatabase } from 'corsair/db';
import { saveRun } from './endpoints/save';

const dbPath = process.env.BROWSERUSE_DB;
const patchText = process.env.BROWSERUSE_PATCH;
if (!dbPath || !patchText) {
	throw new Error('BROWSERUSE_DB and BROWSERUSE_PATCH are required');
}

const load = createRequire(path.join(process.cwd(), 'package.json'));
// better-sqlite3 has no typed export here. The constructor is the slice this worker calls.
const Database = load(
	path.resolve(process.cwd(), '../corsair/node_modules/better-sqlite3'),
) as new (
	filename: string,
) => { pragma: (source: string) => unknown };

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('busy_timeout = 8000');
const database = createCorsairDatabase(
	// The handle is the driver createCorsairDatabase accepts.
	sqlite as unknown as Parameters<typeof createCorsairDatabase>[0],
);
// unknown: the parent passes one JSON patch. saveRun checks the fields it reads.
const patch = JSON.parse(patchText) as {
	id: string;
	status: 'running' | 'completed';
	task?: string;
	result?: string;
};

await saveRun(
	{
		database,
		$getAccountId: async () => 'account-1',
		// as: the worker only needs the database and the account id.
	} as never,
	patch,
);
await database.db.destroy();
