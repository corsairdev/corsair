import { MiroSchema } from './schema';

describe('MiroSchema', () => {
	it('is a string version in semver form', () => {
		expect(MiroSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities', () => {
		// Asserted on the value, because Object.keys(entities) is an array
		// whatever the schema holds.
		expect(Array.isArray(MiroSchema.entities)).toBe(false);
		expect(MiroSchema.entities).toEqual({});
	});
});
