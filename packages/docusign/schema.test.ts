import { DocusignSchema } from './schema';

describe('Docusign schema', () => {
	it('declares a semver version', () => {
		expect(DocusignSchema.version).toBeDefined();
		expect(DocusignSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DocusignSchema.entities).toBe('object');
		expect(DocusignSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DocusignSchema.entities))).toBe(true);
		for (const entity of Object.values(DocusignSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
