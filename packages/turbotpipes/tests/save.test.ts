import { createRequire } from 'node:module';
import path from 'node:path';
import { createCorsair } from 'corsair/core';
import type { createCorsairDatabase } from 'corsair/db';
import { setupCorsair } from 'corsair/setup';
import { turbotpipes } from '../index';

const KEK = 'kek-for-turbotpipes-tests';
const SEAL_KEY = '_corsair_enc';

const load = createRequire(path.join(process.cwd(), 'package.json'));
const Database = load(
	path.resolve(process.cwd(), '../corsair/node_modules/better-sqlite3'),
	// as is necessary: createRequire returns an untyped module. A stricter constructor type is not practical.
) as new (
	filename: string,
) => {
	exec: (sql: string) => void;
	// unknown is necessary: better-sqlite3 rows are untyped. A stricter row type is not practical.
	prepare: (sql: string) => { all: (...params: string[]) => unknown[] };
	close: () => void;
};

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

const USER_EMAIL = 'bob@private.example';
const SECRET_SQL = "select * from aws_iam_user where name = 'svc-secret-42'";

// unknown is necessary: each route answers with a different JSON body. A stricter body type is not practical.
type Routes = Record<string, () => unknown>;

const originalFetch = globalThis.fetch;
let routes: Routes = {};

beforeAll(() => {
	globalThis.fetch = async (input: Parameters<typeof fetch>[0]) => {
		const url = new URL(String(input));
		const answer = routes[url.pathname];
		if (!answer) throw new Error(`unexpected request ${url.pathname}`);
		return new Response(JSON.stringify(answer()), {
			headers: { 'Content-Type': 'application/json' },
		});
	};
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

let sqlite: InstanceType<typeof Database>;

beforeEach(() => {
	routes = {};
	sqlite = new Database(':memory:');
	sqlite.exec(TABLES);
});

afterEach(() => {
	sqlite.close();
});

async function corsairWith(encryptDataAtRest: boolean) {
	const corsair = createCorsair({
		kek: KEK,
		plugins: [turbotpipes({ key: 'tpt_test' })],
		// as is necessary: the loaded driver has no shared Database type. A stricter driver type is not practical.
		database: sqlite as unknown as Parameters<typeof createCorsairDatabase>[0],
		encryptDataAtRest,
	});
	await setupCorsair(corsair, { silent: true });
	return corsair;
}

// unknown is necessary: a stored cell is a seal envelope or a plain document. A stricter type is not practical.
function column(table: 'corsair_entities' | 'corsair_events', where: string) {
	const [field, filter] =
		table === 'corsair_entities'
			? ['data', 'entity_type']
			: ['payload', 'event_type'];
	return sqlite
		.prepare(`SELECT ${field} AS cell FROM ${table} WHERE ${filter} = ?`)
		.all(where)
		.map((row) => {
			const text =
				row && typeof row === 'object' ? Reflect.get(row, 'cell') : '';
			return typeof text === 'string' ? JSON.parse(text) : text;
		});
}

// Background list discovery runs after the response returns.
const flush = () => new Promise((resolve) => setTimeout(resolve, 20));

describe('turbotpipes saves with encryptDataAtRest', () => {
	it('seals a fetched user and reads it back through the entity client', async () => {
		const corsair = await corsairWith(true);
		routes['/api/v1/user/bob'] = () => ({
			id: 'u_1',
			handle: 'bob',
			email: USER_EMAIL,
		});

		await corsair.turbotpipes.api.users.get({ user_handle: 'bob' });

		const cells = column('corsair_entities', 'user');
		expect(cells).toEqual([{ [SEAL_KEY]: expect.any(String) }]);
		expect(JSON.stringify(cells)).not.toContain(USER_EMAIL);
		const read = await corsair.turbotpipes.db.user.findByEntityId('u_1');
		expect(read?.data).toMatchObject({ handle: 'bob', email: USER_EMAIL });
	});

	it('seals list discovery rows and keeps stored details', async () => {
		const corsair = await corsairWith(true);
		routes['/api/v1/user/bob/workspace/main'] = () => ({
			id: 'w_1',
			handle: 'main',
			title: 'Detailed Title',
		});
		routes['/api/v1/user/bob/workspace'] = () => ({
			items: [
				{ id: 'w_1', handle: 'main' },
				{ id: 'w_2', handle: 'dev' },
			],
		});

		await corsair.turbotpipes.api.users.getUserWorkspace({
			user_handle: 'bob',
			workspace_handle: 'main',
		});
		await corsair.turbotpipes.api.users.listWorkspaces({ user_handle: 'bob' });
		await flush();

		const cells = column('corsair_entities', 'workspace');
		expect(cells).toHaveLength(2);
		for (const cell of cells) {
			expect(cell).toEqual({ [SEAL_KEY]: expect.any(String) });
		}
		const main = await corsair.turbotpipes.db.workspace.findByEntityId('w_1');
		expect(main?.data).toMatchObject({ title: 'Detailed Title' });
		const dev = await corsair.turbotpipes.db.workspace.findByEntityId('w_2');
		expect(dev?.data).toMatchObject({ handle: 'dev' });
	});
});

describe('turbotpipes query events', () => {
	it('logs handles but never the SQL text', async () => {
		// Unencrypted, so the stored payload is readable here.
		const corsair = await corsairWith(false);
		routes['/api/v1/user/bob/workspace/dev/query'] = () => ({ items: [] });
		routes['/api/v1/org/acme/workspace/main/query'] = () => ({ items: [] });

		await corsair.turbotpipes.api.query.runUserWorkspaceQuery({
			user_handle: 'bob',
			workspace_handle: 'dev',
			sql: SECRET_SQL,
		});
		await corsair.turbotpipes.api.query.createOrgWorkspaceQuery({
			org_handle: 'acme',
			workspace_handle: 'main',
			sql: SECRET_SQL,
		});

		const user = column('corsair_events', 'turbotpipes.query.run_user_query');
		expect(user).toEqual([{ user_handle: 'bob', workspace_handle: 'dev' }]);
		const org = column('corsair_events', 'turbotpipes.query.create_org_query');
		expect(org).toEqual([{ org_handle: 'acme', workspace_handle: 'main' }]);
		expect(JSON.stringify([user, org])).not.toContain('svc-secret-42');
	});
});
