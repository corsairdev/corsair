import { createRequire } from 'node:module';
import path from 'node:path';
import { createCorsair } from 'corsair/core';
import type { createCorsairDatabase } from 'corsair/db';
import { setupCorsair } from 'corsair/setup';
import { browseruse } from './index';

const KEK = 'kek-for-browseruse-tests';
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

const BROWSER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const RUN_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
const SESSION_ID = '9b2f1c3e-1111-4a2b-8c3d-123456789abc';
const WORKSPACE_ID = 'a1b2c3d4-2222-4a2b-8c3d-123456789abc';
const TASK = 'Find the top 3 trending repos on GitHub today';
const CDP_URL = 'https://cdp.browser-use.com/secret-session';

const browser = {
	id: BROWSER_ID,
	status: 'active',
	liveUrl: 'https://live.browser-use.com/abc',
	cdpUrl: CDP_URL,
	timeoutAt: '2026-10-20T12:15:00Z',
	startedAt: '2026-10-20T12:00:00Z',
	finishedAt: null,
	proxyUsedMb: '0',
	proxyCost: '0',
	browserCost: '0',
	agentSessionId: null,
	recordingUrl: null,
	recordingAvailable: false,
	metadata: {},
	extensions: [],
};

const fullRun = {
	id: RUN_ID,
	task: TASK,
	title: 'Trending repos',
	model: 'gpt-6-luna',
	contextLimit: 400000,
	status: 'completed',
	result: '1. a 2. b 3. c',
	output: null,
	error: null,
	sessionId: SESSION_ID,
	workspaceId: WORKSPACE_ID,
	totalInputTokens: 100,
	totalOutputTokens: 20,
	totalCostUsd: '0.01',
	createdAt: '2026-10-20T12:00:00Z',
	updatedAt: '2026-10-20T12:01:00Z',
};

// unknown is necessary: each test answers with a different JSON body. A stricter body type is not practical.
function json(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		headers: { 'Content-Type': 'application/json' },
	});
}

// unknown is necessary: tests answer different routes with different bodies. A stricter map type is not practical.
type Routes = Record<string, () => unknown>;

const originalFetch = globalThis.fetch;
let routes: Routes = {};

beforeAll(() => {
	globalThis.fetch = async (input: Parameters<typeof fetch>[0]) => {
		const url = new URL(String(input));
		const answer = routes[url.pathname];
		if (!answer) throw new Error(`unexpected request ${url.pathname}`);
		return json(answer());
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

async function encryptedCorsair() {
	const corsair = createCorsair({
		kek: KEK,
		plugins: [browseruse({ key: 'bu_test' })],
		// as is necessary: the loaded driver has no shared Database type. A stricter driver type is not practical.
		database: sqlite as unknown as Parameters<typeof createCorsairDatabase>[0],
		encryptDataAtRest: true,
	});
	await setupCorsair(corsair, { silent: true });
	return corsair;
}

// unknown is necessary: the stored cell is a seal envelope or a plain document. A stricter type is not practical.
function storedCells(entityType: string): unknown[] {
	return sqlite
		.prepare('SELECT data FROM corsair_entities WHERE entity_type = ?')
		.all(entityType)
		.map((row) => {
			const text =
				row && typeof row === 'object' ? Reflect.get(row, 'data') : '';
			return typeof text === 'string' ? JSON.parse(text) : text;
		});
}

describe('browseruse saves with encryptDataAtRest', () => {
	it('seals a saved run and reads it back through the entity client', async () => {
		const corsair = await encryptedCorsair();
		routes['/api/v4/runs'] = () => ({
			id: RUN_ID,
			status: 'queued',
			model: 'gpt-6-luna',
			sessionId: SESSION_ID,
			workspaceId: WORKSPACE_ID,
			eventsUrl: `/api/v4/runs/${RUN_ID}/events`,
		});

		await corsair.browseruse.api.runs.create({ task: TASK });

		const cells = storedCells('runs');
		expect(cells).toEqual([{ [SEAL_KEY]: expect.any(String) }]);
		expect(JSON.stringify(cells)).not.toContain(TASK);
		const read = await corsair.browseruse.db.runs.findByEntityId(RUN_ID);
		expect(read?.data).toMatchObject({
			id: RUN_ID,
			status: 'queued',
			task: TASK,
		});
	});

	it('seals a saved browser, so its CDP URL is not stored in plain text', async () => {
		const corsair = await encryptedCorsair();
		routes['/api/v4/browsers'] = () => browser;

		await corsair.browseruse.api.browsers.create({});

		const cells = storedCells('browsers');
		expect(cells).toEqual([{ [SEAL_KEY]: expect.any(String) }]);
		expect(JSON.stringify(cells)).not.toContain(CDP_URL);
		const read =
			await corsair.browseruse.db.browsers.findByEntityId(BROWSER_ID);
		expect(read?.data).toMatchObject({ id: BROWSER_ID, cdpUrl: CDP_URL });
	});

	it('keeps the full run when a status poll overlaps the get', async () => {
		const corsair = await encryptedCorsair();
		routes[`/api/v4/runs/${RUN_ID}`] = () => fullRun;
		routes[`/api/v4/runs/${RUN_ID}/status`] = () => ({ status: 'completed' });

		await Promise.all([
			corsair.browseruse.api.runs.get({ id: RUN_ID }),
			corsair.browseruse.api.runs.getStatus({ id: RUN_ID }),
		]);

		const read = await corsair.browseruse.db.runs.findByEntityId(RUN_ID);
		expect(read?.data).toMatchObject({
			task: TASK,
			result: '1. a 2. b 3. c',
			status: 'completed',
		});
		expect(storedCells('runs')).toEqual([{ [SEAL_KEY]: expect.any(String) }]);
	});

	it('does not let a stale running poll rewind a completed run', async () => {
		const corsair = await encryptedCorsair();
		routes[`/api/v4/runs/${RUN_ID}`] = () => fullRun;
		routes[`/api/v4/runs/${RUN_ID}/status`] = () => ({ status: 'running' });

		await corsair.browseruse.api.runs.get({ id: RUN_ID });
		await corsair.browseruse.api.runs.getStatus({ id: RUN_ID });

		const read = await corsair.browseruse.db.runs.findByEntityId(RUN_ID);
		expect(read?.data).toMatchObject({
			status: 'completed',
			result: '1. a 2. b 3. c',
		});
	});
});
