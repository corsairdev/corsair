import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { clearFirebaseTokenCache } from './client';
import { firebase } from './index';

afterEach(() => {
	jest.restoreAllMocks();
	clearFirebaseTokenCache();
});

describe('firebase plugin', () => {
	it('declares api_key auth and every operation', () => {
		const plugin = firebase();
		expect(plugin.id).toBe('firebase');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(405);
		expect(plugin.webhooks).toEqual({});
	});

	it('calls through createCorsair with an access token from options', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ results: [] }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'firebase', 'default');
		const corsair = createCorsair({
			plugins: [firebase({ key: 'ya29.opt' })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await corsair.firebase.api.management.projects.list({ pageSize: 5 });
		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://firebase.googleapis.com/v1beta1/projects?pageSize=5',
		);
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer ya29.opt',
		);
		await testDb.cleanup?.();
	});

	it('asks to connect when no key is stored, unless every call goes to an emulator', async () => {
		const ctx = {
			keys: { get_api_key: async () => null },
			authType: 'api_key',
			options: {},
		} as never;
		await expect(
			firebase().keyBuilder?.(ctx, 'endpoint'),
		).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		await expect(
			firebase({
				emulatorUrls: { firestore: 'http://127.0.0.1:8080/' },
			}).keyBuilder?.(ctx, 'endpoint'),
		).resolves.toBe('emulator');
		await expect(
			firebase().keyBuilder?.(
				{ keys: { get_api_key: async () => '{"stored":1}' } } as never,
				'endpoint',
			),
		).resolves.toBe('{"stored":1}');
	});

	it('builds schemas only when they are read', () => {
		const plugin = firebase();
		const entry = Object.getOwnPropertyDescriptor(
			plugin.endpointSchemas?.['firestore.databases.documents.get'] ?? {},
			'input',
		);
		expect(typeof entry?.get).toBe('function');
	});
});
