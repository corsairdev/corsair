import { wisepops } from './index';

describe('Wisepops Integration', () => {
	it('should initialize the plugin correctly', async () => {
		const plugin = wisepops({ key: 'test-key' });
		expect(plugin.id).toBe('wisepops');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.endpoints?.contacts.get).toBeDefined();
		expect(plugin.endpoints?.performance.get).toBeDefined();
		expect(plugin.endpoints?.webhook.create).toBeDefined();
		expect(plugin.endpoints?.webhook.delete).toBeDefined();
		expect(plugin.endpoints?.dataPrivacy.delete).toBeDefined();

		// Verify keyBuilder
		expect(plugin.keyBuilder).toBeDefined();
		const keyBuilderFn = plugin.keyBuilder as any;

		const keyFromOptions = await keyBuilderFn(
			{ authType: 'api_key', keys: {} },
			'endpoint',
		);
		expect(keyFromOptions).toBe('test-key');

		const keyFromKeys = await (wisepops().keyBuilder as any)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'key-from-storage' },
			},
			'endpoint',
		);
		expect(keyFromKeys).toBe('key-from-storage');
	});
});
