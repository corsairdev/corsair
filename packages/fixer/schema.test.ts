import { FixerSchema } from './schema';

describe('Fixer schema', () => {
	it('declares a semver version', () => {
		expect(FixerSchema.version).toBeDefined();
		expect(FixerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FixerSchema.entities).toBe('object');
		expect(FixerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FixerSchema.entities))).toBe(true);
		for (const entity of Object.values(FixerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
