import { breathehr } from './index';

describe('Breathe HR Plugin', () => {
	it('initializes with default options', () => {
		const plugin = breathehr({ key: 'test_key' });
		expect(plugin.id).toBe('breathehr');
		expect(plugin.endpoints.employees.list).toBeDefined();
		expect(plugin.endpoints.employees.get).toBeDefined();
		expect(plugin.endpoints.employees.create).toBeDefined();
		expect(plugin.endpoints.leaves.list).toBeDefined();
		expect(plugin.endpoints.leaves.get).toBeDefined();
	});
});
