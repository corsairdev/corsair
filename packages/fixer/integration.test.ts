import { fixer, fixerEndpointMeta } from './index';

describe('Fixer plugin factory', () => {
	it('exposes the endpoint tree, read-only metadata and no webhooks', () => {
		const plugin = fixer({ key: 'fixer-test-key' });

		expect(plugin.id).toBe('fixer');
		expect(Object.keys(plugin.endpoints?.rates ?? {}).sort()).toEqual([
			'convert',
			'historical',
			'latest',
		]);
		expect(Object.keys(plugin.endpoints?.currencies ?? {})).toEqual(['getAll']);
		expect(
			Object.values(fixerEndpointMeta).map((meta) => meta.riskLevel),
		).toEqual(['read', 'read', 'read', 'read']);
		expect(plugin.webhooks).toEqual({});
	});
});
