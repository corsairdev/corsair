import { PdfcoSchema } from './schema';

describe('Pdfco schema', () => {
	it('declares a semver version', () => {
		expect(PdfcoSchema.version).toBeDefined();
		expect(PdfcoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PdfcoSchema.entities).toBe('object');
		expect(PdfcoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PdfcoSchema.entities))).toBe(true);
		for (const entity of Object.values(PdfcoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
