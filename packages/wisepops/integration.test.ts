import { wisepops } from './index';

describe('Wisepops Integration', () => {
	it('should initialize the plugin correctly', () => {
		const plugin = wisepops({ key: 'test-key' });
		expect(plugin.id).toBe('wisepops');
		expect(plugin.endpoints?.contacts.get).toBeDefined();
		expect(plugin.endpoints?.performance.get).toBeDefined();
		expect(plugin.endpoints?.webhook.create).toBeDefined();
		expect(plugin.endpoints?.webhook.delete).toBeDefined();
		expect(plugin.endpoints?.dataPrivacy.delete).toBeDefined();
	});
});
