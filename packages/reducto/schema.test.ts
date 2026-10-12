import { ReductoSchema } from './schema';

describe('Reducto schema', () => {
	it('declares a semver version', () => {
		expect(ReductoSchema.version).toBeDefined();
		expect(ReductoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ReductoSchema.entities).toBe('object');
		expect(ReductoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ReductoSchema.entities))).toBe(true);
		for (const entity of Object.values(ReductoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
