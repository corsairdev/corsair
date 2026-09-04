import { OcrWebServiceSchema } from './schema';

describe('OcrWebService schema', () => {
	it('declares a semver version', () => {
		expect(OcrWebServiceSchema.version).toBeDefined();
		expect(OcrWebServiceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares account and document entities from the REST docs', () => {
		expect(Object.keys(OcrWebServiceSchema.entities)).toEqual([
			'accounts',
			'documents',
		]);
		expect(OcrWebServiceSchema.entities.accounts).toBeDefined();
		expect(OcrWebServiceSchema.entities.documents).toBeDefined();
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
