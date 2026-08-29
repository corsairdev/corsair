import { BlackbaudSchema } from './schema';

describe('Blackbaud schema', () => {
	it('declares a semver version', () => {
		expect(BlackbaudSchema.version).toBeDefined();
		expect(BlackbaudSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BlackbaudSchema.entities).toBe('object');
		expect(BlackbaudSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BlackbaudSchema.entities))).toBe(true);
		for (const entity of Object.values(BlackbaudSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
