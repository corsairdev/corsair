import { SegmentSchema } from './schema';

describe('Segment schema', () => {
	it('declares a semver version', () => {
		expect(SegmentSchema.version).toBeDefined();
		expect(SegmentSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No sync: the Public API is configuration state the agent reads on
	// demand, so there is no entity set worth storing locally.
	it('stores no entities', () => {
		expect(Array.isArray(SegmentSchema.entities)).toBe(false);
		expect(SegmentSchema.entities).toEqual({});
	});
});
