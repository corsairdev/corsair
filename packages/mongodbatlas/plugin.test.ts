import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { clearMongoDBAtlasAuthCache } from './client';
import { mongodbatlas } from './index';

afterEach(() => {
	jest.restoreAllMocks();
	clearMongoDBAtlasAuthCache();
});

describe('mongodbatlas plugin', () => {
	it('declares api_key auth and every operation', () => {
		const plugin = mongodbatlas();
		expect(plugin.id).toBe('mongodbatlas');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(489);
		expect(plugin.webhooks).toEqual({});
	});

	it('calls through createCorsair with an access token from options', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ results: [], totalCount: 0 }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'mongodbatlas', 'default');
		const corsair = createCorsair({
			plugins: [mongodbatlas({ key: 'atlas-token' })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await corsair.mongodbatlas.api.clusters.listClusters({
			groupId: '5f43e7f0a1b2c3d4e5f60718',
		});
		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://cloud.mongodb.com/api/atlas/v2/groups/5f43e7f0a1b2c3d4e5f60718/clusters?itemsPerPage=100',
		);
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer atlas-token',
		);
		await testDb.cleanup?.();
	});

	it('asks to connect when no key is stored', async () => {
		const ctx = {
			keys: { get_api_key: async () => null },
			authType: 'api_key',
			options: {},
		} as never;
		await expect(
			mongodbatlas().keyBuilder?.(ctx, 'endpoint'),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			mongodbatlas().keyBuilder?.(
				{ keys: { get_api_key: async () => 'id:secret' } } as never,
				'endpoint',
			),
		).resolves.toBe('id:secret');
	});

	it('builds schemas only when they are read', () => {
		const plugin = mongodbatlas();
		const entry = Object.getOwnPropertyDescriptor(
			plugin.endpointSchemas?.['clusters.getCluster'] ?? {},
			'input',
		);
		expect(typeof entry?.get).toBe('function');
	});
});
