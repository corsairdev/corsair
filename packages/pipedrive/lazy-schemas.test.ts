import { PipedriveCatalog } from './endpoints/catalog-schemas';
import { pipedrive, pipedriveEndpointSchemas } from './index';

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
		const first = pipedriveEndpointSchemas[key].output;
		expect(first.safeParse({ success: true, data: [] }).success).toBe(true);
		expect(pipedriveEndpointSchemas[key].output).toBe(first);
		expect(PipedriveCatalog[key].output).toBe(first);
		expect(
			Object.getOwnPropertyDescriptor(PipedriveCatalog[key], 'output')?.value,
		).toBe(first);
	});
});

describe('required query and body fields', () => {
	it('rejects calls that leave out a required query or body group', () => {
		expect(
			PipedriveCatalog['apiV2.deals.searchDeals'].input.safeParse({}).success,
		).toBe(false);
		expect(
			PipedriveCatalog['apiV2.deals.searchDeals'].input.safeParse({
				query: { term: 'corsair' },
			}).success,
		).toBe(true);
		expect(
			PipedriveCatalog['apiV2.pipelines.addPipeline'].input.safeParse({})
				.success,
		).toBe(false);
	});
});
