import { HypeAuditorSchema } from './schema';

describe('hypeauditor schema', () => {
	it('declares a semver version', () => {
		expect(HypeAuditorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because every read is a live API call', () => {
		expect(Array.isArray(HypeAuditorSchema.entities)).toBe(false);
		expect(HypeAuditorSchema.entities).toEqual({});
	});
});
