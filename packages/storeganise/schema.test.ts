import { StoreganiseSchema } from './schema';

describe('StoreganiseSchema', () => {
	it('declares a semver version', () => {
		expect(StoreganiseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the API returns live records and webhook data is ids the caller resolves', () => {
		expect(Array.isArray(StoreganiseSchema.entities)).toBe(false);
		expect(StoreganiseSchema.entities).toEqual({});
	});
});
