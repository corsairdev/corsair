import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { wordpress } from './index';

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

const basic = (user: string, password: string) =>
	`Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;

describe('wordpress plugin', () => {
	it('declares api_key auth with the site URL and username as account config', () => {
		const plugin = wordpress();
		expect(plugin.id).toBe('wordpress');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['site_url', 'username'] },
		});
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(209);
		expect(plugin.webhooks).toEqual({});
	});

	it('calls through createCorsair with the password, site and login from options', async () => {
		const fetchSpy = replyOnce({ id: 1, name: 'ada' });
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'wordpress', 'default');
		const corsair = createCorsair({
			plugins: [
				wordpress({
					key: 'abcd efgh ijkl mnop',
					siteUrl: 'https://example.com/blog/',
					username: 'ada',
				}),
			],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		const me = await corsair.wordpress.api.users.me({ context: 'edit' });
		expect(me).toMatchObject({ name: 'ada' });
		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://example.com/blog/wp-json/wp/v2/users/me?context=edit',
		);
		// Spaces in the shown password are dropped.
		expect(new Headers(init.headers).get('authorization')).toBe(
			basic('ada', 'abcdefghijklmnop'),
		);
		await testDb.cleanup?.();
	});

	it('asks to connect when the password, site or login is missing', async () => {
		const plugin = wordpress();
		const keys = {
			get_api_key: async () => null,
			get_site_url: async () => 'https://example.com',
			get_username: async () => 'ada',
		};
		// `never` because the test builds only the fields keyBuilder reads.
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		const withKey = { ...keys, get_api_key: async () => 'pw' };
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...withKey, get_site_url: async () => null } } as never,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...withKey, get_username: async () => null } } as never,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			plugin.keyBuilder?.({ keys: withKey } as never, 'endpoint'),
		).resolves.toBe('pw');
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe('');
	});

	it('never sends a stored password to another site than its stored one', async () => {
		const keys = {
			get_api_key: async () => 'stored-password',
			get_site_url: async () => 'https://example.com',
			get_username: async () => 'ada',
		};
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(wordpress().keyBuilder?.(ctx, 'endpoint')).resolves.toBe(
			'stored-password',
		);
		await expect(
			wordpress({ siteUrl: 'https://example.com/wp-json/' }).keyBuilder?.(
				ctx,
				'endpoint',
			),
		).resolves.toBe('stored-password');
		await expect(
			wordpress({ siteUrl: 'https://evil.example' }).keyBuilder?.(
				ctx,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			wordpress({
				siteUrl: 'https://evil.example',
				key: 'own',
			}).keyBuilder?.(ctx, 'endpoint'),
		).resolves.toBe('own');
	});

	it('builds schemas only when they are read', () => {
		const plugin = wordpress();
		const entry = Object.getOwnPropertyDescriptor(
			plugin.endpointSchemas?.['posts.get'] ?? {},
			'input',
		);
		expect(typeof entry?.get).toBe('function');
	});
});
