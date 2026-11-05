import { render, renderAuthConfig } from './index';

describe('Render plugin auth', () => {
	it('needs only the API key, so a stored key makes the connection ready', () => {
		// Any extra account field would be required by core auth status and keep
		// a valid key at `partial`; keyBuilder only ever reads the API key.
		expect(renderAuthConfig).toEqual({ api_key: { account: [] } });
		expect(render().authConfig).toBe(renderAuthConfig);
	});

	it('resolves the stored API key for endpoint calls', async () => {
		const plugin = render();
		const key = await plugin.keyBuilder?.(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'rnd_stored' },
			} as never,
			'endpoint',
		);
		expect(key).toBe('rnd_stored');
	});

	it('fails clearly when no API key is stored', async () => {
		const plugin = render();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});
});
