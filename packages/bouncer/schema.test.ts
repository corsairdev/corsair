import { BouncerSchema } from './schema';

describe('Bouncer schema', () => {
	it('declares a semver version', () => {
		expect(BouncerSchema.version).toBeDefined();
		expect(BouncerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all entities', () => {
		expect(typeof BouncerSchema.entities).toBe('object');
		expect(BouncerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BouncerSchema.entities))).toBe(true);

		const entityKeys = Object.keys(BouncerSchema.entities);
		expect(entityKeys).toContain('emailVerifications');
		expect(entityKeys).toContain('domainVerifications');
		expect(entityKeys).toContain('batchVerifications');
		expect(entityKeys).toContain('toxicityJobs');

		for (const entity of Object.values(BouncerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
