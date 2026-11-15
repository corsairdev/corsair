import { OpenseaSchema } from './schema';

describe('Opensea schema', () => {
	it('declares a semver version', () => {
		expect(OpenseaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	/**
	 * Asserted on the value itself. `Object.keys(schema.entities)` is always an
	 * array, so a test built on it can never fail.
	 */
	it('stages no entities, and says why', () => {
		expect(OpenseaSchema.entities).toEqual({});
		expect(Array.isArray(OpenseaSchema.entities)).toBe(false);
	});
});
