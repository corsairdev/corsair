import { DiffbotSchema } from './schema';

describe('Diffbot schema', () => {
	it('declares a semver version', () => {
		expect(DiffbotSchema.version).toBeDefined();
		expect(DiffbotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all official ontology tables', () => {
		expect(typeof DiffbotSchema.entities).toBe('object');
		expect(DiffbotSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(DiffbotSchema.entities);
		expect(entityKeys.length).toBeGreaterThanOrEqual(10);
		expect(entityKeys).toContain('articles');
		expect(entityKeys).toContain('products');
		expect(entityKeys).toContain('discussions');
		expect(entityKeys).toContain('images');
		expect(entityKeys).toContain('videos');
		expect(entityKeys).toContain('events');
		expect(entityKeys).toContain('jobs');
		expect(entityKeys).toContain('lists');
		expect(entityKeys).toContain('organizations');
		expect(entityKeys).toContain('people');
		expect(entityKeys).toContain('crawlJobs');
		expect(entityKeys).toContain('bulkJobs');
		expect(entityKeys).toContain('customApis');
		expect(entityKeys).toContain('accounts');

		for (const entity of Object.values(DiffbotSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
