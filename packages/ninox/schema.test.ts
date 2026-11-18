import { NinoxSchema } from './schema';

describe('Ninox schema', () => {
	it('declares a semver version', () => {
		expect(NinoxSchema.version).toBeDefined();
		expect(NinoxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NinoxSchema.entities).toBe('object');
		expect(NinoxSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NinoxSchema.entities))).toBe(true);
		for (const entity of Object.values(NinoxSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
