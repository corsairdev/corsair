import { DocuSealSchema } from './schema';

describe('DocuSeal schema', () => {
	it('declares a semver version', () => {
		expect(DocuSealSchema.version).toBeDefined();
		expect(DocuSealSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because DocuSeal state is read back from the API on every call', () => {
		expect(Array.isArray(DocuSealSchema.entities)).toBe(false);
		expect(DocuSealSchema.entities).toEqual({});
	});
});
