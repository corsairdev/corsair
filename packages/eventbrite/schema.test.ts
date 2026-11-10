import { EventbriteSchema } from './schema';

describe('Eventbrite schema', () => {
	it('declares a semver version', () => {
		expect(EventbriteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because nothing is cached locally', () => {
		// Asserting on the value itself, not `Object.keys`, which is always an
		// array and so could never fail.
		expect(Array.isArray(EventbriteSchema.entities)).toBe(false);
		expect(EventbriteSchema.entities).toEqual({});
	});
});
