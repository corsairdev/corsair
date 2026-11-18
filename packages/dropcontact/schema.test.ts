import { DropcontactSchema } from './schema';

describe('DropcontactSchema', () => {
	it('is a string version in semver form', () => {
		expect(DropcontactSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities', () => {
		// Asserted on the value, because Object.keys(entities) is an array
		// whatever the schema holds.
		expect(Array.isArray(DropcontactSchema.entities)).toBe(false);
		expect(DropcontactSchema.entities).toEqual({});
	});
});
