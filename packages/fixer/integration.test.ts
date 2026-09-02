import { fixer } from './index';

describe('Fixer Plugin Integration', () => {
	it('instantiates plugin with default options', () => {
		const plugin = fixer({ accessKey: 'fixer_test_key_123' });
		expect(plugin.id).toBe('fixer');
		expect(plugin.options?.accessKey).toBe('fixer_test_key_123');
	});

	it('defines endpoints tree correctly', () => {
		const plugin = fixer({ accessKey: 'fixer_test_key_123' });
		expect(plugin.endpoints?.rates?.latest).toBeDefined();
		expect(plugin.endpoints?.rates?.convert).toBeDefined();
		expect(plugin.endpoints?.rates?.historical).toBeDefined();
		expect(plugin.endpoints?.currencies?.getAll).toBeDefined();
	});

	it('registers endpoint metadata correctly', () => {
		const plugin = fixer({ accessKey: 'fixer_test_key_123' });
		expect(plugin.endpointMeta?.['rates.latest']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta?.['rates.convert']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta?.['rates.historical']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta?.['currencies.getAll']?.riskLevel).toBe('read');
	});
});
