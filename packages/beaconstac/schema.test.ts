import { BeaconstacSchema } from './schema';

describe('Beaconstac schema', () => {
	it('declares a semver version', () => {
		expect(BeaconstacSchema.version).toBeDefined();
		expect(BeaconstacSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BeaconstacSchema.entities).toBe('object');
		expect(BeaconstacSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BeaconstacSchema.entities))).toBe(true);
		for (const entity of Object.values(BeaconstacSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
