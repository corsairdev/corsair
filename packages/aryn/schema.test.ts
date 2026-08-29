import { ArynSchema } from './schema';

describe('Aryn schema', () => {
	it('declares a semver version', () => {
		expect(ArynSchema.version).toBeDefined();
		expect(ArynSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ArynSchema.entities).toBe('object');
		expect(ArynSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ArynSchema.entities))).toBe(true);
		for (const entity of Object.values(ArynSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

