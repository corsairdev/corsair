import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { gitea } from './index';

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

describe('gitea plugin', () => {
	it('declares api_key auth with the instance URL as account config', () => {
		const plugin = gitea();
		expect(plugin.id).toBe('gitea');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['instance_url'] },
		});
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(530);
		expect(Object.keys(plugin.webhooks as object).sort()).toEqual([
			'fork',
			'issueComment',
			'issues',
			'package',
			'pullRequest',
			'pullRequestReview',
			'push',
			'refCreated',
			'refDeleted',
			'release',
			'repository',
			'status',
			'wiki',
			'workflowJob',
			'workflowRun',
		]);
	});

	it('calls through createCorsair with the key and instance from options', async () => {
		const fetchSpy = replyOnce({ id: 1, login: 'ada' });
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'gitea', 'default');
		const corsair = createCorsair({
			plugins: [gitea({ key: 'gt_opt', instanceUrl: 'https://codeberg.org' })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		const me = await corsair.gitea.api.user.me({});
		expect(me).toMatchObject({ login: 'ada' });
		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://codeberg.org/api/v1/user');
		expect(new Headers(init.headers).get('authorization')).toBe('token gt_opt');
		await testDb.cleanup?.();
	});

	it('asks to connect when the key or the instance is missing', async () => {
		const plugin = gitea();
		const keys = {
			get_api_key: async () => null,
			get_instance_url: async () => 'https://gitea.com',
			get_webhook_signature: async () => 'stored-secret',
		};
		// `never` because the test builds only the fields keyBuilder reads.
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		const noInstance = {
			keys: {
				...keys,
				get_api_key: async () => 'gt',
				get_instance_url: async () => null,
			},
		} as never;
		await expect(
			plugin.keyBuilder?.(noInstance, 'endpoint'),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...keys, get_api_key: async () => 'gt' } } as never,
				'endpoint',
			),
		).resolves.toBe('gt');
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe(
			'stored-secret',
		);
		await expect(
			gitea({ webhookSecret: 'opt' }).keyBuilder?.(ctx, 'webhook'),
		).resolves.toBe('opt');
	});

	it('never sends a stored token to another host than its stored instance', async () => {
		const keys = {
			get_api_key: async () => 'stored-token',
			get_instance_url: async () => 'https://git.example.com',
			get_webhook_signature: async () => null,
		};
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		// The stored pair, with or without the same instance as an option.
		await expect(gitea().keyBuilder?.(ctx, 'endpoint')).resolves.toBe(
			'stored-token',
		);
		await expect(
			gitea({ instanceUrl: 'https://git.example.com/api/v1/' }).keyBuilder?.(
				ctx,
				'endpoint',
			),
		).resolves.toBe('stored-token');
		// Another host: refused unless the caller brings its own key for it.
		await expect(
			gitea({ instanceUrl: 'https://evil.example' }).keyBuilder?.(
				ctx,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			gitea({ instanceUrl: 'https://evil.example', key: 'own' }).keyBuilder?.(
				ctx,
				'endpoint',
			),
		).resolves.toBe('own');
		const noStoredInstance = {
			keys: { ...keys, get_instance_url: async () => null },
		} as never;
		await expect(
			gitea({ instanceUrl: 'https://git.example.com' }).keyBuilder?.(
				noStoredInstance,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
	});

	it('builds schemas only when they are read', () => {
		const plugin = gitea();
		const entry = Object.getOwnPropertyDescriptor(
			plugin.endpointSchemas?.['repos.get'] ?? {},
			'input',
		);
		expect(typeof entry?.get).toBe('function');
	});
});
