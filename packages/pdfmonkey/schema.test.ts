import { PDFMonkeySchema } from './schema';

describe('PDFMonkey schema', () => {
	it('declares a semver version', () => {
		expect(PDFMonkeySchema.version).toBeDefined();
		expect(PDFMonkeySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PDFMonkeySchema.entities).toBe('object');
		expect(PDFMonkeySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PDFMonkeySchema.entities))).toBe(true);
		for (const entity of Object.values(PDFMonkeySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
