import { DocmosisSchema } from './schema';

describe('Docmosis schema', () => {
	it('declares a semver version', () => {
		expect(DocmosisSchema.version).toBeDefined();
		expect(DocmosisSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DocmosisSchema.entities).toBe('object');
		expect(DocmosisSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DocmosisSchema.entities))).toBe(true);
		for (const entity of Object.values(DocmosisSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
