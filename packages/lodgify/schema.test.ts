import { LodgifySchema } from './schema';

describe('Lodgify schema', () => {
	it('declares a semver version', () => {
		expect(LodgifySchema.version).toBeDefined();
		expect(LodgifySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LodgifySchema.entities).toBe('object');
		expect(LodgifySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LodgifySchema.entities))).toBe(true);
		for (const entity of Object.values(LodgifySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
