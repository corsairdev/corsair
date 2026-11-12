import { HeyySchema } from './schema';

describe('HeyySchema', () => {
	it('is a string version in semver form', () => {
		expect(HeyySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities', () => {
		// Asserted on the value, because Object.keys(entities) is an array
		// whatever the schema holds.
		expect(Array.isArray(HeyySchema.entities)).toBe(false);
		expect(HeyySchema.entities).toEqual({});
	});
});
