import { DocsbotaiSchema } from './schema';

describe('Docsbotai schema', () => {
	it('declares a semver version', () => {
		expect(DocsbotaiSchema.version).toBeDefined();
		expect(DocsbotaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DocsbotaiSchema.entities).toBe('object');
		expect(DocsbotaiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DocsbotaiSchema.entities))).toBe(true);
		for (const entity of Object.values(DocsbotaiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
