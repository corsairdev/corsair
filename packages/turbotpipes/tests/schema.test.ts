import { TurbotPipesSchema } from '../schema';

describe('TurbotPipes schema', () => {
	it('declares a semver version', () => {
		expect(TurbotPipesSchema.version).toBeDefined();
		expect(TurbotPipesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with required database entities', () => {
		expect(typeof TurbotPipesSchema.entities).toBe('object');
		expect(TurbotPipesSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(TurbotPipesSchema.entities);
		expect(entityKeys.length).toBeGreaterThan(0);
		expect(entityKeys).toContain('actor');
		expect(entityKeys).toContain('user');
		expect(entityKeys).toContain('org');
		expect(entityKeys).toContain('workspace');
		expect(entityKeys).toContain('connection');
		expect(entityKeys).toContain('query');
		expect(entityKeys).toContain('datatank');
		expect(entityKeys).toContain('process');
	});
});
