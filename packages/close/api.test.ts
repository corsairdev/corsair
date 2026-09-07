import { close } from './index';

describe('Close plugin initialization', () => {
	it('initializes with default options', () => {
		const plugin = close({ key: 'test_api_key' });
		expect(plugin.id).toBe('close');
		expect((plugin.options as { authType?: string }).authType).toBe('api_key');
		expect(plugin.endpoints?.leads).toBeDefined();
		expect(plugin.endpoints?.contacts).toBeDefined();
		expect(plugin.endpoints?.opportunities).toBeDefined();
		expect(plugin.endpoints?.tasks).toBeDefined();
		expect(plugin.endpoints?.activities).toBeDefined();
		expect(plugin.endpoints?.users).toBeDefined();
		expect(plugin.endpoints?.customFields).toBeDefined();
	});

	it('matches tenant webhook headers correctly', () => {
		const plugin = close({ key: 'test_api_key' });
		const match = plugin.pluginTenantWebhookMatcher?.({
			headers: {},
			body: JSON.stringify({ organization_id: 'orga_999' }),
		});
		expect(match).toEqual({
			linkType: 'organization_id',
			externalId: 'orga_999',
		});
	});
});
