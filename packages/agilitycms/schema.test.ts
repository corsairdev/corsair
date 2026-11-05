import { AgilityCmsSchema } from './schema';

describe('Agility CMS schema', () => {
	it('declares a semver version', () => {
		expect(AgilityCmsSchema.version).toBeDefined();
		expect(AgilityCmsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares all 7 database entities', () => {
		expect(typeof AgilityCmsSchema.entities).toBe('object');
		expect(AgilityCmsSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(AgilityCmsSchema.entities);
		expect(entityKeys).toContain('contentItems');
		expect(entityKeys).toContain('pages');
		expect(entityKeys).toContain('contentModels');
		expect(entityKeys).toContain('pageModules');
		expect(entityKeys).toContain('sitemapNodes');
		expect(entityKeys).toContain('syncItems');
		expect(entityKeys).toContain('syncPages');
		for (const entity of Object.values(AgilityCmsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('schema version is 1.0.0', () => {
		expect(AgilityCmsSchema.version).toBe('1.0.0');
	});
});
