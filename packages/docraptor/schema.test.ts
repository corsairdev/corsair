import { DocRaptorSchema } from './schema';

describe('DocRaptor schema', () => {
	it('declares a semver version', () => {
		expect(DocRaptorSchema.version).toBeDefined();
		expect(DocRaptorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because documents are rendered once and fetched by URL, not synced into a database', () => {
		expect(Array.isArray(DocRaptorSchema.entities)).toBe(false);
		expect(DocRaptorSchema.entities).toEqual({});
	});
});
