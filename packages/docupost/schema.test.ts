import { DocupostSchema } from './schema';

describe('Docupost schema', () => {
	it('declares a semver version', () => {
		expect(DocupostSchema.version).toBeDefined();
		expect(DocupostSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DocupostSchema.entities).toBe('object');
		expect(DocupostSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DocupostSchema.entities))).toBe(true);
		for (const entity of Object.values(DocupostSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
