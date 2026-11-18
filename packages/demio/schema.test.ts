import { DemioSchema } from './schema';

describe('Demio schema', () => {
	it('declares a semver version', () => {
		expect(DemioSchema.version).toBeDefined();
		expect(DemioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// Nothing is cached: an event's date list changes more often than a stored
	// copy would be read, so a stale entity is worse than the call it saves.
	// Asserted on the value itself, since Object.keys of any object is an array.
	it('stores no entities', () => {
		expect(Array.isArray(DemioSchema.entities)).toBe(false);
		expect(DemioSchema.entities).toEqual({});
	});
});
