import { vestaboard, vestaboardAuthConfig, vestaboardEndpointMeta, vestaboardEndpointSchemas } from './index';

describe('Vestaboard Plugin Structure Tests', () => {
	it('instantiates plugin with default options', () => {
		const plugin = vestaboard({ key: 'test-key' });
		expect(plugin.id).toBe('vestaboard');
		expect(plugin.options?.key).toBe('test-key');
		expect((plugin.options as Record<string, unknown>)?.authType).toBe('api_key');
	});

	it('configures authConfig correctly', () => {
		expect(vestaboardAuthConfig.api_key.account).toContain('api_key');
	});

	it('defines all required endpoint schemas', () => {
		expect(vestaboardEndpointSchemas['message.get']).toBeDefined();
		expect(vestaboardEndpointSchemas['message.post']).toBeDefined();
		expect(vestaboardEndpointSchemas['message.clear']).toBeDefined();
		expect(vestaboardEndpointSchemas['subscriptions.list']).toBeDefined();
		expect(vestaboardEndpointSchemas['subscriptions.get']).toBeDefined();
		expect(vestaboardEndpointSchemas['subscriptions.postMessage']).toBeDefined();
		expect(vestaboardEndpointSchemas['viewer.get']).toBeDefined();
	});

	it('defines endpoint metadata with correct risk levels', () => {
		expect(vestaboardEndpointMeta['message.get'].riskLevel).toBe('read');
		expect(vestaboardEndpointMeta['message.post'].riskLevel).toBe('write');
		expect(vestaboardEndpointMeta['message.clear'].riskLevel).toBe('write');
		expect(vestaboardEndpointMeta['subscriptions.list'].riskLevel).toBe('read');
		expect(vestaboardEndpointMeta['subscriptions.get'].riskLevel).toBe('read');
		expect(vestaboardEndpointMeta['subscriptions.postMessage'].riskLevel).toBe('write');
		expect(vestaboardEndpointMeta['viewer.get'].riskLevel).toBe('read');
	});

	it('keyBuilder returns provided options.key', async () => {
		const plugin = vestaboard({ key: 'custom-rw-key' });
		const mockContext = {
			authType: 'api_key' as const,
			keys: {
				get_api_key: jest.fn().mockResolvedValue('stored-api-key'),
			},
		};

		if (plugin.keyBuilder) {
			const key = await (plugin.keyBuilder as any)(mockContext, 'endpoint');
			expect(key).toBe('custom-rw-key');
		}
	});
});
