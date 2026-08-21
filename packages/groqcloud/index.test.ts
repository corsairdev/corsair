import { groqcloud } from './index';

describe('groqcloud plugin', () => {
	it('should create the plugin successfully', () => {
		const plugin = groqcloud({ key: 'test_key' });
		expect(plugin.id).toBe('groqcloud');
		expect(plugin.authConfig!.api_key!.account).toEqual(['one']);
	});
});
