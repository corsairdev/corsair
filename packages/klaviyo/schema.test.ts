import { KlaviyoSchema } from './schema';

describe('KlaviyoSchema', () => {
	it('is a string version in semver form', () => {
		expect(KlaviyoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities', () => {
		// Asserted on the value, because Object.keys(entities) is an array
		// whatever the schema holds.
		expect(Array.isArray(KlaviyoSchema.entities)).toBe(false);
		expect(KlaviyoSchema.entities).toEqual({});
	});
});
