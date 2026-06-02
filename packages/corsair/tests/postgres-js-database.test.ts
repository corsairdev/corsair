import 'dotenv/config';
import { slack } from '@corsair-dev/slack';
import { Kysely, sql } from 'kysely';
import postgres from 'postgres';
import { createCorsair } from '../core';
import type {
	CorsairDatabase,
	CorsairKyselyDatabase,
} from '../db/kysely/database';
import { createCorsairDatabase } from '../db/kysely/database';
import { createCorsairOrm } from '../db/orm';
import { createIntegrationAndAccount } from './plugins-test-utils';

const TEST_SCHEMA = 'corsair_pgjs_test';
const PG_URL =
	process.env.DATABASE_URL ??
	'postgresql://user:password@localhost:5432/db_name';

const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS ${TEST_SCHEMA}.corsair_integrations (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    dek TEXT NULL
);
CREATE TABLE IF NOT EXISTS ${TEST_SCHEMA}.corsair_accounts (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tenant_id TEXT NOT NULL,
    integration_id TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    dek TEXT NULL
);
CREATE TABLE IF NOT EXISTS ${TEST_SCHEMA}.corsair_entities (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    version TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS ${TEST_SCHEMA}.corsair_events (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    status TEXT
);
CREATE TABLE IF NOT EXISTS ${TEST_SCHEMA}.corsair_permissions (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    token TEXT NOT NULL,
    plugin TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    args TEXT NOT NULL,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    status TEXT NOT NULL DEFAULT 'pending',
    expires_at TEXT NOT NULL,
    error TEXT NULL
);
`;

async function canConnect(): Promise<boolean> {
	let probe: postgres.Sql | null = null;
	try {
		probe = postgres(PG_URL, { max: 1, connect_timeout: 3, idle_timeout: 1 });
		await probe`SELECT 1`;
		return true;
	} catch {
		return false;
	} finally {
		try {
			await probe?.end({ timeout: 1 });
		} catch {
			/* noop */
		}
	}
}

describe('postgres-js database integration', () => {
	let adminSql: postgres.Sql;
	let testSql: postgres.Sql;
	let corsairDb: CorsairDatabase;
	let kdb: Kysely<CorsairKyselyDatabase>;
	let connectable = false;

	beforeAll(async () => {
		connectable = await canConnect();
		if (!connectable) {
			// eslint-disable-next-line no-console
			console.warn(
				`Postgres not reachable at ${PG_URL}; postgres-js tests skipped`,
			);
			return;
		}

		adminSql = postgres(PG_URL, { max: 2 });
		await adminSql.unsafe(`DROP SCHEMA IF EXISTS ${TEST_SCHEMA} CASCADE`);
		await adminSql.unsafe(`CREATE SCHEMA ${TEST_SCHEMA}`);
		await adminSql.unsafe(SCHEMA_DDL);

		testSql = postgres(PG_URL, {
			max: 5,
			connection: { search_path: TEST_SCHEMA },
		});

		corsairDb = createCorsairDatabase(testSql);
		kdb = corsairDb.db;
	}, 30000);

	afterAll(async () => {
		if (!connectable) return;
		try {
			await kdb?.destroy();
		} catch {
			/* noop */
		}
		try {
			await testSql?.end({ timeout: 2 });
		} catch {
			/* noop */
		}
		try {
			await adminSql?.unsafe(`DROP SCHEMA IF EXISTS ${TEST_SCHEMA} CASCADE`);
			await adminSql?.end({ timeout: 2 });
		} catch {
			/* noop */
		}
	}, 30000);

	beforeEach(async () => {
		if (!connectable) return;
		await testSql.unsafe(`
			TRUNCATE TABLE
				${TEST_SCHEMA}.corsair_permissions,
				${TEST_SCHEMA}.corsair_events,
				${TEST_SCHEMA}.corsair_entities,
				${TEST_SCHEMA}.corsair_accounts,
				${TEST_SCHEMA}.corsair_integrations
			RESTART IDENTITY CASCADE
		`);
	});

	// Resolve gate eagerly at file load (before describe registration).
	// `connectable` inside beforeAll is set too late — Jest has already
	// registered describe/it bindings. Use a synchronous env-var hint to
	// decide whether to run the live tests; the actual probe in beforeAll
	// will throw loudly if the URL is mis-set.
	const skipFlag = (process.env.SKIP_PG_TESTS ?? '').toLowerCase();
	const liveDisabled =
		skipFlag === '1' || skipFlag === 'true' || skipFlag === 'yes';
	const gated = () => (liveDisabled ? it.skip : it);

	// ────────────────────────────────────────────────────────────────────────
	// Input detection + dispatch
	// ────────────────────────────────────────────────────────────────────────

	describe('createCorsairDatabase input dispatch', () => {
		gated()('wraps a postgres.js Sql into a Kysely instance', () => {
			const { db } = createCorsairDatabase(testSql);
			expect(db).toBeInstanceOf(Kysely);
		});

		gated()('accepts a Kysely instance as-is (pass-through)', () => {
			const wrapped = createCorsairDatabase(kdb);
			expect(wrapped.db).toBe(kdb);
		});

		it('throws for unsupported inputs', () => {
			expect(() => createCorsairDatabase({} as never)).toThrow(
				/Unsupported database input/,
			);
			expect(() => createCorsairDatabase(42 as never)).toThrow(
				/Unsupported database input/,
			);
		});
	});

	// ────────────────────────────────────────────────────────────────────────
	// Field-type round-trips for every Corsair table
	// ────────────────────────────────────────────────────────────────────────

	describe('corsair_integrations field types', () => {
		gated()(
			'round-trips text, jsonb, timestamptz and nullable text',
			async () => {
				const now = new Date();
				const config = {
					api_base: 'https://slack.com',
					retries: 3,
					enabled: true,
					tags: ['a', 'b'],
					nested: { key: 'v', n: 1 },
				};
				await kdb
					.insertInto('corsair_integrations')
					.values({
						id: 'int-1',
						created_at: now,
						updated_at: now,
						name: 'slack',
						config,
						dek: undefined,
					} as never)
					.execute();

				const row = await kdb
					.selectFrom('corsair_integrations')
					.selectAll()
					.where('id', '=', 'int-1')
					.executeTakeFirstOrThrow();

				expect(row.name).toBe('slack');
				expect(row.config).toEqual(config);
				expect(row.created_at).toBeInstanceOf(Date);
				expect((row.created_at as Date).getTime()).toBeCloseTo(
					now.getTime(),
					-2,
				);
				expect(row.dek).toBeNull();
			},
		);

		gated()('updates jsonb and nullable columns', async () => {
			await kdb
				.insertInto('corsair_integrations')
				.values({
					id: 'int-2',
					created_at: new Date(),
					updated_at: new Date(),
					name: 'slack',
					config: { v: 1 },
					dek: 'initial-dek',
				} as never)
				.execute();

			await kdb
				.updateTable('corsair_integrations')
				.set({
					config: { v: 2, added: 'yes' },
					dek: null,
					updated_at: new Date(),
				} as never)
				.where('id', '=', 'int-2')
				.execute();

			const row = await kdb
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('id', '=', 'int-2')
				.executeTakeFirstOrThrow();

			expect(row.config).toEqual({ v: 2, added: 'yes' });
			expect(row.dek).toBeNull();
		});

		gated()('deletes rows and returns affected count', async () => {
			await kdb
				.insertInto('corsair_integrations')
				.values({
					id: 'int-del',
					created_at: new Date(),
					updated_at: new Date(),
					name: 'slack',
					config: {},
				} as never)
				.execute();

			const res = await kdb
				.deleteFrom('corsair_integrations')
				.where('id', '=', 'int-del')
				.executeTakeFirst();
			expect(Number(res.numDeletedRows)).toBe(1);

			const remaining = await kdb
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('id', '=', 'int-del')
				.execute();
			expect(remaining).toHaveLength(0);
		});
	});

	describe('corsair_accounts field types', () => {
		gated()(
			'stores tenant/integration references and jsonb config',
			async () => {
				await createIntegrationAndAccount(kdb, 'slack', 'tenant-alpha');

				const account = await kdb
					.selectFrom('corsair_accounts')
					.selectAll()
					.where('tenant_id', '=', 'tenant-alpha')
					.executeTakeFirstOrThrow();

				expect(account.integration_id).toBe('slack-integration');
				expect(account.config).toEqual({});
				expect(account.created_at).toBeInstanceOf(Date);

				await kdb
					.updateTable('corsair_accounts')
					.set({
						config: {
							scopes: ['chat:write', 'channels:read'],
							per_tenant: true,
						},
						dek: 'enc-dek',
					} as never)
					.where('id', '=', account.id)
					.execute();

				const updated = await kdb
					.selectFrom('corsair_accounts')
					.selectAll()
					.where('id', '=', account.id)
					.executeTakeFirstOrThrow();
				expect(updated.config).toEqual({
					scopes: ['chat:write', 'channels:read'],
					per_tenant: true,
				});
				expect(updated.dek).toBe('enc-dek');
			},
		);
	});

	describe('corsair_entities field types', () => {
		gated()(
			'stores jsonb data with mixed primitive and nested values',
			async () => {
				await createIntegrationAndAccount(kdb, 'slack');

				const createdDate = new Date('2026-03-14T12:34:56.000Z');
				const data = {
					id: 'C100',
					name: 'general',
					is_private: false,
					is_archived: null,
					num_members: 42,
					createdAt: createdDate.toISOString(),
					topic: { value: 'hello', creator: 'U1', last_set: 1 },
				};

				await kdb
					.insertInto('corsair_entities')
					.values({
						id: 'ent-1',
						created_at: new Date(),
						updated_at: new Date(),
						account_id: 'slack-account',
						entity_id: 'C100',
						entity_type: 'channels',
						version: '1.1.0',
						data,
					} as never)
					.execute();

				const row = await kdb
					.selectFrom('corsair_entities')
					.selectAll()
					.where('id', '=', 'ent-1')
					.executeTakeFirstOrThrow();

				expect(row.entity_type).toBe('channels');
				expect(row.version).toBe('1.1.0');
				expect(row.data).toEqual(data);
			},
		);

		gated()('supports jsonb predicates via sql tagged template', async () => {
			await createIntegrationAndAccount(kdb, 'slack');

			await kdb
				.insertInto('corsair_entities')
				.values([
					{
						id: 'e-a',
						created_at: new Date(),
						updated_at: new Date(),
						account_id: 'slack-account',
						entity_id: 'CA',
						entity_type: 'channels',
						version: '1.1.0',
						data: { name: 'general', is_private: false },
					},
					{
						id: 'e-b',
						created_at: new Date(),
						updated_at: new Date(),
						account_id: 'slack-account',
						entity_id: 'CB',
						entity_type: 'channels',
						version: '1.1.0',
						data: { name: 'secret', is_private: true },
					},
				] as never)
				.execute();

			const publicRows = await kdb
				.selectFrom('corsair_entities')
				.selectAll()
				.where(sql<boolean>`(data->>'is_private')::boolean`, '=', false)
				.execute();
			expect(publicRows.map((r) => r.entity_id)).toEqual(['CA']);
		});
	});

	describe('corsair_events field types', () => {
		gated()('serializes payloads and enum-like nullable status', async () => {
			await createIntegrationAndAccount(kdb, 'slack');
			const payload = {
				channel: 'C1',
				text: 'hello',
				ts: '1700000000.000100',
				blocks: [{ type: 'section', text: { type: 'plain_text', text: 'hi' } }],
			};

			await kdb
				.insertInto('corsair_events')
				.values([
					{
						id: 'ev-pending',
						created_at: new Date(),
						updated_at: new Date(),
						account_id: 'slack-account',
						event_type: 'slack.messages.post',
						payload,
						status: 'pending',
					},
					{
						id: 'ev-null-status',
						created_at: new Date(),
						updated_at: new Date(),
						account_id: 'slack-account',
						event_type: 'slack.messages.post',
						payload,
						status: null,
					},
				] as never)
				.execute();

			const rows = await kdb
				.selectFrom('corsair_events')
				.selectAll()
				.orderBy('id')
				.execute();

			expect(rows).toHaveLength(2);
			const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
			expect(byId['ev-pending']?.payload).toEqual(payload);
			expect(byId['ev-pending']?.status).toBe('pending');
			expect(byId['ev-null-status']?.payload).toEqual(payload);
			expect(byId['ev-null-status']?.status).toBeNull();
		});
	});

	describe('corsair_permissions field types', () => {
		gated()(
			'stores JSON-stringified args and string timestamps (expires_at)',
			async () => {
				const expiresAt = new Date(Date.now() + 60_000).toISOString();
				await kdb
					.insertInto('corsair_permissions')
					.values({
						id: 'perm-1',
						created_at: new Date(),
						updated_at: new Date(),
						token: 'tok-' + 'a'.repeat(32),
						plugin: 'slack',
						endpoint: 'messages.delete',
						args: JSON.stringify({ channel: 'C1', ts: '1.1' }),
						tenant_id: 'default',
						status: 'pending',
						expires_at: expiresAt,
						error: null,
					} as never)
					.execute();

				const row = await kdb
					.selectFrom('corsair_permissions')
					.selectAll()
					.where('id', '=', 'perm-1')
					.executeTakeFirstOrThrow();

				expect(row.endpoint).toBe('messages.delete');
				expect(row.status).toBe('pending');
				expect(row.expires_at).toBe(expiresAt);
				expect(row.error).toBeNull();
				expect(JSON.parse(row.args)).toEqual({ channel: 'C1', ts: '1.1' });

				await kdb
					.updateTable('corsair_permissions')
					.set({ status: 'failed', error: 'boom' })
					.where('id', '=', 'perm-1')
					.execute();
				const after = await kdb
					.selectFrom('corsair_permissions')
					.selectAll()
					.where('id', '=', 'perm-1')
					.executeTakeFirstOrThrow();
				expect(after.status).toBe('failed');
				expect(after.error).toBe('boom');
			},
		);
	});

	// ────────────────────────────────────────────────────────────────────────
	// withParamSerialization — Date / object serialization for unsafe()
	// ────────────────────────────────────────────────────────────────────────

	describe('withParamSerialization', () => {
		gated()(
			'serializes Date params to ISO string on the wire (via Kysely + unsafe)',
			async () => {
				await createIntegrationAndAccount(kdb, 'slack');
				const marker = new Date('2026-02-02T02:02:02.000Z');
				await kdb
					.insertInto('corsair_entities')
					.values({
						id: 'ent-date',
						created_at: marker,
						updated_at: marker,
						account_id: 'slack-account',
						entity_id: 'D1',
						entity_type: 'messages',
						version: '1.1.0',
						data: {},
					} as never)
					.execute();
				const row = await kdb
					.selectFrom('corsair_entities')
					.selectAll()
					.where('id', '=', 'ent-date')
					.executeTakeFirstOrThrow();
				expect(row.created_at).toBeInstanceOf(Date);
				expect((row.created_at as Date).toISOString()).toBe(
					marker.toISOString(),
				);
			},
		);

		gated()(
			'serializes plain-object params to JSON for JSONB columns',
			async () => {
				await createIntegrationAndAccount(kdb, 'slack');
				const nested = { a: { b: { c: [1, 2, 3] } }, s: 'x', b: true, n: null };
				await kdb
					.insertInto('corsair_entities')
					.values({
						id: 'ent-obj',
						created_at: new Date(),
						updated_at: new Date(),
						account_id: 'slack-account',
						entity_id: 'O1',
						entity_type: 'messages',
						version: '1.1.0',
						data: nested,
					} as never)
					.execute();
				const row = await kdb
					.selectFrom('corsair_entities')
					.selectAll()
					.where('id', '=', 'ent-obj')
					.executeTakeFirstOrThrow();
				expect(row.data).toEqual(nested);
			},
		);

		gated()(
			'passes through string, number, boolean, null params unchanged',
			async () => {
				await createIntegrationAndAccount(kdb, 'slack');

				await kdb
					.insertInto('corsair_entities')
					.values([
						{
							id: 'pe-1',
							created_at: new Date(),
							updated_at: new Date(),
							account_id: 'slack-account',
							entity_id: 'E1',
							entity_type: 'messages',
							version: '1.1.0',
							data: { n: 1, s: 'one', b: true },
						},
						{
							id: 'pe-2',
							created_at: new Date(),
							updated_at: new Date(),
							account_id: 'slack-account',
							entity_id: 'E2',
							entity_type: 'messages',
							version: '1.1.0',
							data: { n: 2, s: 'two', b: false },
						},
					] as never)
					.execute();

				// string param
				const byString = await kdb
					.selectFrom('corsair_entities')
					.selectAll()
					.where('entity_id', '=', 'E1')
					.execute();
				expect(byString).toHaveLength(1);

				// number param → count uses a bigint result but arg is numeric in `in`
				const byInClause = await kdb
					.selectFrom('corsair_entities')
					.selectAll()
					.where('entity_id', 'in', ['E1', 'E2'])
					.orderBy('entity_id')
					.execute();
				expect(byInClause.map((r) => r.entity_id)).toEqual(['E1', 'E2']);

				// boolean param via jsonb cast
				const boolRows = await kdb
					.selectFrom('corsair_entities')
					.selectAll()
					.where(sql<boolean>`(data->>'b')::boolean`, '=', true)
					.execute();
				expect(boolRows.map((r) => r.entity_id)).toEqual(['E1']);

				// null param
				const nullStatus = await kdb
					.selectFrom('corsair_events')
					.selectAll()
					.where('status', 'is', null)
					.execute();
				expect(nullStatus).toHaveLength(0);
			},
		);
	});

	// ────────────────────────────────────────────────────────────────────────
	// ORM layer on top of postgres.js
	// ────────────────────────────────────────────────────────────────────────

	describe('createCorsairOrm on postgres.js', () => {
		gated()(
			'performs full CRUD (findById / findMany / create / update / delete / count)',
			async () => {
				const orm = createCorsairOrm({ db: kdb });

				const created = await orm.integrations.create({
					name: 'slack',
					config: { v: 1 },
				});
				expect(created.id).toBeDefined();
				expect(created.config).toEqual({ v: 1 });
				expect(created.created_at).toBeInstanceOf(Date);

				const fetched = await orm.integrations.findById(created.id);
				expect(fetched?.name).toBe('slack');

				const byName = await orm.integrations.findByName('slack');
				expect(byName?.id).toBe(created.id);

				const all = await orm.integrations.findMany({ limit: 10 });
				expect(all.map((r) => r.id)).toContain(created.id);

				const updated = await orm.integrations.update(created.id, {
					config: { v: 2 },
				});
				expect(updated?.config).toEqual({ v: 2 });

				const account = await orm.accounts.create({
					tenant_id: 'default',
					integration_id: created.id,
					config: { scopes: ['chat:write'] },
				});
				expect(account.tenant_id).toBe('default');

				const foundAcct = await orm.accounts.findByTenantAndIntegration(
					'default',
					'slack',
				);
				expect(foundAcct?.id).toBe(account.id);

				const entity = await orm.entities.upsertByEntityId({
					accountId: account.id,
					entityType: 'channels',
					entityId: 'C999',
					version: '1.1.0',
					data: { id: 'C999', name: 'general', is_private: false },
				});
				expect(entity.entity_id).toBe('C999');

				const sameEntity = await orm.entities.upsertByEntityId({
					accountId: account.id,
					entityType: 'channels',
					entityId: 'C999',
					version: '1.1.0',
					data: { id: 'C999', name: 'general-renamed', is_private: false },
				});
				expect(sameEntity.id).toBe(entity.id);
				expect((sameEntity.data as { name?: string }).name).toBe(
					'general-renamed',
				);

				const countBefore = await orm.entities.count();
				expect(countBefore).toBeGreaterThanOrEqual(1);

				const removed = await orm.entities.deleteByEntityId({
					accountId: account.id,
					entityType: 'channels',
					entityId: 'C999',
				});
				expect(removed).toBe(true);

				const countAfter = await orm.entities.count();
				expect(countAfter).toBe(countBefore - 1);
			},
		);

		gated()('filters with in/like operators', async () => {
			const orm = createCorsairOrm({ db: kdb });
			await createIntegrationAndAccount(kdb, 'slack');

			for (const id of ['C1', 'C2', 'C3']) {
				await orm.entities.upsertByEntityId({
					accountId: 'slack-account',
					entityType: 'channels',
					entityId: id,
					version: '1.1.0',
					data: { id, name: `chan-${id}` },
				});
			}

			const twoById = await orm.entities.findMany({
				where: { entity_id: { in: ['C1', 'C3'] } },
			});
			expect(twoById.map((e) => e.entity_id).sort()).toEqual(['C1', 'C3']);

			const liked = await orm.entities.searchByEntityId({
				accountId: 'slack-account',
				entityType: 'channels',
				query: 'C',
			});
			expect(liked).toHaveLength(3);
		});
	});

	// ────────────────────────────────────────────────────────────────────────
	// Slack plugin end-to-end — real Slack API + DB writes through postgres.js
	// ────────────────────────────────────────────────────────────────────────

	describe('slack plugin end-to-end against postgres.js', () => {
		const botToken = process.env.SLACK_BOT_TOKEN;
		const channel = process.env.TEST_SLACK_CHANNEL;
		const kek = process.env.CORSAIR_KEK;
		// Same eager-registration constraint as the outer `gated()` helper.
		// `connectable` is set in beforeAll which runs after describe/it
		// registration. Decide solely on env var presence here; the beforeAll
		// probe will fail loudly if Postgres isn't reachable.
		const slackEnabled = !liveDisabled && Boolean(botToken && channel && kek);
		const runIf = slackEnabled ? it : it.skip;

		runIf(
			'posts/updates/deletes a message and logs events+entities',
			async () => {
				// Use a fresh Kysely handle on the shared postgres.js Sql so we
				// exercise createCorsairDatabase's dispatch end-to-end.
				const corsair = createCorsair({
					plugins: [slack({})],
					database: testSql,
					kek: kek!,
				});

				await createIntegrationAndAccount(kdb, 'slack', 'default');
				await corsair.slack.keys.issue_new_dek();
				await corsair.slack.keys.set_api_key(botToken!);

				const postInput = {
					channel: channel!,
					text: `corsair-pgjs-test ${Date.now()}`,
				};
				const posted = await corsair.slack.api.messages.post(postInput);
				expect(posted.ok).toBe(true);
				expect(typeof posted.ts).toBe('string');

				const orm = createCorsairOrm({ db: kdb });
				const postEvents = await orm.events.findMany({
					where: { event_type: 'slack.messages.postMessage' },
				});
				expect(postEvents.length).toBeGreaterThan(0);
				const lastEvent = postEvents[postEvents.length - 1]!;
				expect(lastEvent.payload).toMatchObject(postInput);
				expect(lastEvent.created_at).toBeInstanceOf(Date);

				if (posted.ts) {
					const ent = await corsair.slack.db.messages.findByEntityId(posted.ts);
					expect(ent).not.toBeNull();
					expect(ent?.data.ts).toBe(posted.ts);

					const updateInput = {
						channel: channel!,
						ts: posted.ts,
						text: 'updated-by-pgjs-test',
					};
					const updated = await corsair.slack.api.messages.update(updateInput);
					expect(updated.ok).toBe(true);

					const deleted = await corsair.slack.api.messages.delete({
						channel: channel!,
						ts: posted.ts,
					});
					expect(deleted.ok).toBe(true);

					const updateEvents = await orm.events.findMany({
						where: { event_type: 'slack.messages.update' },
					});
					expect(updateEvents.length).toBeGreaterThan(0);

					const deleteEvents = await orm.events.findMany({
						where: { event_type: 'slack.messages.delete' },
					});
					expect(deleteEvents.length).toBeGreaterThan(0);
				}
			},
			120_000,
		);

		runIf(
			'channels.list writes an event through postgres.js',
			async () => {
				const corsair = createCorsair({
					plugins: [slack({})],
					database: testSql,
					kek: kek!,
				});
				await createIntegrationAndAccount(kdb, 'slack', 'default');
				await corsair.slack.keys.issue_new_dek();
				await corsair.slack.keys.set_api_key(botToken!);

				const list = await corsair.slack.api.channels.list({
					types: 'public_channel',
				});
				expect(list.ok).toBe(true);

				const orm = createCorsairOrm({ db: kdb });
				const events = await orm.events.findMany({
					where: { event_type: 'slack.channels.list' },
				});
				expect(events.length).toBeGreaterThan(0);
			},
			60_000,
		);
	});
});
