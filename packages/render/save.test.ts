import { createRequire } from 'node:module';
import path from 'node:path';
import { createCorsair } from 'corsair/core';
import type { createCorsairDatabase } from 'corsair/db';
import { setupCorsair } from 'corsair/setup';
import { render } from './index';

// better-sqlite3 is a driver createCorsairDatabase accepts; the test also
// calls exec/close directly to create and drop the in-memory tables.
type SqliteDatabase = Parameters<typeof createCorsairDatabase>[0] & {
	exec: (sql: string) => void;
	close: () => void;
};
// The driver lives in the corsair package, so it is loaded with require();
// require() returns an untyped module, annotated here with the driver's shape.
const load = createRequire(path.join(process.cwd(), 'package.json'));
const Database: new (filename: string) => SqliteDatabase = load(
	path.resolve(process.cwd(), '../corsair/node_modules/better-sqlite3'),
);

const TABLES = `
	CREATE TABLE corsair_integrations (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		name TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
	);
	CREATE TABLE corsair_accounts (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		tenant_id TEXT NOT NULL, integration_id TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
	);
	CREATE TABLE corsair_entities (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		account_id TEXT NOT NULL, entity_id TEXT NOT NULL, entity_type TEXT NOT NULL,
		version TEXT NOT NULL, data TEXT NOT NULL
	);
	CREATE TABLE corsair_events (
		id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
		account_id TEXT NOT NULL, event_type TEXT NOT NULL, payload TEXT NOT NULL, status TEXT
	);
`;

const team = {
	id: 'tea-cjnxpkdhshc73d12t9i0',
	name: 'Acme',
	email: 'ops@acme.test',
	type: 'team',
	ipAllowList: [],
};
const user = {
	id: 'usr-d0k1q2r3s4t5u6v7w8x9',
	name: 'Jordan',
	email: 'jordan@acme.test',
	type: 'user',
	twoFactorAuthEnabled: true,
};

const originalFetch = globalThis.fetch;
// unknown: canned JSON replies by request path; each test sets the bodies.
let replies: Record<string, unknown> = {};

beforeAll(() => {
	globalThis.fetch = async (input: Parameters<typeof fetch>[0]) => {
		const url = new URL(String(input));
		if (!(url.pathname in replies)) {
			throw new Error(`unexpected request ${url.pathname}`);
		}
		return new Response(JSON.stringify(replies[url.pathname]), {
			headers: { 'Content-Type': 'application/json' },
		});
	};
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

let sqlite: SqliteDatabase;

beforeEach(() => {
	replies = {};
	sqlite = new Database(':memory:');
	sqlite.exec(TABLES);
});

afterEach(() => {
	sqlite.close();
});

async function corsairWithDb() {
	const corsair = createCorsair({
		plugins: [render({ key: 'rnd_test' })],
		database: sqlite,
	});
	await setupCorsair(corsair, { silent: true });
	return corsair;
}

describe('Render owners are saved locally', () => {
	it('stores each owner from owners.list by owner ID', async () => {
		const corsair = await corsairWithDb();
		replies['/v1/owners'] = [
			{ cursor: 'c1', owner: team },
			{ cursor: 'c2', owner: user },
		];

		await corsair.render.api.owners.list({});

		const saved = await corsair.render.db.renderOwner.findByEntityId(team.id);
		expect(saved?.data).toEqual({
			id: team.id,
			name: 'Acme',
			email: 'ops@acme.test',
			type: 'team',
		});
		expect(
			(await corsair.render.db.renderOwner.findByEntityId(user.id))?.data,
		).toMatchObject({ id: user.id, type: 'user' });
	});

	it('updates the stored owner from owners.retrieve', async () => {
		const corsair = await corsairWithDb();
		replies['/v1/owners'] = [{ cursor: 'c1', owner: team }];
		replies[`/v1/owners/${team.id}`] = { ...team, name: 'Acme Inc' };

		await corsair.render.api.owners.list({});
		await corsair.render.api.owners.retrieve({ id: team.id });

		const saved = await corsair.render.db.renderOwner.findByEntityId(team.id);
		expect(saved?.data).toMatchObject({ name: 'Acme Inc' });
		expect(await corsair.render.db.renderOwner.list()).toHaveLength(1);
	});
});
