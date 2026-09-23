import { BeamerSchema } from './schema';

describe('Beamer schema', () => {
	it('declares a semver version', () => {
		expect(BeamerSchema.version).toBeDefined();
		expect(BeamerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BeamerSchema.entities).toBe('object');
		expect(BeamerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BeamerSchema.entities))).toBe(true);
		for (const entity of Object.values(BeamerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
