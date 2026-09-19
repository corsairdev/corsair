import { TwentyOneRiskSchema } from './schema';

describe('TwentyOneRisk schema', () => {
	it('declares a semver version', () => {
		expect(TwentyOneRiskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(TwentyOneRiskSchema.entities).toBeDefined();
		expect(typeof TwentyOneRiskSchema.entities).toBe('object');
		expect(TwentyOneRiskSchema.entities).not.toBeNull();
	});

	it('declares no entities, matching the read-only OData surface', () => {
		// Pinned deliberately: if an entity is added, its shape must come from
		// the service's `$metadata` document, and this expectation is the
		// prompt to update the test alongside it.
		expect(Object.keys(TwentyOneRiskSchema.entities)).toEqual([]);
	});
});
