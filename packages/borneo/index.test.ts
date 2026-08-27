import { borneo } from './index';

type TestKeyBuilder = (
	ctx: {
		authType: 'api_key' | 'oauth_2';
		options: Record<string, unknown>;
		keys: {
			get_api_key?: () => Promise<string | null>;
			get_access_token?: () => Promise<string | null>;
		};
	},
	source: 'endpoint',
) => Promise<string>;

function getKeyBuilder(plugin: ReturnType<typeof borneo>): TestKeyBuilder {
	if (!plugin.keyBuilder) {
		throw new Error('Borneo keyBuilder is not configured');
	}
	return plugin.keyBuilder as unknown as TestKeyBuilder;
}

describe('Borneo authentication', () => {
	it('uses an explicit plugin key before stored credentials', async () => {
		const plugin = borneo({ key: 'explicit-key' });
		const keyBuilder = getKeyBuilder(plugin);
		const key = await keyBuilder(
			{
				authType: 'api_key',
				options: plugin.options ?? {},
				keys: {
					get_api_key: jest.fn().mockResolvedValue('stored-key'),
				},
			},
			'endpoint',
		);

		expect(key).toBe('explicit-key');
	});

	it('loads a stored API key', async () => {
		const plugin = borneo({ authType: 'api_key' });
		const key = await getKeyBuilder(plugin)(
			{
				authType: 'api_key',
				options: plugin.options ?? {},
				keys: {
					get_api_key: jest.fn().mockResolvedValue('stored-key'),
				},
			},
			'endpoint',
		);
		expect(key).toBe('stored-key');
	});

	it('loads a stored OAuth access token', async () => {
		const plugin = borneo({ authType: 'oauth_2' });
		const key = await getKeyBuilder(plugin)(
			{
				authType: 'oauth_2',
				options: plugin.options ?? {},
				keys: {
					get_access_token: jest.fn().mockResolvedValue('oauth-token'),
				},
			},
			'endpoint',
		);
		expect(key).toBe('oauth-token');
	});

	it('rejects missing API-key credentials', async () => {
		const plugin = borneo({ authType: 'api_key' });
		await expect(
			getKeyBuilder(plugin)(
				{
					authType: 'api_key',
					options: plugin.options ?? {},
					keys: {
						get_api_key: jest.fn().mockResolvedValue(null),
					},
				},
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('rejects missing OAuth credentials', async () => {
		const plugin = borneo({ authType: 'oauth_2' });
		await expect(
			getKeyBuilder(plugin)(
				{
					authType: 'oauth_2',
					options: plugin.options ?? {},
					keys: {
						get_access_token: jest.fn().mockResolvedValue(null),
					},
				},
				'endpoint',
			),
		).rejects.toThrow();
	});
});
