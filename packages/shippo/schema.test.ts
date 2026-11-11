import { ShippoSchema } from './schema';

describe('Shippo schema', () => {
	it('declares a semver version', () => {
		expect(ShippoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because nothing is cached locally', () => {
		// Asserting on the value, not `Object.keys`, which is always an array.
		expect(Array.isArray(ShippoSchema.entities)).toBe(false);
		expect(ShippoSchema.entities).toEqual({});
	});
});
