import { KlazifySchema } from './schema';

describe('Klazify schema', () => {
	it('declares a semver version', () => {
		expect(KlazifySchema.version).toBeDefined();
		expect(KlazifySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// Nothing is cached: Klazify is a lookup service, and the per-call `refresh`
	// flag already decides whether the provider re-crawls. Asserted on the value
	// itself, since Object.keys of any object is an array.
	it('stores no entities', () => {
		expect(Array.isArray(KlazifySchema.entities)).toBe(false);
		expect(KlazifySchema.entities).toEqual({});
	});
});
