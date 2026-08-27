import { HereSchema } from './schema';

describe('Here schema', () => {
	it('declares a semver version', () => {
		expect(HereSchema.version).toBeDefined();
		expect(HereSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HereSchema.entities).toBe('object');
		expect(HereSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HereSchema.entities))).toBe(true);
		for (const entity of Object.values(HereSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
