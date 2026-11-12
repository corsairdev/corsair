import { KnackSchema } from './schema';

describe('Knack schema', () => {
	it('declares a semver version', () => {
		expect(KnackSchema.version).toBeDefined();
		expect(KnackSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// Nothing is cached: Knack records change through the app's own forms and
	// automations as well as this API, so a stored copy would report a state the
	// caller never sees. Asserted on the value itself, since Object.keys of any
	// object is an array and so can never fail.
	it('stores no entities', () => {
		expect(Array.isArray(KnackSchema.entities)).toBe(false);
		expect(KnackSchema.entities).toEqual({});
	});
});
