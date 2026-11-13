import postgres from 'postgres';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { getOAuthAccessToken } from '../core/auth/oauth-access';
import type { CorsairDatabase } from '../db/kysely/database';
import { createCorsairDatabase } from '../db/kysely/database';
import type { HubConfig } from '../hub/types';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';
const SCHEMA = 'corsair_refresh_lock_test';
const PG_URL = process.env.DATABASE_URL ?? '';
const hub: HubConfig = {
	apiUrl: 'https://hub.test',
	projectApiKey: 'ck_prod_test',
	signingSecret: 'sec',
};

const DDL = `
CREATE TABLE ${SCHEMA}.corsair_integrations (
  id TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}', dek TEXT NULL);
CREATE TABLE ${SCHEMA}.corsair_accounts (
  id TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), tenant_id TEXT NOT NULL,
  integration_id TEXT NOT NULL, config JSONB NOT NULL DEFAULT '{}', dek TEXT NULL);
`;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Fake provider/hub: rotates the refresh token on every use and rejects a
// reused one, like GitHub user-to-server tokens.
function installRotatingEndpoint(initialRefresh: string) {
	let current = initialRefresh;
	let n = 0;
	const state = { requests: 0 };
	global.fetch = (async (_url: string, init: RequestInit) => {
		state.requests += 1;
		const raw = String(init.body);
		const sent = raw.startsWith('{')
			? JSON.parse(raw).refresh_token
			: new URLSearchParams(raw).get('refresh_token');
		await wait(50);
		if (sent !== current) {
			return {
				ok: false,
				status: 400,
				headers: { get: () => 'application/json' },
				text: async () => JSON.stringify({ error: 'bad_refresh_token' }),
			} as unknown as Response;
		}
		n += 1;
		current = `rt-${n}`;
		return {
			ok: true,
			status: 200,
			headers: { get: () => 'application/json' },
			text: async () =>
				JSON.stringify({
					access_token: `at-${n}`,
					refresh_token: current,
					expires_in: 3600,
				}),
		} as unknown as Response;
	}) as unknown as typeof fetch;
	return state;
}

async function seed(
	database: CorsairDatabase,
	integrationConfig: Record<string, string>,
) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);
	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integration-github',
			created_at: now,
			updated_at: now,
			name: 'github',
			config: encryptConfig(integrationConfig, dek),
			dek: encryptedDek,
		})
		.execute();
	await database.db
		.insertInto('corsair_accounts')
		.values({
			id: 'account-default',
			created_at: now,
			updated_at: now,
			tenant_id: 'default',
			integration_id: 'integration-github',
			config: encryptConfig(
				{ access_token: 'stale', expires_at: '1', refresh_token: 'rt-0' },
				dek,
			),
			dek: encryptedDek,
		})
		.execute();
}

const makeKeys = (
	database: CorsairDatabase,
	extra: {
		ensureProvisioned?: () => Promise<void>;
		refreshLockTimeoutMs?: number;
	} = {},
) =>
	createAccountKeyManager({
		...extra,
		authType: 'oauth_2',
		integrationName: 'github',
		tenantId: 'default',
		kek: KEK,
		database,
	});

const opts = { plugin: 'github', tokenUrl: 'https://github.test/token' };

describe('oauth refresh cross-process lock', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('no lock without Postgres: sqlite still refreshes once in-process', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(database, { client_id: 'cid', client_secret: 'sec' });
			const state = installRotatingEndpoint('rt-0');
			const ctx = { keys: makeKeys(database), tenantId: 'default' };
			const [a, b] = await Promise.all([
				getOAuthAccessToken(ctx, opts),
				getOAuthAccessToken(ctx, opts),
			]);
			expect([a, b]).toEqual(['at-1', 'at-1']);
			expect(state.requests).toBe(1);
		} finally {
			cleanup();
		}
	});

	const truthy = (v?: string) => ['1', 'true', 'yes'].includes(v ?? '');
	const local =
		/^postgres(ql)?:\/\/([^@/]*@)?(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/;
	const pgEnabled =
		truthy(process.env.RUN_PG_TESTS) &&
		!truthy(process.env.SKIP_PG_TESTS) &&
		local.test(PG_URL);
	const pgIt = pgEnabled ? it : it.skip;

	let admin: postgres.Sql;
	let sql: postgres.Sql;
	beforeAll(async () => {
		if (!pgEnabled) return;
		admin = postgres(PG_URL, { max: 1 });
		await admin.unsafe(`DROP SCHEMA IF EXISTS ${SCHEMA} CASCADE`);
		await admin.unsafe(`CREATE SCHEMA ${SCHEMA}`);
		await admin.unsafe(DDL);
		sql = postgres(PG_URL, { max: 10, connection: { search_path: SCHEMA } });
	});
	afterAll(async () => {
		if (!pgEnabled) return;
		await sql.end({ timeout: 2 });
		await admin.unsafe(`DROP SCHEMA IF EXISTS ${SCHEMA} CASCADE`);
		await admin.end({ timeout: 2 });
	});
	beforeEach(async () => {
		if (!pgEnabled) return;
		await sql.unsafe(
			`TRUNCATE ${SCHEMA}.corsair_accounts, ${SCHEMA}.corsair_integrations`,
		);
	});

	for (const [label, integration] of [
		['local path', { client_id: 'cid', client_secret: 'sec' }],
		['hub path', {}],
	] as const) {
		pgIt(
			`${label}: two processes refresh once, loser reuses the winner's token`,
			async () => {
				const database = createCorsairDatabase(sql);
				await seed(database, integration);
				const state = installRotatingEndpoint('rt-0');
				// Separate key managers = separate singleFlight scopes = two "processes".
				const procA = { keys: makeKeys(database), hub, tenantId: 'default' };
				const procB = { keys: makeKeys(database), hub, tenantId: 'default' };
				const [a, b] = await Promise.all([
					getOAuthAccessToken(procA, opts),
					getOAuthAccessToken(procB, opts),
				]);
				expect([a, b]).toEqual(['at-1', 'at-1']);
				expect(state.requests).toBe(1);
			},
		);
	}

	// The hosted runtime serves one request per environment, so its pool is
	// max: 1. The lock must not need a second connection.
	for (const [label, shared] of [
		['one shared max:1 pool', true],
		['a max:1 pool per process', false],
	] as const) {
		pgIt(
			`${label}: completes, one token request, both get the new token`,
			async () => {
				const poolA = postgres(PG_URL, {
					max: 1,
					connection: { search_path: SCHEMA },
				});
				const poolB = shared
					? poolA
					: postgres(PG_URL, { max: 1, connection: { search_path: SCHEMA } });
				try {
					await seed(createCorsairDatabase(sql), {
						client_id: 'cid',
						client_secret: 'sec',
					});
					const state = installRotatingEndpoint('rt-0');
					const procA = {
						keys: makeKeys(createCorsairDatabase(poolA)),
						tenantId: 'default',
					};
					const procB = {
						keys: makeKeys(createCorsairDatabase(poolB)),
						tenantId: 'default',
					};
					const [a, b] = await Promise.all([
						getOAuthAccessToken(procA, opts),
						getOAuthAccessToken(procB, opts),
					]);
					expect([a, b]).toEqual(['at-1', 'at-1']);
					expect(state.requests).toBe(1);
				} finally {
					await poolA.end({ timeout: 1 });
					if (!shared) await poolB.end({ timeout: 1 });
				}
			},
			8000,
		);
	}

	pgIt(
		'lock timeout while a holder is mid-refresh: waiter reuses the fresh stored token, no second request',
		async () => {
			const database = createCorsairDatabase(sql);
			await seed(database, { client_id: 'cid', client_secret: 'sec' });
			const state = installRotatingEndpoint('rt-0');
			const key = 'corsair-refresh:default:github';
			let release!: () => void;
			const held = new Promise<void>((r) => {
				release = r;
			});
			let locked!: () => void;
			const lockTaken = new Promise<void>((r) => {
				locked = r;
			});
			// Stands in for process A, mid-call to the provider.
			const holder = sql.begin(async (tx) => {
				await tx`select pg_advisory_xact_lock(hashtext(${key}::text))`;
				locked();
				await held;
			});
			await lockTaken;

			const provisioned = jest.fn(async () => {});
			const procB = {
				keys: makeKeys(database, {
					refreshLockTimeoutMs: 300,
					ensureProvisioned: provisioned,
				}),
				tenantId: 'default',
			};
			const b = getOAuthAccessToken(procB, opts);
			await wait(100);
			// A finishes its rotation and persists while B is still waiting.
			const writer = makeKeys(database);
			await writer.set_access_token('at-from-a');
			await writer.set_expires_at(String(Math.floor(Date.now() / 1000) + 3600));
			expect(await b).toBe('at-from-a');
			expect(state.requests).toBe(0);
			release();
			await holder;
		},
		8000,
	);
});
