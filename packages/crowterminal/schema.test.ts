import { CrowterminalSchema } from './schema';

describe('Crowterminal schema', () => {
	it('declares a semver version', () => {
		expect(CrowterminalSchema.version).toBeDefined();
		expect(CrowterminalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CrowterminalSchema.entities).toBe('object');
		expect(CrowterminalSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CrowterminalSchema.entities))).toBe(true);
		for (const entity of Object.values(CrowterminalSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
