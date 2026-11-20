import crypto from 'node:crypto';
import { bindEndpointsRecursively } from '../core/endpoints/bind';
import type { CorsairPlugin, EndpointMetaEntry } from '../core/plugins';
import * as orm from '../db/kysely/orm';
import type { HubConfig } from '../hub/types';
import { createTestDatabase } from './setup-db';

const hub: HubConfig = {
	projectApiKey: 'ck_cloud_test',
	signingSecret: 'signing-secret',
	apiUrl: 'https://hub.test',
	instanceKey: 'main',
};

// unknown: a fixture with only the fields bind reads, not a full CorsairPlugin.
const plugin = {
	id: 'reducto',
	options: { authType: 'managed_pricing' as const },
} as unknown as CorsairPlugin;

const META: Record<string, EndpointMetaEntry> = {
	'parse.parse': { riskLevel: 'read' },
};

// unknown: the fake endpoint takes and returns whatever each test hands it.
type Api = { parse: { parse: (args: unknown) => Promise<unknown> } };

const test = createTestDatabase();

// unknown: bind fills the tree with the endpoint's own types, which this fake does not declare.
function bind(run: () => Promise<unknown>, database = test.database): Api {
	const tree: Record<string, unknown> = {};
	bindEndpointsRecursively({
		endpoints: { parse: { parse: () => run() } },
		hooks: undefined,
		ctx: { $getAccountId: async () => 'acct-1' },
		tree,
		pluginId: 'reducto',
		errorHandlers: {},
		currentPath: [],
		endpointMeta: META,
		tenantId: 'me',
		hubConfig: hub,
		plugin,
		database,
	});
	return tree as Api;
}

// Hub hands out one idempotency key per call unless `fixedKey` pins it.
// unknown: failed_when is free-form JSON the hub sends back.
function mockHub(failedWhen?: Record<string, unknown>) {
	const keys: string[] = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const url = String(input);
		if (url.endsWith('/managed-pricing/credentials')) {
			keys.push(JSON.parse(String(init?.body)).idempotencyKey);
		}
		const body = url.endsWith('/managed-pricing/credentials')
			? { api_key: 'k', expires_in: 300, failed_when: failedWhen }
			: { status: 'released', creditsReturned: 1 };
		return new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	});
	return keys;
}

const saved = () =>
	test.db
		.selectFrom('corsair_entities')
		.selectAll()
		.where('entity_type', '=', 'managed_result')
		.execute();

afterEach(async () => {
	jest.restoreAllMocks();
	await test.db.deleteFrom('corsair_entities').execute();
});
afterAll(() => test.cleanup());

describe('a managed-pricing call', () => {
	it('stores its result under managed_result keyed by the idempotency key', async () => {
		const keys = mockHub();
		await bind(async () => ({ people: [{ email: 'a@b.co' }] })).parse.parse({
			q: 'x',
		});

		const rows = await saved();
		expect(rows).toHaveLength(1);
		expect(rows[0]?.entity_id).toBe(keys[0]);
		expect(JSON.parse(String(rows[0]?.data))).toMatchObject({
			operation: 'parse.parse',
			args: { q: 'x' },
			result: { people: [{ email: 'a@b.co' }] },
		});
	});

	it('upserts the same row when the key repeats', async () => {
		mockHub();
		jest
			.spyOn(crypto, 'randomUUID')
			.mockReturnValue('00000000-0000-4000-8000-000000000001');
		await bind(async () => ({ n: 1 })).parse.parse({});
		await bind(async () => ({ n: 2 })).parse.parse({});

		const rows = await saved();
		expect(rows).toHaveLength(1);
		expect(JSON.parse(String(rows[0]?.data)).result).toEqual({ n: 2 });
	});

	it('stores nothing when the call fails', async () => {
		mockHub();
		await expect(
			bind(async () => {
				throw new Error('boom');
			}).parse.parse({}),
		).rejects.toThrow('boom');
		expect(await saved()).toHaveLength(0);
	});

	it('stores nothing when the answer says it failed', async () => {
		mockHub({ path: 'success', equals: false });
		await bind(async () => ({ success: false })).parse.parse({});
		expect(await saved()).toHaveLength(0);
	});

	it('stores an oversize result truncated', async () => {
		mockHub();
		await bind(async () => ({ blob: 'x'.repeat(300 * 1024) })).parse.parse({});

		const data = JSON.parse(String((await saved())[0]?.data));
		expect(data.truncated).toBe(true);
		expect(data.result).toBeUndefined();
		expect(data.operation).toBe('parse.parse');
	});

	it('measures the size in UTF-8 bytes, so a multi-byte result over the cap is truncated', async () => {
		mockHub();
		// 100K "€" is ~100K UTF-16 units but ~300 KB of UTF-8.
		await bind(async () => ({ blob: '€'.repeat(100 * 1024) })).parse.parse({});

		const data = JSON.parse(String((await saved())[0]?.data));
		expect(data.truncated).toBe(true);
		expect(data.result).toBeUndefined();
	});

	it('stores the result as it was returned, even if the caller changes it after', async () => {
		mockHub();
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		let stored = '';
		// unknown: a stand-in client that writes after the save stops waiting.
		jest.spyOn(orm, 'createKyselyEntityClient').mockReturnValue({
			upsertByEntityId: (_id: string, data: unknown) =>
				new Promise<void>((resolve) =>
					setTimeout(() => {
						stored = JSON.stringify(data);
						resolve();
					}, 1_500),
				),
		} as unknown as ReturnType<typeof orm.createKyselyEntityClient>);

		const answer = await bind(async () => ({ n: 1 })).parse.parse({});
		(answer as { n: number }).n = 2;
		await new Promise((r) => setTimeout(r, 700));

		expect(JSON.parse(stored).result).toEqual({ n: 1 });
	});

	it('returns the answer when the save hangs', async () => {
		mockHub();
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		// unknown: a stand-in client with only the upsert the save calls.
		jest.spyOn(orm, 'createKyselyEntityClient').mockReturnValue({
			upsertByEntityId: () => new Promise(() => {}),
		} as unknown as ReturnType<typeof orm.createKyselyEntityClient>);

		const started = Date.now();
		await expect(
			bind(async () => ({ ok: true })).parse.parse({}),
		).resolves.toEqual({
			ok: true,
		});
		expect(Date.now() - started).toBeLessThan(2_000);
		expect(warn).toHaveBeenCalled();
	});

	it('is not failed by a save error', async () => {
		mockHub();
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		// unknown: a database whose only method throws, not a full CorsairDatabase.
		const broken = {
			db: {
				selectFrom: () => {
					throw new Error('db down');
				},
			},
		} as unknown as typeof test.database;

		await expect(
			bind(async () => ({ ok: true }), broken).parse.parse({}),
		).resolves.toEqual({ ok: true });
		expect(warn).toHaveBeenCalled();
	});
});
