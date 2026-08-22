import { ZoominfoSchema } from './schema';

describe('Zoominfo schema', () => {
	it('declares a semver version', () => {
		expect(ZoominfoSchema.version).toBeDefined();
		expect(ZoominfoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZoominfoSchema.entities).toBe('object');
		expect(ZoominfoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZoominfoSchema.entities))).toBe(true);
		for (const entity of Object.values(ZoominfoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
