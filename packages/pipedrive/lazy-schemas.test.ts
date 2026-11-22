import { PipedriveCatalog } from './endpoints/catalog-schemas';
import { pipedrive } from './index';

describe('catalog schemas are built on first use', () => {
	it('keeps every catalog schema unbuilt after the plugin is created', () => {
		pipedrive();
		for (const entry of Object.values(PipedriveCatalog)) {
			expect(typeof Object.getOwnPropertyDescriptor(entry, 'input')?.get).toBe(
				'function',
			);
			expect(typeof Object.getOwnPropertyDescriptor(entry, 'output')?.get).toBe(
				'function',
			);
		}
	});

	it('builds a schema once and returns the same instance afterwards', () => {
		const key = 'apiV2.deals.getArchivedDeals';
		const plugin = pipedrive();
		const first = plugin.endpointSchemas[key].output;
		expect(first.safeParse({ success: true, data: [] }).success).toBe(true);
		expect(plugin.endpointSchemas[key].output).toBe(first);
		expect(PipedriveCatalog[key].output).toBe(first);
		expect(
			Object.getOwnPropertyDescriptor(PipedriveCatalog[key], 'output')?.value,
		).toBe(first);
	});
});
