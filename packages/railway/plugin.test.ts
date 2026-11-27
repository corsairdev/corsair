import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { railway } from './index';

afterEach(() => {
	jest.restoreAllMocks();
});

function replyOnce(body: unknown) {
	return jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		}),
	);
}

describe('railway plugin', () => {
	it('declares api_key auth and every operation', () => {
		const plugin = railway();
		expect(plugin.id).toBe('railway');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(394);
		expect(plugin.webhooks).toEqual({});
	});

	it('calls through createCorsair with a bearer token', async () => {
		const fetchSpy = replyOnce({ data: { me: { id: 'u1', name: 'Ada' } } });
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'railway', 'default');
		const corsair = createCorsair({
			plugins: [railway({ key: 'rlwy_opt' })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		const me = await corsair.railway.api.me.get({});
		expect(me).toMatchObject({ id: 'u1' });
		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://backboard.railway.com/graphql/v2');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer rlwy_opt',
		);
		await testDb.cleanup?.();
	});

	it('sends a project token in Project-Access-Token', async () => {
		const fetchSpy = replyOnce({
			data: { projectToken: { projectId: 'p1', environmentId: 'e1' } },
		});
		const corsair = createCorsair({
			plugins: [railway({ key: 'proj_tok', tokenKind: 'project' })],
		});
		await corsair.railway.api.projectTokens.get({});
		const headers = new Headers(
			(fetchSpy.mock.calls[0] as [string, RequestInit])[1].headers,
		);
		expect(headers.get('project-access-token')).toBe('proj_tok');
		expect(headers.get('authorization')).toBeNull();
	});

	it('asks to connect when no key is stored', async () => {
		const plugin = railway();
		const ctx = {
			keys: { get_api_key: async () => null },
			authType: 'api_key',
			options: {},
		} as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		await expect(
			plugin.keyBuilder?.(
				{ keys: { get_api_key: async () => 'stored' } } as never,
				'endpoint',
			),
		).resolves.toBe('stored');
	});

	it('builds schemas only when they are read', () => {
		const plugin = railway();
		const entry = Object.getOwnPropertyDescriptor(
			plugin.endpointSchemas?.['projects.get'] ?? {},
			'input',
		);
		expect(typeof entry?.get).toBe('function');
	});
});
