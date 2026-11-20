import { TombaSchema } from './schema';

describe('Tomba schema', () => {
	it('declares a semver version', () => {
		expect(TombaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Lookups are answered live and cost credits per call, so caching them
		// locally would also hide when a balance ran out.
		expect(Array.isArray(TombaSchema.entities)).toBe(false);
		expect(TombaSchema.entities).toEqual({});
	});
});
