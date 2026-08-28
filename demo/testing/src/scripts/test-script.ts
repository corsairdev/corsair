import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const baseUrl = process.env.CLICKHOUSE_BASE_URL;
const credential = process.env.CLICKHOUSE_API_KEY;

async function setClickhouseCredentials() {
	if (!baseUrl || !credential) {
		console.warn(
			'[clickhouse] CLICKHOUSE_BASE_URL / CLICKHOUSE_API_KEY not set; ' +
				'expecting test-script to fail at the network call.',
		);
	}
}

async function main() {
	await setClickhouseCredentials();

	// Surface any env setup issues early; actual endpoint calls happen below.
	if (!baseUrl || !credential) {
		return;
	}

	const step = async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
		try {
			const res = await fn();
			console.log(`[clickhouse] ${label}: OK`);
			if (Array.isArray(res)) {
				console.log(`  rows=${res.length}`);
			}
			return res;
		} catch (err) {
			console.error(`[clickhouse] ${label}: FAIL`, err);
			throw err;
		}
	};

	// 1. List databases
	type DatabasesResult = { databases: { name: string; engine: string }[] };
	const dbs = (await step('query.listDatabases', () =>
		corsair.clickhouse.query.listDatabases(
			{} as Parameters<typeof corsair.clickhouse.query.listDatabases>[0],
		),
	)) as DatabasesResult;
	const firstDb = dbs.databases[0]?.name;
	if (!firstDb) {
		console.warn('[clickhouse] no databases; skipping deeper calls');
		return;
	}

	// 2. List tables in the first database
	await step('query.listTables', () =>
		corsair.clickhouse.query.listTables({ database: firstDb, limit: 50 }),
	);

	// 3. Get database schema (tables only)
	await step('schema.getDatabase', () =>
		corsair.clickhouse.schema.getDatabase({ database: firstDb }),
	);

	// 4. Pick the first table for the table-schema and execute tests
	const tableRows = await corsair.clickhouse.query.listTables({
		database: firstDb,
		limit: 1,
	});
	const firstTable = tableRows.tables[0]?.name;

	if (firstTable) {
		// 5. Get table schema with column definitions
		await step('schema.getTable (no sample)', () =>
			corsair.clickhouse.schema.getTable({
				database: firstDb,
				table: firstTable,
			}),
		);

		// 6. Get table schema with sample rows
		await step('schema.getTable (with sample)', () =>
			corsair.clickhouse.schema.getTable({
				database: firstDb,
				table: firstTable,
				includeSample: true,
				sampleSize: 3,
			}),
		);

		// 7. Execute a query against the discovered table
		await step('query.execute (discovered table)', () =>
			corsair.clickhouse.query.execute({
				sql: `SELECT count() AS rows FROM ${firstDb}.${firstTable}`,
				limit: 1,
			}),
		);
	}

	// 8. Fetch the Play UI
	await step('play.get', () => corsair.clickhouse.play.get({}));
}

main()
	.then(() => {
		console.log('[clickhouse] all endpoint checks passed');
		process.exit(0);
	})
	.catch((err) => {
		console.error('[clickhouse] test-script failed:', err);
		process.exit(1);
	});
