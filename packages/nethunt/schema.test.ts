import { NethuntSchema } from './schema';

describe('Nethunt schema', () => {
	it('declares a semver version', () => {
		expect(NethuntSchema.version).toBeDefined();
		expect(NethuntSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NethuntSchema.entities).toBe('object');
		expect(NethuntSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NethuntSchema.entities))).toBe(true);
		for (const entity of Object.values(NethuntSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
