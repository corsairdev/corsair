import { QuadernoSchema } from './schema';

describe('Quaderno schema', () => {
	it('declares a semver version', () => {
		expect(QuadernoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	/**
	 * Asserted on the value itself. `Object.keys(schema.entities)` is always an
	 * array, so a test built on it could never fail.
	 */
	it('stages no entities, and says why', () => {
		expect(QuadernoSchema.entities).toEqual({});
		expect(Array.isArray(QuadernoSchema.entities)).toBe(false);
	});
});
